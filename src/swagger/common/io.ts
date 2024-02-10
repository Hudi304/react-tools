import chalk from 'chalk'
import { sync } from 'rimraf'
import { mkdirp } from 'mkdirp'
import fs from 'fs'
import path from 'path'
// import * as toml from 'toml'

import axios from 'axios'
import { remove_start_end_slash } from './utils'
import { DTO_File } from '../types/types'
import { DataSourceConfig } from '../configs/ds-types'
import { Param } from '../args'
import { Print } from './printers'

const getDirName = path.dirname

export function writeLine() {
  const line = '-------------------------------------------------------'
  console.info(chalk.white(line))
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
    console.error(err)
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
  // console.info(chalk.green(`    Created File : ${path}`))
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

  if (ds.swagger_URL === undefined) {
    console.error(`Check swagger.config.toml ds_URI is undefined for ${ds.name}`)
  }

  let swagger_json: SwaggerJSON | null = null

  switch (ds.params) {
    case Param.LOCAL: swagger_json = read_local_file(ds); break
    case Param.DEV: swagger_json = await get_swagger_from_server(ds); break
  }

  if (!swagger_json) {
    // console.info(chalk.red(`Could not get swagger.json`))
    return null
  }

  // prettier-ignore
  if (
    !swagger_json ||
    !swagger_json.paths ||
    !swagger_json.components ||
    !swagger_json.components.schemas
  ) {
    console.info(chalk.red(`Server response is not parsable!`))
    console.info(swagger_json)

    return null
  }

  return swagger_json
}

function read_local_file(ds: DataSourceConfig): SwaggerJSON | null {

  if (!ds.local_swagger_path) {
    Print.Err(`Local swagger path is not defined for ${ds.name}`)
    return null
  }

  if (!fs.existsSync(ds.local_swagger_path)) {
    Print.Err(`Local swagger file does not exist at ${ds.local_swagger_path}`)
    return null
  }

  const jsonString = fs.readFileSync(ds.local_swagger_path!, 'utf-8')
  const swagger_json = JSON.parse(jsonString)

  Print.Suc(`Got swagger json from '${ds.local_swagger_path}'`)

  return swagger_json
}

async function get_swagger_from_server(ds: DataSourceConfig): Promise<SwaggerJSON> {
  const swagger_json = await axios
    .get(ds.swagger_URL)
    .then((r) => r.data)
    .catch((err) => console.info(chalk.red(`HTTP call to ${ds.swagger_URL} failed ${err}`)))

  console.info(chalk.green(`Got swagger json from ${ds.swagger_URL}`))

  return swagger_json
}
