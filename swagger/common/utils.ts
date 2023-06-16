import { ENUM_schema } from '../types/enum-types'
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import chalk from 'chalk'
import { DataSourceConfig } from '../configs/ds-types'
import { MODEL_schema } from '../types/model-types'
import { SCHEMA_TYPE } from '../types/types'

export function equals_ignore_case(str1: string, str2: string) {
  const str_low1 = str1.toLowerCase()
  const str_low2 = str2.toLowerCase()
  if (str_low1 === str_low2) {
    return true
  }
  return false
}

export function isModel(obj: any): obj is MODEL_schema {
  if (obj === undefined || obj == null) {
    return false
  }

  // if (obj.filePath === undefined || typeof obj.filePath !== 'string') {
  //   return false
  // }

  if (obj.properties === undefined || !Array.isArray(obj.properties)) {
    return false
  }
  return true
}

export function isEnumSchema(obj: any): obj is ENUM_schema {
  if (obj === undefined || obj == null) {
    return false
  }

  // if (obj.filePath === undefined || typeof obj.filePath !== 'string') {
  //   return false
  // }
  if (obj.values === undefined || !Array.isArray(obj.values)) {
    return false
  }
  return true
}

export function getKeysAsArray(obj: any): any[] {
  const keyNames = Object.keys(obj)
  const rez = keyNames.map((keyName) => {
    return { name: keyName, ...obj[keyName] }
  })
  return rez
}

export function sp(no: number) {
  let rez = ''
  for (let i = 0; i < no; i++) {
    rez += ' '
  }
  return rez
}

export function removeDuplicates(array: any[]): any[] {
  return Array.from(new Set(array))
}
export function removeDuplicatesByKey<T>(arr: T[], key: keyof T): T[] {
  const set = new Set<T[keyof T]>() // create a set to keep track of seen values
  return arr.filter((item) => {
    const value = item[key] // get the value of the key from the current item
    if (set.has(value)) {
      // if the set already has the value, it's a duplicate - filter it out
      return false
    } else {
      set.add(value) // add the value to the set for future checks
      return true
    }
  })
}
// export function removeDuplicates_Objs<T>(array: T[]) {
//   const result: T[] = []
//   for (const item of array) {
//     if (!result.includes(item)) {
//       result.push(item)
//     }
//   }
//   return result
// }

