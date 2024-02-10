import chalk from 'chalk';

const yellowBg = chalk.black.bgYellowBright
const cyanBg = chalk.black.bgCyanBright
const magentaBg = chalk.black.bgMagentaBright
const greenBg = chalk.black.bgGreenBright

export const pad_between = (left: string, value: string, length: number = 80, padding_char: string = ".") => {
  var padding_length = length - left.length
  const padded_right = cyanBg(value.padStart(padding_length, padding_char))
  return left + padded_right
}

export const Print = {
  Suc: (msg: string) => console.log(chalk.whiteBright.bgGreen(` ${msg} `)),
  Err: (msg: string) => console.log(chalk.whiteBright.bgRedBright(` Err : ${msg} `)),
  Warn: (msg: string) => console.log(chalk.black.bgYellowBright(` ${msg} `)),
  Info: (msg: string) => console.log(chalk.black.bgBlueBright(` ${msg} `)),

  pipeline_stage: (stage: string, ds_conf: string, duration: number) => {
    const stage_name = chalk.black.bgCyanBright(` ${stage} `)
    const server = chalk.black.bgYellowBright(` ${ds_conf} `)
    const bg_duration = chalk.black.bgMagentaBright(` ${duration}ms `)

    console.info(pad_between(server, stage_name) + bg_duration)
  }
}
