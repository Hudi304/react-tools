import { ENUM_schema } from './../types/enum-types'
import { DTO_File, FILE_TYPE } from '../types/types'

export function format_enums_from_ds(enums: ENUM_schema[]): DTO_File[] {
  const dtoFileArray: DTO_File[] = []

  enums.forEach((value) => {
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
    const valueRow = `${enumValue.name} = \"${enumValue.value}\"`
    const rowEndChar = index < values.length - 1 ? ',' : ''
    enumBodyString += `\n  ${valueRow}${rowEndChar}`
  })
  return enumBodyString
}
