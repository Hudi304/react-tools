import { PROPERTY_Format, SchemaFileContent, SchemaImports } from './types'

export type MODEL_schema = {
  filePath: string
  name: string
  properties: PROPERTY_Format[]
}

export type MODEL_format = {
  format: MODEL_schema
}

export type ModelFile_Imp = MODEL_format & SchemaImports
export type ModelFile_Imp_Cnt = MODEL_format & SchemaImports & SchemaFileContent
