import { writeLine } from '../io'
import { equals_ignore_case, parseFileName } from '../utils'

export function filter_ends_with<T>(
  files: T[],
  get_key: (file: T) => string | undefined,
  ends_with?: string[],
) {
  let rez: T[] = [...files]
  if (ends_with) {
    ends_with.forEach((str) => {
      rez = files.filter((file) => parseFileName(get_key(file)).endsWith(str))
    })
    return rez
  }
  return files
}

export function filter_starts_with<T>(
  files: T[],
  get_key: (file: T) => string | undefined,
  starts_with?: string[] | null,
) {
  let rez: T[] = [...files]
  if (starts_with) {
    starts_with.forEach((str) => {
      const filtered_files = files.filter((file) =>
        parseFileName(get_key(file)).startsWith(str),
      )
      rez = [...rez, ...filtered_files]
    })
    return rez
  }
  return files
}

export function exclude_ends_with<T>(
  files: T[],
  get_key: (file: T) => string | undefined,
  exclude_ends_with?: string[],
) {
  let rez: T[] = [...files]
  if (exclude_ends_with) {
    exclude_ends_with.forEach((str) => {
      rez = rez.filter((file) => !parseFileName(get_key(file)).endsWith(str))
    })
    return rez
  }
  return files
}

export function exclude_file_name<T>(
  files: T[],
  get_file_name: (file: T) => string | undefined,
  exclude_file_names?: string[],
) {
  if (exclude_file_names === undefined) {
    return files
  }

  let rez: T[] = [...files]

  exclude_file_names.forEach((exclude_f_name) => {
    rez = rez.filter((file) => {
      const file_name = get_file_name(file)
      const clean_exclude = exclude_f_name.split('.')[0] || ''
      const parsed_file_name = parseFileName(file_name).split('.')[0]
      const should_be_excluded = !equals_ignore_case(
        parsed_file_name,
        clean_exclude,
      )
      return should_be_excluded
    })
  })
  return rez
}

export function filter_include_only_file_name_ends_with<T>(
  files: T[],
  get_key: (file: T) => string | undefined,
  include_only_ends_with?: string[],
) {
  let rez: T[] = [...files]
  if (include_only_ends_with) {
    include_only_ends_with.forEach((str) => {
      rez = rez.filter((file) => parseFileName(get_key(file)).endsWith(str))
    })
    return rez
  }
  return files
}

export function include_file_name<T>(
  files: T[],
  get_key: (file: T) => string | undefined,
  include_file_name?: string[],
) {
  let rez: T[] = [...files]
  if (include_file_name) {
    rez = rez.concat(
      files.filter((file) =>
        include_file_name.includes(parseFileName(get_key(file))),
      ),
    )
    return rez
  }
  return files
}

function print_file_names<T>(
  files: T[],
  get_key: (file: T) => string | undefined,
) {
  files.forEach((file) => {
    // console.log(get_key(file))
  })
  writeLine()
}
