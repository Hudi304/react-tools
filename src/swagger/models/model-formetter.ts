import {
  clean_model_name,
  lowercaseFirstLetter,
  remove_start_end_slash,
  uppercaseFirstLetter,
} from '../common/utils'
import {
  FILE_TYPE,
  IMPORT_schema,
  PROPERTY_Format,
  SCHEMA_TYPE,
} from '../types/types'
import {
  ModelFile_Imp,
  ModelFile_Imp_Cnt,
  MODEL_schema,
} from '../types/model-types'
import { getDefaultValue } from './model-utils'
import { getConstructor } from './model-constructor'

export function format_models_from_ds(
  models: Map<string, ModelFile_Imp>,
): Map<string, ModelFile_Imp_Cnt> {
  const rez = new Map<string, ModelFile_Imp_Cnt>()

  const models_iter = models[Symbol.iterator]()
  for (const [key, model_file] of models_iter) {
    const model = model_file.format
    let importString: string[] = []
    let propertiesString: string[] = []
    let constructor: string[] = []

    if (model) {
      importString = getImportString(model_file.imports)
      propertiesString = getProperties(model)
      // constructor = getConstructor(model_file)
      constructor = []
    }

    const fileName = clean_model_name(model.name)
    const modelClassName = uppercaseFirstLetter(fileName)
    // const class_declaration = [`export class ${modelClassName} { `]
    const class_declaration = [`export type ${modelClassName} =  { `]

    const line_arr = importString
      .concat([''])
      .concat(class_declaration)
      .concat(propertiesString)
      .concat(constructor)
      .concat(['}'])

    const md: ModelFile_Imp_Cnt = {
      format: model_file.format,
      imports: model_file.imports,
      content: line_arr,
    }

    rez.set(key, md)
  }

  return rez
}

/**
 * Generates import lines for TypeScript files based on an array of import schemas.
 *
 * @param {IMPORT_schema[]} imports_arr - An array of import schemas containing information about imported files.
 * @returns {string[]} An array of import lines as strings.
 *
 * ```typescript
 *  // Example Usage:
 * const imports = getImportString([
 *   { name: 'User', path: 'models', fileType: FILE_TYPE.MODEL },
 *   { name: 'Color', path: 'enums', fileType: FILE_TYPE.ENUM },
 * ]);
 * // Expected Result (for the given example):
 * [
 *   "import { User } from '@/models/User.model';",
 *   "import { Color } from '@/enums/Color.enum';"
 * ]
 * ```
 */
export function getImportString(imports_arr: IMPORT_schema[]): string[] {
  if (imports_arr.length === 0) {
    return []
  }

  const imports: string[] = []

  imports_arr.forEach((value: IMPORT_schema) => {
    const file_term = value.fileType === FILE_TYPE.ENUM ? 'enum' : 'model'
    const path = remove_start_end_slash(value.path)
    const schema_name = value.name
    const import_path = `@/${path}/${schema_name}.${file_term}`
    const import_line = `import { ${schema_name} } from '${import_path}';`

    imports.push(import_line)
  })
  return imports
}

/**
 * Retrieves and formats property declarations for a given model based on the MODEL_schema.
 *
 * @param {MODEL_schema} model - The model schema containing information about model properties.
 * @returns {string[]} An array of property declarations as strings for the specified model.
 * 
 ```typescript
  //Expected Result (for the given example):
  [
    "  public id: number = 0;",
    "  public name: string = '';",
  ]
  ```
 */
function getProperties(model: MODEL_schema): string[] {
  if (model.properties.length === 0) {
    return []
  }

  const properties: string[] = []

  model.properties.forEach((model_prop: PROPERTY_Format) => {
    const access_modifier = model_prop.accessModifier
    const propName = lowercaseFirstLetter(model_prop.propsName)
    const prop_type: SCHEMA_TYPE = model_prop.propType
    const isNullable = prop_type.isNullable ? '?' : ''

    let type: string = prop_type.type

    if (prop_type.isArray) {
      type = type + '[]'
    }

    if (isNullable) {
      // type = type + ' | null'
    }

    let initialValue = getDefaultValue(prop_type)

    if (model_prop.defaultValue) {
      initialValue = model_prop.defaultValue
    }
    // const prop = `  ${modifier} ${propName}${isNullable}: ${type} = ${initialValue};`
    // const prop = `  ${access_modifier} ${propName}${''}: ${type} = ${initialValue};`

    const prop = `  ${propName}${isNullable ? '?' : ''}: ${type};`

    properties.push(prop)
  })

  return properties
}
