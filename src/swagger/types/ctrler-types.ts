import {
  SCHEMA_TYPE,
  IMPORT_schema,
  SchemaImports,
  SchemaIgnores,
  SchemaFileContent,
} from './types';

export type EndpointParam = {
  name: string;
  in: string;
  required: boolean;
  schema: any;
};

export type ENDPOINT_schema = {
  controller_name: string;

  methodName: string;
  method: string;
  path: string;
  // TODO make this a result
  summary: string | null;

  responseType: SCHEMA_TYPE | null;
  requestType: SCHEMA_TYPE | null;

  imports: IMPORT_schema[] | null;
  params: {
    path: EndpointParam[];
    query: EndpointParam[];
    header: EndpointParam[];
  };
};

export type CONTROLLER_format = {
  file_name: string;
  endpoints: ENDPOINT_schema[];
};

/**
 * ```typescript
 * ControllerFile_Imp =
 * {
 *    file_name: string
 *    endpoints: ENDPOINT_schema[]
 *    imports: IMPORT_schema[]
 * }
 * ```
 */
export type ControllerFile_Imp = CONTROLLER_format & SchemaImports;

/**
 * ```typescript
 * ControllerFile_Imp_Ign =
 * {
 *    file_name: string
 *    endpoints: ENDPOINT_schema[]
 *    imports: IMPORT_schema[]
 *    ignores: Map<number, string[]> | null
 * }
 * ```
 */
export type ControllerFile_Imp_Ign = CONTROLLER_format & SchemaImports & SchemaIgnores;

/**
 * ```typescript
 * ControllerFile_Imp_Ign_Cnt =
 * {
 *    file_name: string
 *    endpoints: ENDPOINT_schema[]
 *    imports: IMPORT_schema[]
 *    ignores: Map<number, string[]> | null
 *    content: string[]
 * }
 * ```
 */
export type ControllerFile_Imp_Ign_Cnt = CONTROLLER_format &
  SchemaImports &
  SchemaIgnores &
  SchemaFileContent;
