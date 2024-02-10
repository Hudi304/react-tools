import { SCHEMA_TYPE } from '../types/types'

export function getDefaultValue(propType: SCHEMA_TYPE): string {
  if (propType.type === 'boolean') {
    return 'false'
  } else if (propType.isArray) {
    return '[]'
  } else if (propType.type === 'number') {
    return '0'
  } else if (propType.type === ' string') {
    return "''"
  }
  return `{} as ${propType.type}`
}
