export enum FILE_TYPE {
  ENUM = 'enum',
  MODEL = 'model',
  API = 'api',
}

export type SchemaImports = {
  imports: IMPORT_schema[]
}

/** - key = line no of the first comment
 *  - value = line between the comments as strings
 *  - null => if the file has not ignores*/
export type SchemaIgnores = {
  ignores: Map<number, string[]> | null
}

export type SchemaFileContent = {
  content: string[]
}

export type DTO_File = {
  dtoType: FILE_TYPE
  filePath: string
  fileName: string
  content: string
}

export type IMPORT_schema = {
  fileType: FILE_TYPE
  name: string
  path: string
}

export type SCHEMA_TYPE = {
  type: string
  isArray: boolean
  isNullable: boolean
  isGeneric: boolean
  genericWrapper?: string
  wrappedType?: string
}

export type PROPERTY_Format = {
  access_modifier: string
  props_name: string
  prop_type: SCHEMA_TYPE
  default_value: string | null
  isNullable: boolean
}

export type MODEL_FROM_JSON_Format = {
  name: string
  values: {
    type: string
    properties: any
    additionalProperties: boolean
  }
}
