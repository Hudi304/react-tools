import { MODEL_schema } from '../types/model-types'

const filterUndefined = '.filter((item: any) => item !== undefined)'

export function getConstructor(model: MODEL_schema) {
  // if (model.properties.length === 0) {
  //   return []
  // }
  // let constructor = '\n\n  constructor(obj = {} as any) {\n    obj = obj || {};'
  // model.properties.forEach((property) => {
  //   const initValue = getInitValue(property.prop_type.type)
  //   const notPrimitive =
  //     /[A-Z]/.test(getAttributeType(property)[0]) &&
  //     !isEnum(getAttributeType(property), enums)
  //   const propName = lowercaseFirstLetter(property.name)
  //   const arrayType = getAttributeType(property).split('[')[0]
  //   if (initValue === '[]') {
  //     const constrPart = `\n    this.${propName} = obj.${propName}`
  //     let initialization = notPrimitive
  //       ? `?${filterUndefined}\n      .map((item: any) => new ${arrayType}(item))`
  //       : ''
  //     initialization += ' || [];'
  //     constructor += constrPart + initialization
  //   } else if ('number' === getAttributeType(property)) {
  //     constructor +=
  //       `\n    this.${propName} = obj.${propName} !== undefined ` +
  //       `\n  && obj.${propName} !== null ? obj.${propName} : ${initValue};`
  //   } else if (notPrimitive) {
  //     constructor +=
  //       `\n    this.${propName} = !obj.${propName} ` +
  //       `\n    ? new ${arrayType}() ` +
  //       `\n    : new ${arrayType}(obj.${propName});`
  //   } else {
  //     if (initValue !== undefined) {
  //       const defaultValue = initValue !== 'undefined' ? initValue : "''"
  //       constructor += `\n    this.${propName} = obj.${propName} === null? ${defaultValue} : obj.${propName};`
  //     } else {
  //       constructor += `\n    this.${propName} = obj.${propName};`
  //     }
  //   }
  // })
  // return constructor
}
