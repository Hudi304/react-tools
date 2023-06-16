//TODO make the script search for the .env files

import { DataSourceConfig } from './ds-types'

const swagger_path = 'swagger/v1/swagger.json'
const DATA_WAREHOUSE_URL = 'http://' + swagger_path
const DIR_URL = 'https://' + swagger_path
const VAULT_URL = 'https://' + swagger_path
const MARKETPLACE_URL = 'https://' + swagger_path
const TREASURY_URL = 'https://' + swagger_path

const API_DATA_WAREHOUSE_URL = 'import.meta.env.VITE_APP_DATA_WAREHOUSE'
const API_DIR_URL = 'import.meta.env.VITE_APP_DIR'
const API_VAULT_URL = 'import.meta.env.VITE_APP_VAULT'
const API_MARKETPLACE_URL = 'import.meta.env.VITE_APP_MARKETPLACE'
const API_TREASURY_URL = 'import.meta.env.VITE_APP_TREASURY'

const startsWith = [
  'KnownNode',
  'AuthSessionViewModel',
  'JwtToken',
  'AccountViewModel',
  'NewUserViewModel',
  'SignerViewModel',
]

const DATA_WAREHOUSE_models_filter = {
  excludeEndsWith: [],
  exclude_ends_with: ['TableFilter'],
  include: [],
  startsWith: [],
  exclude_file_names: ['Uint256'],
}

const default_imports = [
  "import {  ChartResponse, TableFilter, TableResponse } from '@/api/api.types';",
  "import { API } from '@/api/api';",
]

const DATA_WAREHOUSE_apis_filters = {
  exclude_ends_with: [],
  startsWith,
  excludeEndsWith: [],
  include: [],
  exclude_file_names: [
    // 'account',
    // 'asset',
    // 'blockchain',
    // 'diagnostics',
    // 'transactions',
    // 'programs',
  ],
}

const DataWarehouse = {
  name: 'DATA_WAREHOUSE',
  SwaggerPath: DATA_WAREHOUSE_URL,
  baseURL: API_DATA_WAREHOUSE_URL,
  generics: ['TableFilter', 'TableResponse', 'ChartResponse', 'ChartDataPoint'],
  enums: {
    path: '/common/warehouse/enums/',
    filter: {},
  },
  models: {
    path: '/common/warehouse/models/',
    filter: DATA_WAREHOUSE_models_filter,
  },
  apis: {
    path: '/api/endpoints/warehouse/',
    default_imports,
    filter: DATA_WAREHOUSE_apis_filters,
  },
}

const DIR = {
  name: 'DIR',
  SwaggerPath: DIR_URL,
  baseURL: API_DIR_URL,
  generics: [],
  enums: {
    path: '/common/dir/enums',
    filter: {
      startsWith,
    },
  },
  models: {
    path: '/common/dir/models',
    filter: {
      startsWith,
    },
  },
  apis: {
    path: '/api/endpoints/dir/',
    default_imports,
    filter: {},
  },
}

// const TREASURY = {
//   name: 'TREASURY',
//   SwaggerPath: TREASURY_URL,
//   baseURL: API_TREASURY_URL,
//   generics: [],
//   enums: {
//     path: '/common/treasury/enums',
//     filter: {
//       startsWith,
//     },
//   },
//   models: {
//     path: '/common/treasury/models',
//     filter: {
//       startsWith,
//     },
//   },
//   apis: {
//     path: '/api/endpoints/treasury/',
//     default_imports,
//     filter: {},
//   },
// }

// const VAULT = {
//   name: 'VAULT',
//   SwaggerPath: VAULT_URL,
//   baseURL: API_VAULT_URL,
//   generics: [],
//   enums: {
//     path: '/common/vault/enums',
//     filter: {
//       startsWith,
//     },
//   },
//   models: {
//     path: '/common/vault/models',
//     filter: {
//       startsWith,
//     },
//   },
//   apis: {
//     path: '/api/endpoints/vault/',
//     default_imports,
//     filter: {},
//   },
// }

// const MARKETPLACE = {
//   name: 'MARKETPLACE',
//   SwaggerPath: MARKETPLACE_URL,
//   baseURL: API_MARKETPLACE_URL,
//   generics: [],
//   enums: {
//     path: '/common/mp-serv/enums',
//     filter: {},
//   },
//   models: {
//     path: '/common/mp-serv/models',
//     filter: {},
//   },
//   apis: {
//     path: '/api/endpoints/mp-serv/',
//     default_imports,
//     filter: {},
//   },
// }

export const data_sources: DataSourceConfig[] = [
  DataWarehouse,
  // DIR,
  // VAULT,
  // MARKETPLACE,
  // TREASURY,
]
