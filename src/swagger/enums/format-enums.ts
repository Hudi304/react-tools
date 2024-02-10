import { ENUM_schema, EnumValue } from '../types/enum-types'
import { DTO_File, FILE_TYPE } from '../types/types'

export enum EnumKeyValueFormatting {
  StringAndNumber = 0,
  StringAndString = 1,
  StringWithSpacesAndString = 2,
}

const enum_formatting_type = EnumKeyValueFormatting.StringWithSpacesAndString

export function format_enums_from_ds(enums: ENUM_schema[]): DTO_File[] {
  const dtoFileArray: DTO_File[] = []

  enums?.forEach((value) => {
    let fileContent = 'export enum '
    fileContent += value.name
    const enumBodyString = getEnumBody(value.values)
    fileContent += ` {${enumBodyString}\n}`
    dtoFileArray.push({
      dtoType: FILE_TYPE.ENUM,
      fileName: value.name,
      filePath: value.filePath,
      content: fileContent,
    })
  })

  return dtoFileArray
}

function getEnumBody(values: { name: string; value: string }[]): string {
  let enumBodyString = ''
  values.forEach((enumValue, index: any) => {
    const enumBodyLine = format_enum_key_value(enumValue, enum_formatting_type)

    const rowEndChar = index < values.length - 1 ? ',' : ''
    enumBodyString += `\n  ${enumBodyLine}${rowEndChar}`
  })

  return enumBodyString
}

function camelCaseToSpaces(input: string): string {
  //match uppercase starting word and put a space before it
  return input.replace(/([A-Z])([a-z]+)/g, (match) => ` ${match}`).trim()
}

function format_enum_key_value(enum_value: EnumValue, formatting_type: EnumKeyValueFormatting): string {
  switch (formatting_type) {
    case EnumKeyValueFormatting.StringAndNumber:
      return `${enum_value.name} = ${enum_value.value}`

    case EnumKeyValueFormatting.StringAndString:
      return `${enum_value.name} = "${enum_value.value}"`

    case EnumKeyValueFormatting.StringWithSpacesAndString:
      return `"${camelCaseToSpaces(enum_value.name)}" = "${enum_value.value}"`
  }
}
