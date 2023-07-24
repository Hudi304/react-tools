import chalk from 'chalk'
import { sync } from 'rimraf'
import { mkdirp } from 'mkdirp'
import * as fs from 'fs'
import * as path from 'path'
// import * as toml from 'toml'

import axios from 'axios'
import { remove_start_end_slash } from './utils'
import { DTO_File } from '../types/types'
import { DataSourceConfig } from '../configs/ds-types'

const getDirName = path.dirname

export function writeLine() {
  const line = '-------------------------------------------------------'
  console.log(chalk.white(line))
}

// export function getConfig(path: string): Config {
//   const raw_config_data = readConfigFile(path)
//   if (!raw_config_data) {
//     throw new Error('Could not read swagger.config.toml file!')
//   }

//   const config = toml.parse(raw_config_data)
//   if (!config) {
//     throw new Error('Could not parse swagger.config.toml file!')
//   }

//   return config
// }

export function readConfigFile(path: any): string | undefined {
  try {
    const data = fs.readFileSync(path, 'utf8')
    return data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

// export function read_toml<T>(path: string): T {
//   const raw_config_data = readConfigFile(path)
//   if (!raw_config_data) {
//     throw new Error('Could not read swagger.config.toml file!')
//   }

//   const config = toml.parse(raw_config_data)
//   if (!config) {
//     throw new Error('Could not parse swagger.config.toml file!')
//   }

//   return config
// }

//prettier-ignore
export function writeFiles(ROOT: string, PATH: string, fileType: string, files: DTO_File[]): void {
  const root = remove_start_end_slash(ROOT)
  const path = remove_start_end_slash(PATH)

  // writeLine()
 
  sync(`${root}/${path}`)
  mkdirp.sync(`${root}/${path}`)
 
  files.forEach((file) => {
    writeFile(`${root}/${path}/${file.fileName}.${fileType}`, file.content)
  })
}

export function writeFile(path: string, data: any) {
  // console.log(chalk.green(`    Created File : ${path}`))
  mkdirp(getDirName(path)).then(() => {
    fs.writeFileSync(path, data)
  })
}

type DS_Config = DataSourceConfig

export type SwaggerJSON = {
  paths: any
  components: {
    schemas: any
  }
}

export async function get_swagger_JSON(ds: DS_Config): Promise<SwaggerJSON | null> {
  if (ds.SwaggerPath === undefined) {
    console.log(`Check swagger.config.toml ds_URI is undefined for ${ds.name}`)
  }

  const jsonString = fs.readFileSync('src/tools/response.json', 'utf-8')

  const swagger_json = JSON.parse(jsonString)

  // const swagger_json: SwaggerJSON = await axios
  //   .get(ds.SwaggerPath)
  //   .then((r) => {
  //     return r.data
  //   })
  //   .catch((err) => console.log(chalk.red(`HTTP call to ${ds.SwaggerPath} failed ${err}`)))

  if (!swagger_json || !swagger_json.paths || !swagger_json.components || !swagger_json.components.schemas) {
    console.log(chalk.red(`Server response is not parsable!`))
    return null
  }

  return swagger_json
}
