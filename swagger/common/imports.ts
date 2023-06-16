import { ENUM_schema } from '../types/enum-types'
import { MODEL_schema } from '../types/model-types'

/**Looks in both the extracted enums map and the extracted models map
 * and return the whole object if it finds it. */
export function get_type_schema(
  schemaType: string | null,
  enum_map: Map<string, ENUM_schema>,
  model_map: Map<string, MODEL_schema>,
): ENUM_schema | MODEL_schema | string | null {
  if (schemaType == null) {
    return null
  }

  const enum_schema = enum_map.get(schemaType) || null
  const model_schema = model_map.get(schemaType) || null

  if (enum_schema != null && model_schema !== null) {
    print_name_conflict(enum_schema, model_schema)
    return model_schema
  }

  if (enum_schema !== null) {
    return enum_schema
  }

  if (model_schema !== null) {
    return model_schema
  }

  // both enum schema and model schema are null
  // schemaType is not null, so it's probably a primitive
  return schemaType
}

function print_name_conflict(
  enum_schema: ENUM_schema,
  model_schema: MODEL_schema,
) {
  console.log('Well this is awkward ...')
  console.log('  looks like you have a name conflict between these 2 files :')
  console.log('enum : ', enum_schema)
  console.log('model_map : ', model_schema)
}
