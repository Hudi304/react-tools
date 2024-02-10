import { CascadaFile, read_dir_files } from '../common/file-reader'
import {
  ControllerFile_Imp,
  ControllerFile_Imp_Ign,
} from '../types/ctrler-types'

enum COMMENT_READER_STATE {
  START = 'START',
  BETWEEN = 'BETWEEN',
}

const { START, BETWEEN } = COMMENT_READER_STATE

export type FileIgnoreMap = Map<number, string[]> | null

/** Adds the lines that should be ignored to the controller map that it gets as a param,
 * and returns a new type that only adds an ignores key to each element.*/
export function parse_api_comments(
  controller_files: Map<string, ControllerFile_Imp>,
  path: string,
): Map<string, ControllerFile_Imp_Ign> {
  const dir_files: Map<string, CascadaFile> | null = read_dir_files(path)
  const files = dir_files || new Map<string, CascadaFile>()
  const files_comments = new Map<string, FileIgnoreMap>()

  const files_iter = files[Symbol.iterator]()
  for (const [file_name, file] of files_iter) {
    const ignore_map = get_file_ignore_map(file)
    files_comments.set(file_name, ignore_map)
  }

  const files_with_ignores = new Map<string, ControllerFile_Imp_Ign>()

  const controller_files_iter = controller_files[Symbol.iterator]()
  for (const [controller_name, controller] of controller_files_iter) {
    const file_name = find_ignore_map_key(controller_name, files_comments)
    const ignores = get_ignore_map(file_name, files_comments)
    const controller_with_ignores: ControllerFile_Imp_Ign = {
      file_name: controller.file_name,
      endpoints: controller.endpoints,
      imports: controller.imports,
      ignores: ignores,
    }

    files_with_ignores.set(controller_name, controller_with_ignores)
  }

  return files_with_ignores
}

/** Searches the files_comments map (it has the filename as key)
 *  for an element that has a key that contains the controller name
 *  and returns it.
 */
function find_ignore_map_key(
  controller_name: string,
  files_comments: Map<string, FileIgnoreMap>,
) {
  const file_names = Array.from(files_comments.keys())
  const controller_key = file_names.find((file_name) => {
    const low_case_cont_name = controller_name.toLowerCase()
    const low_case_file_name = file_name.toLowerCase()

    if (low_case_file_name.includes(low_case_cont_name)) {
      return true
    }
    return false
  })

  if (controller_key === undefined) {
    return null
  }

  return controller_key
}

/** Returns the ignores map for a single file.
 *  If the map is empty it will return null.
 *  It only return the map if it has items in it.
 */
function get_ignore_map(
  file_name: string | null,
  files_comments: Map<string, FileIgnoreMap>,
) {
  let ignores: FileIgnoreMap | null = null
  if (file_name !== null) {
    const ignore_map = files_comments.get(file_name) || null
    if (ignore_map?.size === 0) {
      ignores = null
    } else {
      ignores = ignore_map
    }
  }
  return ignores
}

/** Looks through the file_content and uses a state machine to build and array
 *  of file lines (strings) that sit between the 2 gen-ign-start and gen-ign-end comments.
 *  It returns these lines as a HashMap that has as key the line of the gen-ign-start comment.
 */
function get_file_ignore_map(file: CascadaFile): Map<number, string[]> {
  const file_content = file.file_content
  const content_lines: string[] = file_content
  const ignored_lines = new Map<number, string[]>()
  let state = COMMENT_READER_STATE.START
  let ignore_start_line_no: number

  content_lines.map((line: string, line_no: number) => {
    switch (state) {
      case START:
        if (is_comment_start(line)) {
          state = BETWEEN
          ignore_start_line_no = line_no
          ignored_lines.set(ignore_start_line_no, [])
        }
        break
      case BETWEEN:
        if (is_comment_end(line)) {
          state = START
          break
        } else {
          const ignored = ignored_lines.get(ignore_start_line_no) || []
          ignored?.push(line)
          ignored_lines.set(ignore_start_line_no, ignored)
          break
        }
    }
  })
  return ignored_lines
}

function is_comment_start(line: string): boolean {
  if (line.includes('// generator-ignore start')) {
    return true
  }
  if (line.includes('//generator-ignore start')) {
    return true
  }
  if (line.includes('// generator-ignore-start')) {
    return true
  }
  if (line.includes('//generator-ignore-start')) {
    return true
  }

  if (line.includes('// gen-ign start')) {
    return true
  }
  if (line.includes('//gen-ign start')) {
    return true
  }
  if (line.includes('// gen-ign-start')) {
    return true
  }
  if (line.includes('//gen-ign-start')) {
    return true
  }
  return false
}

function is_comment_end(line: string): boolean {
  if (line.includes('// generator-ignore end')) {
    return true
  }
  if (line.includes('//generator-ignore end')) {
    return true
  }
  if (line.includes('// generator-ignore-end')) {
    return true
  }
  if (line.includes('//generator-ignore-end')) {
    return true
  }

  if (line.includes('// gen-ign end')) {
    return true
  }
  if (line.includes('//gen-ign end')) {
    return true
  }
  if (line.includes('// gen-ign-end')) {
    return true
  }
  if (line.includes('//gen-ign-end')) {
    return true
  }
  return false
}
