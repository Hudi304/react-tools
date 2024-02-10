import { lowercaseFirstLetter } from '../common/utils'
import { ModelFile_Imp } from '../types/model-types'
import { FILE_TYPE, PROPERTY_Format } from '../types/types'

export function getConstructor(file: ModelFile_Imp): string[] {
  const model = file.format

  if (model.properties.length === 0) return []

  let constructor: string[] = []

  constructor.push('\n\n  constructor(obj = {} as any) {\n    obj = obj || {};')

  model.properties.forEach((model_prop: PROPERTY_Format) => {
    const propName = lowercaseFirstLetter(model_prop.propsName)

    let constructor_line = ''

    function getDefault(default_value: string) {
      if (model_prop.isNullable) {
        return 'null'
      }
      if (model_prop.defaultValue != null) {
        return model_prop.defaultValue
      }
      return default_value
    }

    if (model_prop.propType.isArray) {
      constructor_line = `this.${propName} = obj.${propName} ?? ${getDefault(
        '[]',
      )}`
    } else if ('number' === model_prop.propType.type) {
      constructor_line = `this.${propName} = obj.${propName} ?? ${getDefault(
        '0',
      )}`
    } else if ('string' === model_prop.propType.type) {
      constructor_line = `this.${propName} = obj.${propName} ?? ${getDefault(
        "''",
      )}`
    } else if ('boolean' === model_prop.propType.type) {
      constructor_line = `this.${propName} = obj.${propName} ?? ${getDefault(
        'false',
      )}`
    } else {
      const prop_import_opt = file.imports.find(
        (imp) => imp.name === model_prop.propType.type,
      )

      if (!prop_import_opt) {
        console.error('UNHANDLED CASE')
        console.error(model.name)
        console.error(model_prop)
        console.error(file.imports)
        console.error('\n')
        return
      }

      if (prop_import_opt.fileType === FILE_TYPE.ENUM) {
        constructor_line = `this.${propName} = obj.${propName} ?? ${model_prop.propType.type}[${model_prop.propType.type}[0] as any]`
      } else {
        constructor_line = `this.${propName} = obj.${propName} ?? new ${model_prop.propType.type}()`
      }
    }
    constructor.push(constructor_line)
  })

  constructor = constructor.map((line) => `    ${line}`)
  constructor.push('  }')

  return constructor
}
