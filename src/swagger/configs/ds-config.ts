//TODO make the script search for the .env files

// import { SERVER_URL } from '../../urls'
import { DataSourceConfig } from './ds-types'

const swagger_path = '/swagger/v1/swagger.json'
const DATA_WAREHOUSE_URL = '' + swagger_path

const BASE_URL = 'import.meta.env.VITE_APP_API_URL'

const DATA_WAREHOUSE_models_filter = {
  excludeEndsWith: [],
  exclude_ends_with: [],
  include: [],
  startsWith: [],
  exclude_file_names: [],
}

const default_imports = ["import { API } from '@/api/api';"]

const API_FILTERS = {
  exclude_ends_with: [],
  startsWith: [],
  excludeEndsWith: [],
  include: [],
  exclude_file_names: [],
}

const generics = ['TableFilter', 'TableResponse', 'ChartResponse', 'ChartDataPoint']

const DataWarehouse: DataSourceConfig = {
  name: 'SERVER_NAME',
  swagger_URL: DATA_WAREHOUSE_URL,
  baseURL: BASE_URL,
  local_swagger_path: 'src/swagger/response.json',
  generics: [],
  enums: {
    path: '/common/enums/',
    filter: {},
  },
  models: {
    path: '/common/models/',
    filter: DATA_WAREHOUSE_models_filter,
  },
  apis: {
    path: '/api/endpoints/',
    default_imports,
    filter: API_FILTERS,
  },
}

export const DS_CONFIGS: DataSourceConfig[] = [DataWarehouse]
