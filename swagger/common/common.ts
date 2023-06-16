import chalk from 'chalk'
import { DataSourceConfig } from '../configs/ds-types'

const yellowBg = chalk.black.bgYellowBright
const cyanBg = chalk.black.bgCyanBright
const magentaBg = chalk.black.bgMagentaBright
const greenBg = chalk.black.bgGreenBright

export async function run_stage(
  stage: string,
  ds_conf: DataSourceConfig,
  fn: () => Promise<void>,
) {
  const start_time_ms = new Date().getTime()
  await fn()
  const end_time_ms = new Date().getTime()
  const duration: number = end_time_ms - start_time_ms

  pipeline_print_draft(stage, ds_conf, duration)
}

const pad_between = (item: string, price: string) => {
  const padded_price = cyanBg(price.padStart(80 - item.length, '.'))
  return item + padded_price
}

export function pipeline_print_draft(
  stage: string,
  ds_conf: DataSourceConfig,
  duration: number,
) {
  const server_name = ds_conf.name
  const stage_name = cyanBg(` ${stage} `)
  const server = yellowBg(` ${server_name} `)
  const some = pad_between(server, stage_name)
  const bg_duration = magentaBg(` ${duration}ms `)

  console.log(some + bg_duration)
}
