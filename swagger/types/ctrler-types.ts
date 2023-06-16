import {
  SCHEMA_TYPE,
  IMPORT_schema,
  SchemaImports,
  SchemaIgnores,
  SchemaFileContent,
} from './types'

export type ENDPOINT_schema = {
  controller_name: string

  methodName: string
  method: string
  path: string

  responseType: SCHEMA_TYPE | null
  requestType: SCHEMA_TYPE | null

  imports: IMPORT_schema[] | null
  params: {
    path: any[]
    query: any[]
    header: any[]
  }
}

export type CONTROLLER_format = {
  file_name: string
  endpoints: ENDPOINT_schema[]
}

/** - ControllerFile_Imp = {
 *  - endpoints: ENDPOINT_schema[]
 *  - imports: IMPORT_schema[]
 *  - }
 * */
export type ControllerFile_Imp = CONTROLLER_format & SchemaImports

/** - ControllerFile_Imp_Ign = {
 *  - endpoints: ENDPOINT_schema[]
 *  - imports: IMPORT_schema[]
 *  - ignores: Map<number, string[]> | null
 *  - }
 * */
export type ControllerFile_Imp_Ign = CONTROLLER_format &
  SchemaImports &
  SchemaIgnores

/** - ControllerFile_Imp_Ign_Cnt = {
 *  - endpoints: ENDPOINT_schema[]
 *  - imports: IMPORT_schema[]
 *  - ignores: Map<number, string[]> | null
 *  - content: string[]
 *  - }
 * */
export type ControllerFile_Imp_Ign_Cnt = CONTROLLER_format &
  SchemaImports &
  SchemaIgnores &
  SchemaFileContent
