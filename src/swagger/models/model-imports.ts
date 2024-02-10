import { get_type_schema } from '../common/imports'
import { DataSourceConfig } from '../configs/ds-types'
import { ENUM_schema } from '../types/enum-types'
import { MODEL_schema, ModelFile_Imp } from '../types/model-types'
import { IMPORT_schema, FILE_TYPE } from '../types/types'
import {
  getRef,
  isEnum,
  isModel,
  parseFileName,
  remove_start_end_slash as clean_path,
} from '../common/utils'

/**
 * Generates import information for model files and their dependencies.
 *
 * @param {ENUM_schema[]} enums - An array of ENUM schemas.
 * @param {MODEL_schema[]} models - An array of MODEL schemas.
 * @returns {Map<string, ModelFile_Imp>} A map of model file import information, including model properties and their dependencies.
 */
export function get_model_imports(
  enums: ENUM_schema[],
  models: MODEL_schema[],
): Map<string, ModelFile_Imp> {
  const enum_map = new Map(enums?.map((e) => [e.name, e]))
  const model_map = new Map(models?.map((e) => [e.name, e]))
  const model_files = new Map<string, ModelFile_Imp>()

  const model_iter = model_map[Symbol.iterator]()
  for (const [model_name, model_format] of model_iter) {
    const props = model_format.properties
    const imports_list: IMPORT_schema[] = []

    props.forEach((prop) => {
      const type_name = prop.propType.type
      const type_schema = get_type_schema(type_name, enum_map, model_map)
      if (type_schema !== null && typeof type_schema !== 'string') {
        const isMod = isModel(type_schema)
        const import_line: IMPORT_schema = {
          name: type_schema.name,
          path: type_schema.filePath,
          fileType: isMod ? FILE_TYPE.MODEL : FILE_TYPE.ENUM,
        }
        imports_list.push(import_line)
      }
    })

    const map = new Map(imports_list.map((i) => [i.name, i]))
    const imports_array = Array.from(map.values())

    const model_file = {
      format: model_format,
      imports: imports_array,
    }

    model_files.set(model_name, model_file)
  }

  return model_files
}

function extract_imports(
  model: { name: string; values: any },
  enums: ENUM_schema[],
  ds_conf: DataSourceConfig,
): IMPORT_schema[] {
  const properties: any = model.values.properties || {}
  const prop_keys = Object.keys(properties)
  const imports_list: IMPORT_schema[] = []

  prop_keys.forEach((key: string) => {
    const property = properties[key]
    const raw_ref = getRef(property)
    const name = parseFileName(raw_ref)

    if (name && model.name !== name) {
      const ref_is_enum = isEnum(name, enums)

      if (ref_is_enum) {
        const fileType = FILE_TYPE.ENUM
        const path = clean_path(ds_conf.enums.path)
        imports_list.push({ name, path, fileType })
      } else {
        const fileType = FILE_TYPE.MODEL
        const path = clean_path(ds_conf.models.path)
        imports_list.push({ name, path, fileType })
      }
    }
  })

  return imports_list
}
