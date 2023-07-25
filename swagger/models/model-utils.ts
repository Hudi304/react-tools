import { SCHEMA_TYPE } from '../types/types'

export function getDefaultValue(prop_type: SCHEMA_TYPE): string {
  if (prop_type.type === 'boolean') {
    return 'false'
  } else if (prop_type.isArray) {
    return '[]'
  } else if (prop_type.type === 'number') {
    return '0'
  } else if (prop_type.type === ' string') {
    return "''"
  }
  return `{} as ${prop_type.type}`
}
