/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FILE_TYPE, IMPORT_schema } from '../types/types'
import { isModel } from '../common/utils'
import { ENUM_schema } from '../types/enum-types'
import { MODEL_schema } from '../types/model-types'
import { ControllerFile_Imp, ENDPOINT_schema } from '../types/ctrler-types'
import { get_type_schema } from '../common/imports'

export function get_controller_imports(
  controllers: Map<string, ENDPOINT_schema[]>,
  enums: ENUM_schema[],
  models: MODEL_schema[],
): Map<string, ControllerFile_Imp> {
  const controller_map = new Map<string, ControllerFile_Imp>()
  const enum_map = new Map(enums?.map((e) => [e.name, e]))
  const model_map = new Map(models?.map((e) => [e.name, e]))
  const controller_iter = controllers[Symbol.iterator]()
  for (const [controller_name, endpoints] of controller_iter) {
    const imports_list = collect_imports(endpoints, enum_map, model_map)
    const map = new Map(imports_list.map((i) => [i.name, i]))
    const imports_array = Array.from(map.values())
    const end_pts = controllers.get(controller_name)!
    const contr: ControllerFile_Imp = {
      imports: imports_array,
      endpoints: end_pts,
      file_name: controller_name,
    }
    controller_map.set(controller_name, contr)
  }

  return controller_map
}

function collect_imports(
  endpoints: ENDPOINT_schema[],
  enum_map: Map<string, ENUM_schema>,
  model_map: Map<string, MODEL_schema>,
) {
  let imports_list: IMPORT_schema[] = []
  endpoints.forEach((endpoint) => {
    const end_imports = get_endpoint_imports(endpoint, enum_map, model_map)
    imports_list = imports_list.concat(end_imports)
  })

  return imports_list
}

function get_endpoint_imports(
  endpoint: ENDPOINT_schema,
  enum_map: Map<string, ENUM_schema>,
  model_map: Map<string, MODEL_schema>,
): IMPORT_schema[] {
  const request_type_name = endpoint.requestType?.type || null
  const response_type_name = endpoint.responseType?.type || null

  const imports_list: IMPORT_schema[] = []

  // prettier-ignore
  const request_type_schema = get_type_schema(request_type_name, enum_map, model_map)
  // prettier-ignore
  const response_type_schema = get_type_schema(response_type_name, enum_map, model_map)

  //TODO  QUERY PARAMS
  // query params, I believe these should be primitives ignore them for now
  // they can be objects if you ever have trouble implement this
  // const query_params = endpoint.params.query
  // query_params.forEach((q_param) => {
  //   console.log('q_param : ', q_param)
  // })

  //TODO  HEADER PARAMS
  // const header_params = endpoint.params.header
  // header_params.forEach((h_param) => {
  //   console.log('h_param : ', h_param)
  // })

  //TODO  HEADER PARAMS
  // we have no example of this
  // const path_params = endpoint.params.path
  // path_params.forEach((p_param) => {
  //   console.log('p_param : ', p_param)
  // })

  if (
    response_type_schema !== null &&
    typeof response_type_schema !== 'string'
  ) {
    const isMod = isModel(response_type_schema)
    const import_line: IMPORT_schema = {
      name: response_type_schema.name,
      path: response_type_schema.filePath,
      fileType: isMod ? FILE_TYPE.MODEL : FILE_TYPE.ENUM,
    }
    imports_list.push(import_line)
  }

  if (request_type_schema !== null && typeof request_type_schema !== 'string') {
    const isMod = isModel(request_type_schema)
    const import_line: IMPORT_schema = {
      name: request_type_schema.name,
      path: request_type_schema.filePath,
      fileType: isMod ? FILE_TYPE.MODEL : FILE_TYPE.ENUM,
    }
    imports_list.push(import_line)
  }

  return imports_list
}
