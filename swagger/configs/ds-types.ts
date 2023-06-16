export type DataSourceConfig = {
  name: string
  SwaggerPath: string
  baseURL: string
  enums: FileConfig
  models: FileConfig
  apis: FileConfig
  generics: string[]
}

export type FileConfig = {
  path: string
  filter: DataSourceFilter
  default_imports?: string[]
}

export type DataSourceFilter = {
  exclude_ends_with?: string[]
  include_only_ends_with?: string[]
  startsWith?: string[]
  excludeEndsWith?: string[]
  include?: string[]
  exclude_file_names?: string[]
}
