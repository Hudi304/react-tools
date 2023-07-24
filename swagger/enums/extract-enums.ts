import { ENUM_schema } from './../types/enum-types'
import { DataSourceConfig } from '../configs/ds-types'
import { SwaggerJSON } from '../common/io'
import { parseFileName } from '../common/utils'

type Cascada_Enum = {
  name: string
  values: []
}

export function extract_enums_from_ds(swagger_json: SwaggerJSON, ds_conf: DataSourceConfig): ENUM_schema[] {
  //todo make this path dynamic
  const schemaJSON: any = swagger_json.components?.schemas
  const schemasObjKeys = Object.keys(schemaJSON)
  const enumsNames: string[] = schemasObjKeys.filter((key) => schemaJSON[key].enum)

  const enums: Cascada_Enum[] = enumsNames.map((key: string) => {
    const enum_schema = schemaJSON[key]

    const enum_value_names = enum_schema['x-enumNames']

    if (enum_value_names) {
      const values = enum_schema.enum.map((value: any, index: number) => [enum_value_names[index], value])

      return { name: parseFileName(key), values }
    }

    return { name: parseFileName(key), values: ['-', enum_schema.enum] }
  })

  const enumFilesList: ENUM_schema[] = enums.map((en: Cascada_Enum) => {
    // const enumValues = get_enum_values(en.values)

    const file: ENUM_schema = {
      filePath: ds_conf.enums.path,
      name: en.name,
      values: en.values.map((val) => {
        return {
          name: val[0],
          value: val[1],
        }
      }),
    }
    return file
  })
  return enumFilesList
}

function get_enum_values(values: string[]): { name: string; value: string }[] {
  const arrayOfValues: {
    name: string
    value: string
  }[] = []

  values.forEach((enumValue) => {
    const value = {
      name: enumValue,
      value: enumValue,
    }
    arrayOfValues.push(value)
  })
  return arrayOfValues
}
