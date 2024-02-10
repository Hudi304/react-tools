import { exec } from 'child_process'

export async function lint(dir_path: string, silent: boolean = true) {
  return exec(`eslint --fix ${dir_path}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error?.message}`)
      throw Error('FAILED')
    }
    if (stderr) {
      console.error(`Error: ${stderr}`)
      throw Error('FAILED')
    }

    if (stdout && !silent) {
      console.info(`stdout: ${stdout}`)
    }
  })
}