export function lowercaseFirstLetter(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function dashCase(str: string) {
  const s = str.charAt(0).toLowerCase() + str.slice(1)
  return s.replace(/([A-Z])/gm, '-$1').toLowerCase()
}
/** Knows nothing about generics.
 *  Maybe it would be a good idea to make it return unwrapped generic types.*/
export function getSchemaType(schema: any): SCHEMA_TYPE {
  const isNullable = schema.nullable || false

  switch (schema.type) {
    case 'integer':
    case 'number':
      return {
        type: 'number | string',
        isArray: false,
        isGeneric: false,
        isNullable,
      }
    case 'uint256':
      return {
        type: 'number',
        isArray: false,
        isGeneric: false,
        isNullable,
      }

    case 'object':
      return {
        type: 'any',
        isArray: false,
        isGeneric: false,
        isNullable,
      }
    case 'boolean':
    case 'string':
      return {
        type: schema.type,
        isArray: false,
        isGeneric: false,
        isNullable,
      }

    case 'array':
      return {
        type: `${getType(schema.items)}`,
        isArray: true,
        isGeneric: false,
        isNullable,
      }

    case 'formData':
      return {
        type: 'FormData',
        isArray: false,
        isGeneric: false,
        isNullable,
      }
  }

  if (schema.$ref) {
    const ref1 = schema.$ref.split('/').pop()
    const refName = ref1.split('.').pop()

    return {
      type: refName,
      isArray: false,
      isGeneric: false,
      isNullable,
    }
  } else if (schema.allOf && schema.allOf[0].$ref) {
    const ref1 = schema.allOf[0].$ref.split('/').pop()
    const refName = ref1.split('.').pop()
    return {
      type: refName,
      isArray: false,
      isGeneric: false,
      isNullable,
    }
  } else {
    return {
      type: 'any',
      isArray: false,
      isGeneric: false,
      isNullable,
    }
  }
}

export function getType(prop: any): any {
  switch (prop.type) {
    case 'integer':
    case 'number':
      return 'number | string'
    case 'object':
      return 'any'
    case 'boolean':
    case 'string':
      return prop.type
    case 'array':
      return `${getType(prop.items)}[]`
    case 'formData':
      return 'FormData'
  }

  if (prop.$ref) {
    const ref1 = prop.$ref.split('/').pop()
    const refName = ref1.split('.').pop()
    return refName
  } else if (prop.allOf && prop.allOf[0].$ref) {
    const ref1 = prop.allOf[0].$ref.split('/').pop()
    const refName = ref1.split('.').pop()
    return refName
  } else {
    return 'any'
  }
}

export function filterRefs(reference: string): string {
  let ref = reference
  if (ref.includes('TableFilter')) {
    ref = (ref as string).replace('TableFilter', '')
  }
  if (ref.includes('TableResponse')) {
    ref = (ref as string).replace('TableResponse', '')
  }
  return ref
}

export function isEnum(ref: any, enums: any) {
  const cleanRef = ref.replace(/[\[\]]/g, '')
  return enums && enums.find((enu: any) => enu.name === cleanRef)
}

export function getRef(content: any): any {
  if (content['application/json']) {
    return getRef(content['application/json'].schema)
  }

  if (content.allOf) {
    return getRef(content.allOf[0])
  }

  if (content.schema) {
    return getRef(content.schema)
  }

  if (content.type === 'array') {
    return getRef(content.items)
  }

  if (content.$ref) {
    return content.$ref.split('/').pop()
  } else {
    return undefined
  }
}

export function remove_start_end_slash(str: string) {
  let path = str
  if (path.charAt(0) === '/') {
    path = path.slice(1)
  }
  if (path.charAt(path.length - 1) === '/') {
    path = path.slice(0, -1)
  }
  return path
}

/** This only supports one generic type.
 *  It should de extended to that it supports any number of generics.
 *  T<K<L<M>>>, I don't know if it should support T<M, K>
 */
export function format_generic_type(
  prop_type: SCHEMA_TYPE | null,
  ds_conf: DataSourceConfig,
): SCHEMA_TYPE | null {
  if (prop_type == null) {
    return null
  }

  const type = prop_type.type
  if (type === null) {
    return null
  }

  const generics = ds_conf.generics
  let wrapped_generic_type: string | null = null // ------ T<M>
  let generic_type_parameter: string | null = null // ----- M
  let generic_type: string | null = null //---------------- T

  generics.forEach((generic) => {
    const cleanType = clean_model_name(type)
    const is_generic_type = cleanType.endsWith(generic)
    if (is_generic_type) {
      const param = type.replace(generic, '')
      generic_type_parameter = param
      generic_type = generic
      wrapped_generic_type = `${generic}<${param}>`
    }
  })

  const is_generic =
    wrapped_generic_type !== null &&
    generic_type_parameter !== null &&
    generic_type !== null

  if (is_generic) {
    return {
      type: generic_type_parameter!,
      isArray: prop_type.isArray,
      isNullable: prop_type.isNullable,
      isGeneric: true,
      genericWrapper: generic_type!,
      wrappedType: wrapped_generic_type!,
    }
    // return wrapped_generic_type!
  } else {
    return prop_type
  }
}

export function clean_model_name(name: string): string {
  const split: string[] = name.split('.')
  return split[split.length - 1]
}

//TODO refactor this with options
export function parseFileName(name?: string): string {
  if (name?.includes('.')) {
    const split = name.split('.')
    return split[split.length - 1]
  }
  return name || ''
}
export function mapToArray<T>(files: Map<string, T>): T[] {
  return Array.from(files.values())
}

export function arrayToMap<T>(
  array: T[],
  keyFn: (obj: T) => string,
): Map<string, T> {
  return array.reduce((map, obj) => {
    const key = keyFn(obj)
    map.set(key, obj)
    return map
  }, new Map<string, T>())
}
