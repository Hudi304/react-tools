/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { extract_apis_from_ds, group_apis } from './apis/api-extractor'
import { format_controllers } from './apis/api-formatter'
import { get_controller_imports } from './apis/api-imports'
import { parse_api_comments } from './apis/api-ignores'

import { extract_enums_from_ds } from './enums/extract-enums'
import { extract_models_from_ds } from './models/extract-models'
import { DS_CONFIGS } from './configs/ds-config'
import { DTO_File } from './types/types'
import { SwaggerJSON, get_swagger_JSON, writeFiles } from './common/io'
import { format_enums_from_ds } from './enums/format-enums'
import { format_models_from_ds } from './models/format-models'
import { get_model_imports } from './models/model-imports'
import { write_controllers, write_models } from './common/file-writers'
import { ENUM_schema } from './types/enum-types'
import {
  MODEL_schema,
  ModelFile_Imp,
  ModelFile_Imp_Cnt,
} from './types/model-types'
import {
  ENDPOINT_schema,
  ControllerFile_Imp,
  ControllerFile_Imp_Ign,
  ControllerFile_Imp_Ign_Cnt,
} from './types/ctrler-types'
import { DataSourceConfig } from './configs/ds-types'
import { filter_controllers, filter_models } from './common/filters/filters'
import { run_stage } from './common/common'

export const ROOT = 'src'
export const CONFIG_PATH = './src/tools/swagger.config.toml'

//todo make deleting files a different stage
// prettier-ignore
async function pipeline(ds_conf: DataSourceConfig) {
  //?? HTTP request Stage
  let swagger_json: SwaggerJSON | null = null
  await run_stage('HTTP REQUEST',ds_conf, async () => {
    swagger_json = await get_swagger_JSON(ds_conf)
  })

  if(swagger_json === null){
    return
  }

  // //?? Data Extraction Stage
  let enums: ENUM_schema[]
  let models: MODEL_schema[] 
  let endpoints: ENDPOINT_schema[] 
  await run_stage(`DATA EXTRACTION`, ds_conf , async () => {
    enums = extract_enums_from_ds(swagger_json!, ds_conf)
    models = extract_models_from_ds(swagger_json!, ds_conf)
    endpoints = extract_apis_from_ds(swagger_json!, ds_conf)
  })


  //?? Group endpoints in controllers
  let endpoints_groups: Map<string, ENDPOINT_schema[]> // Map <controller_name, endpoints[]>
  await run_stage(`GROUP ENDPOINTS`,ds_conf, async () => {
    endpoints_groups = group_apis(endpoints!)
  })

  //?? Imports Stage
  let model_files: Map<string, ModelFile_Imp>  
  let controller_files:Map<string, ControllerFile_Imp>
  await run_stage(`COMPUTE IMPORTS`,ds_conf, async () => {
    model_files = get_model_imports(enums!, models!)
    controller_files = get_controller_imports(endpoints_groups!, enums!, models!)
  })

  //?? Ignore stage
  let ign_controller:  Map<string, ControllerFile_Imp_Ign>
  await run_stage(`IGNORE COMMENTS`,ds_conf, async () => {
    ign_controller = parse_api_comments(controller_files!, ROOT + ds_conf.apis.path)
  })

  //?? Filter Stage
  // let filtered_enums: DTO_File[] 
  let filtered_models: Map<string, ModelFile_Imp>
  let filtered_controllers:  Map<string, ControllerFile_Imp_Ign>

  // let filtered_apis 
  await run_stage(`FILTER FILES`,ds_conf, async () => {
    // const filtered_enums: DTO_File[]  = filter_files(formatted_enums, ds_conf.enums.filter)
    filtered_models = filter_models(model_files, ds_conf.models.filter)
    filtered_controllers = filter_controllers(ign_controller, ds_conf.apis.filter)
  })
 
  //?? Data Formatting Stage
  let formatted_enums: DTO_File[]
  let formatted_models : Map<string, ModelFile_Imp_Cnt>
  let formatted_controllers : Map<string, ControllerFile_Imp_Ign_Cnt>
  await run_stage(`FORMAT FILES`,ds_conf, async () => {
    formatted_enums = format_enums_from_ds(enums!)
    formatted_models = format_models_from_ds(filtered_models!)
    formatted_controllers = format_controllers(filtered_controllers!,ds_conf)
  })

  //?? File Writing Stage
  await run_stage(`WRITE FILES`,ds_conf, async () => {
    writeFiles(ROOT, ds_conf.enums.path, 'enum.ts', formatted_enums!)
    write_models(formatted_models!,ds_conf)
    write_controllers(formatted_controllers!, ds_conf)
  })
}

async function run() {
  // the JSON processing of every server is independent,
  // so it ca be done on a different thread
  DS_CONFIGS.forEach(async (ds_conf) => {
    await pipeline(ds_conf)
  })
}

run()
