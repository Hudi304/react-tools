import { clean_model_name, format_generic_type, getSchemaType, getType } from '../common/utils';
import { SCHEMA_TYPE } from '../types/types';
import { SwaggerJSON } from '../common/io';
import { ENDPOINT_schema, EndpointParam } from '../types/ctrler-types';
import { DataSourceConfig } from '../configs/ds-types';

/** .*/
export function extract_apis_from_ds(
  swagger_json: SwaggerJSON,
  ds_conf: DataSourceConfig,
): ENDPOINT_schema[] {
  //TODO try to add the response models as imports as well
  const paths = swagger_json.paths;
  const json_paths_obj = paths;
  const URLs = Object.keys(paths);
  const endpoints: ENDPOINT_schema[] = [];

  // TODO add a type for the import schema
  // for every URL
  URLs.forEach((URL) => {
    const api_schema = json_paths_obj[URL];
    const methods = Object.keys(api_schema);
    // for every http method of the same URL
    methods.forEach((method) => {
      const endpoint_schema = api_schema[method];

      const endpoint: ENDPOINT_schema = {
        method,
        controller_name: get_controller_name(endpoint_schema),
        methodName: endpoint_schema.operationId + 'Api',
        requestType: get_request_body_type(endpoint_schema, ds_conf),
        responseType: get_2xx_response_type(endpoint_schema, ds_conf),
        imports: null,
        summary: endpoint_schema.summary ?? null,
        path: clean_URL(URL, ds_conf),
        params: {
          path: get_parameters(endpoint_schema, 'path'),
          header: get_parameters(endpoint_schema, 'header'),
          query: get_parameters(endpoint_schema, 'query'),
        },
      };

      endpoints.push(endpoint);
    });
  });

  return endpoints;
}
/** Groups endpoint extractions into controllers by the controller name,
 * that is found as a tag in the schema.
 */
export function group_apis(endpoints: ENDPOINT_schema[]): Map<string, ENDPOINT_schema[]> {
  const api_groups = new Map<string, ENDPOINT_schema[]>();

  endpoints.forEach((endpoint) => {
    const controller_name = endpoint.controller_name;
    const controller_group = api_groups.get(controller_name) ?? [];

    controller_group.push(endpoint);
    api_groups.set(controller_name, controller_group);
  });

  return api_groups;
}

function get_controller_name(endpoint: any): string {
  return endpoint.tags[0] ?? 'services';
}

function get_request_body_content(endpoint: any) {
  if (!endpoint || !endpoint.requestBody) return null;

  const request_body = endpoint.requestBody;
  const content = request_body.content;

  if (!content) return null;

  return content;
}

/** return null if request has no body */
function get_request_body_type(endpoint: any, ds_conf: DataSourceConfig): SCHEMA_TYPE | null {
  const requestContent = get_request_body_content(endpoint);

  if (!requestContent) return null;

  const app_json = requestContent['application/json'];
  const multipart_form_data = requestContent['multipart/form-data'];

  let request_type;

  if (multipart_form_data !== undefined) {
    request_type = getType(multipart_form_data.schema);
  }
  if (app_json !== undefined) {
    request_type = getType(app_json.schema);
  }

  if (!app_json) return null;

  const schemaType = getSchemaType(app_json.schema);
  const generic_type_name = format_generic_type(schemaType, ds_conf);

  if (generic_type_name === null) {
    return null;
  }

  const clean = clean_model_name(generic_type_name?.type || '');
  return {
    ...generic_type_name,
    type: clean,
  };
}

function get_2xx_response_type(endpoint: any, ds_conf: DataSourceConfig): SCHEMA_TYPE | null {
  const responses = endpoint.responses;
  let response_content;

  switch (true) {
    case responses['200'] !== undefined:
      response_content = responses['200'].content;
      break;
    case responses['201'] !== undefined:
      response_content = responses['201'].content;
      break;
    case responses['204'] !== undefined:
      response_content = responses['204'].content;
      break;
    default:
      return null;
  }
  if (response_content === undefined) return null;

  const response_type_app_json = response_content['application/json'];
  if (response_type_app_json === undefined) return null;

  const schema = response_type_app_json.schema;
  if (schema === undefined) return null;

  const response_type: SCHEMA_TYPE = getSchemaType(schema);
  const generic_type_name = format_generic_type(response_type, ds_conf);
  if (generic_type_name === null) return null;

  const clean = clean_model_name(generic_type_name?.type || '');

  return {
    ...generic_type_name,
    type: clean,
  };
}

function get_parameters(endpoint: any, param_type: string): EndpointParam[] {
  const parameters = endpoint.parameters;

  if (!parameters || parameters.length === 0) return [];

  return parameters.filter((param: any) => param.in === param_type) ?? [];
}

function clean_URL(URL: string, ds_conf: DataSourceConfig) {
  return URL.replace(`/${ds_conf.name}`, '')
    .replace(/{version}/gm, 'v1')
    .replace(/{/gm, '${');
}
