import { PROPERTY_Format } from '../types/types'
import {
  clean_model_name,
  getSchemaType,
  uppercaseFirstLetter,
} from '../common/utils'
import { SwaggerJSON } from '../common/io'
import { DataSourceConfig } from '../configs/ds-types'
import { MODEL_schema } from '../types/model-types'

/**
 * The method extract model schemas from swagger
 * after the API call and return an array of MODEL_Schema
 */
export function extract_models_from_ds(
  swagger_json: SwaggerJSON,
  ds_conf: DataSourceConfig,
): MODEL_schema[] {
  const schemaJSON: any = swagger_json.components.schemas
  const modelNames: string[] = get_model_keys(schemaJSON)

  const models = modelNames.map((name: string) => {
    return { name, values: schemaJSON[name] }
  })

  const extracted_models = extract_from_json(models, ds_conf)

  return extracted_models
}

/** Get only models from schemaObjects ignoring enums
 * and api controller
 */
function get_model_keys(schemaJSON: any): string[] {
  const schemasObjKeys = Object.keys(schemaJSON)
  const modelNames = schemasObjKeys.filter(
    (key) => schemaJSON[key].type === 'object',
  )

  return modelNames
}

/** Creating an formatted models with file path,
 * name of the object, and properties
 */
function extract_from_json(
  models: any,
  ds_conf: DataSourceConfig,
): MODEL_schema[] {
  if (models === null || models === undefined) {
    return []
  }

  const formatted_models = models.map(
    (model: { name: string; values: any }) => {
      const clean_name = clean_model_name(model.name)
      const modelClassName = uppercaseFirstLetter(clean_name)
      const mapped_properties = extract_properties(model)

      return {
        filePath: ds_conf.models.path,
        name: modelClassName,
        properties: mapped_properties,
      }
    },
  )

  return formatted_models
}

/** Extract properties for every object: access modifier, prop name,
 * prop type and default value
 */
function extract_properties(model: any): PROPERTY_Format[] {
  let properties: any = model.values.properties
  if (properties === undefined || properties === null) {
    properties = {}
  }
  const props = Object.entries(properties) || []
  const mapped_property: PROPERTY_Format[] = props.map(([key, v]) => {
    return {
      access_modifier: 'public',
      props_name: key,
      prop_type: getSchemaType(v),
      default_value: null,
    }
  })
  return mapped_property
}
