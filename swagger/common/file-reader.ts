import * as fs from 'fs'

export function read_file(path: string): string | null {
  try {
    const data: string = fs.readFileSync(path, 'utf8')
    return data
  } catch (err) {
    console.log(err)
    return null
  }
}

export type CascadaFile = {
  file_path: string
  file_name: string
  file_content: string[]
}

export function read_dir_files(
  dir_path: string,
): Map<string, CascadaFile> | null {
  let file_names: string[] | null = null
  try {
    const files = fs.readdirSync(dir_path)
    const is_ts = (file_name: string) => file_name.endsWith('.api.ts')
    const ts_files = files.filter(is_ts)
    file_names = ts_files
  } catch (err) {
    console.log('Could not read directory content!')
    console.log(err)
    return null
  }

  const file_map = new Map<string, CascadaFile>()

  file_names.forEach((file_name) => {
    const file_path = dir_path + '/' + file_name
    const file_content = read_file(file_path)

    if (file_content !== null) {
      // careful this might not be enough
      // this is for windows machines
      let lines: string[] = []
      lines = file_content?.split('\r\n')
      const file: CascadaFile = {
        file_content: lines,
        file_name,
        file_path,
      }
      file_map.set(file_name, file)
    } else {
      console.log('Could not read file : ', file_path)
    }
  })

  return file_map
}
