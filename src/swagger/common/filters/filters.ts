import { arrayToMap, mapToArray } from '../utils'
import { DataSourceFilter } from '../../configs/ds-types'
import { ModelFile_Imp } from '../../types/model-types'
import { ControllerFile_Imp_Ign } from '../../types/ctrler-types'
import {
  filter_ends_with,
  filter_include_only_file_name_ends_with,
  exclude_ends_with,
  exclude_file_name,
  filter_starts_with,
} from './filters_impl'

//TODO write tests for this
//prettier-ignore
export function filter_models(files: Map<string, ModelFile_Imp>, 
  filter: DataSourceFilter)
  : Map<string, ModelFile_Imp> {
  const { exclude_ends_with: endsWith,
    excludeEndsWith, 
    include,
    startsWith,
    exclude_file_names, 
    include_only_ends_with 
  } = filter
  const files_array = mapToArray(files)
  let filtered_array: ModelFile_Imp[] = []
  const file = (file:ModelFile_Imp) => file.format.name

  filtered_array =  filter_ends_with(files_array, file, endsWith) 
  filtered_array= filter_include_only_file_name_ends_with(files_array, file, include_only_ends_with)
  filtered_array =  filter_starts_with(filtered_array, file, startsWith) 
  filtered_array =  exclude_ends_with(filtered_array, file, excludeEndsWith) 
  // filtered_array =  exclude_ends_with(filtered_array, excludeEndsWith) 
  filtered_array = exclude_file_name(filtered_array, file, exclude_file_names )
  // rez =  include_file_name(rez, include) 

  const filtered_map: Map<string, ModelFile_Imp> = arrayToMap(
    filtered_array,
    (file) => file.format.name,
  )
  return filtered_map
}

// prettier-ignore
export function filter_controllers(
  file_map: Map<string, ControllerFile_Imp_Ign>,
  filter: DataSourceFilter,
): Map<string, ControllerFile_Imp_Ign> {
  const {
    exclude_ends_with: endsWith,
    excludeEndsWith,
    include,
    startsWith,
    exclude_file_names,
    include_only_ends_with,
  } = filter

  let filtered_array: ControllerFile_Imp_Ign[] = []

  const files_array: ControllerFile_Imp_Ign[] = mapToArray(file_map)
  const get_filename = (file: ControllerFile_Imp_Ign) => file.file_name

  filtered_array = filter_ends_with(files_array, get_filename, endsWith)
  filtered_array = filter_include_only_file_name_ends_with(files_array,get_filename,include_only_ends_with)
  filtered_array = filter_starts_with(filtered_array, get_filename, startsWith)
  filtered_array = exclude_ends_with(filtered_array, get_filename, excludeEndsWith)
  // filtered_array =  exclude_ends_with(filtered_array, excludeEndsWith)
  filtered_array = exclude_file_name(filtered_array, get_filename, exclude_file_names)
  // rez =  include_file_name(rez, include)
  const filtered_map = arrayToMap(filtered_array,get_filename)

  return filtered_map
}
