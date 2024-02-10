import { getImportString } from '../models/model-formetter'
import {
  ControllerFile_Imp_Ign,
  ControllerFile_Imp_Ign_Cnt,
  ENDPOINT_schema,
} from '../types/ctrler-types'
import { DataSourceConfig } from '../configs/ds-types'
import { SCHEMA_TYPE } from '../types/types'
import {
  format_generic_type,
  getType,
  lowercaseFirstLetter,
} from '../common/utils'

//TODO the endpoint call ca be split into (for the comments)
// fn declaration
// function parameters
// response type
// function implementation
export function format_controllers(
  controllers: Map<string, ControllerFile_Imp_Ign>,
  ds_conf: DataSourceConfig,
): Map<string, ControllerFile_Imp_Ign_Cnt> {
  const rez = new Map<string, ControllerFile_Imp_Ign_Cnt>()

  const controller_iter = controllers[Symbol.iterator]()
  for (const [controller_name, controller_file] of controller_iter) {
    const formatted_endpoints: string[] = []
    const endpoints = controller_file.endpoints

    endpoints.forEach((endpoint) => {
      const split_f_name = endpoint.methodName.split('_')
      const clean_method_name = split_f_name[split_f_name.length - 1] || ''
      const fn_name = lowercaseFirstLetter(clean_method_name)
      const { responseType } = endpoint
      const response_type = format_generic_type(responseType, ds_conf)
      const fn_params_strings = build_fn_params(endpoint, ds_conf)

      let fn_params = fn_params_strings.join(',\n  ')

      if (fn_params_strings.length > 0) {
        fn_params = `\n  ${fn_params}\n`
      }

      const fn_body = build_fn_body(endpoint, ds_conf)

      const promise_type = get_response_type(response_type)
      const doc_comment = get_endpoint_summary(endpoint)
      const signature = `export const ${fn_name} = (${fn_params}): Promise<${promise_type}>`
      const fn = `${doc_comment} ${signature} => {\n  ${fn_body} \n}`
      formatted_endpoints.push(fn + '\n')
    })

    const default_imports = ds_conf.apis.default_imports || []
    const model_imports = getImportString(controller_file.imports)
    const import_lines = default_imports.concat(model_imports)
    const baseURL = ds_conf.baseURL
    const server_URL = [`\n const URL = ${baseURL}\n`]

    const file_content = import_lines
      .concat(server_URL)
      .concat(formatted_endpoints)

    const file: ControllerFile_Imp_Ign_Cnt = {
      content: file_content,
      file_name: controller_file.file_name,
      endpoints: controller_file.endpoints,
      ignores: controller_file.ignores,
      imports: controller_file.imports,
    }

    rez.set(controller_name, file)
  }

  return rez
}

function get_endpoint_summary(endpoint: ENDPOINT_schema): string {
  const summary = endpoint.summary
  if (summary === null) return ''
  return `/** ${endpoint.summary} */\n`
}

function get_response_type(response_type: SCHEMA_TYPE | null): string {
  if (response_type == null) {
    return 'any'
  }
  const { isGeneric, wrappedType, type } = response_type

  if (isGeneric) {
    return wrappedType!
  } else {
    //not generic
    const { isArray } = response_type
    if (isArray) {
      return type + '[]'
    }

    return type
  }
}

export function build_query_params(queryParams: any[]): string {
  let rez = ''
  if (!queryParams?.length) {
    return rez
  }

  //TODO add function urlSearchParams
  const quarryParamArray = queryParams.map(
    (item: any) =>
      lowercaseFirstLetter(item.name) +
      '=${ queryParams.' +
      lowercaseFirstLetter(item.name) +
      ' ?? ""}',
  )
  rez = ' + `?' + quarryParamArray.join('&') + '`'

  return rez
}

export function build_fn_params(
  endpoint: ENDPOINT_schema,
  ds_conf: DataSourceConfig,
) {
  const endpoint_params = endpoint.params
  const requestType = endpoint.requestType

  const { header, path, query } = endpoint_params

  const header_params = header || []
  const path_params = path || []
  const query_params = query || []

  // const params = header_params.concat(path_params).concat(query_params)

  function compile_param_line(params: any[]) {
    const param_result: string[] = []

    params.forEach((param) => {
      const param_type = getType(param.schema)
      const param_name = param.name
      const parameter = `${param_name}: ${param_type} | null`
      param_result.push(parameter)
    })

    return param_result
  }

  const cmp_path_params = compile_param_line(path_params)
  const cmp_query_params = query_params.map((q_param) => {
    const param_type = getType(q_param.schema)
    const param_name = q_param.name
    const parameter = `${param_name}?: ${param_type} | null`
    return parameter
  })
  const cmp_header_params = compile_param_line(header_params)

  const function_parameters: string[] =
    cmp_path_params.concat(cmp_header_params)

  if (cmp_query_params.length > 0) {
    const lower_first_letter_q_params =
      cmp_query_params.map(lowercaseFirstLetter)
    const cmp_query_params_obj_str =
      'queryParams: {\n    ' +
      lower_first_letter_q_params.join('\n    ') +
      '\n  } = {}'
    function_parameters.push(cmp_query_params_obj_str)
  }

  // params.forEach((param) => {
  //   const param_type = getType(param.schema)
  //   const param_name = param.name
  //   const parameter = `${param_name}: ${param_type} | null`
  //   function_parameters.push(parameter)
  // })

  if (requestType !== null && requestType !== null) {
    const fmt_bodyType = format_generic_type(requestType, ds_conf)

    const bodyType = fmt_bodyType?.isGeneric
      ? fmt_bodyType.wrappedType
      : fmt_bodyType?.type

    const request_body_fn_param = `body: ${bodyType}`
    function_parameters.push(request_body_fn_param)
  }

  return function_parameters
}

export function build_fn_body(
  endpoint: ENDPOINT_schema,
  ds_conf: DataSourceConfig,
): string {
  const method = endpoint.method.toLocaleLowerCase()
  const baseURL = ds_conf.baseURL
  const path = endpoint.path
  const request_body_type = endpoint.requestType
  const query_params = build_query_params(endpoint.params.query)
  let call_params = `URL + \`${path}\` ${query_params}`
  if (request_body_type !== null) {
    call_params += `, body`
  }

  const http_service_call = `API.${method}(${call_params})`
  return `return ${http_service_call}`
}
