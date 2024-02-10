import chalk from 'chalk';
import path from 'path';
import readline from 'readline';


export const yellowBg = chalk.black.bgYellowBright
const cyanBg = chalk.black.bgCyanBright
const magentaBg = chalk.black.bgMagentaBright
const greenBg = chalk.black.bgGreenBright

const red = chalk.whiteBright.bgRedBright
const yellow = chalk.black.bgYellowBright

export const pad_between = (left: string, value: string, length: number = 80, padding_char: string = ".") => {
  var padding_length = length - left.length
  const padded_right = cyanBg(value.padStart(padding_length, padding_char))
  return left + padded_right
}

export const Print = {
  Suc: (msg: string) => console.log(chalk.whiteBright.bgGreen(` ${msg} `)),
  Err: (msg: string) => console.log(red(` Err : ${msg} `)),
  Err2: (left: string, right: string) => console.log(
    red(` Err : ${left}`) + yellow(` ${right} `)
  ),
  Warn: (msg: string) => console.log(chalk.black.bgYellowBright(` ${msg} `)),
  Info: (msg: string) => console.log(chalk.whiteBright.bgCyanBright(` ${msg} `)),

  pipeline_stage: (stage: string, ds_conf: string, duration: number) => {
    const stage_name = chalk.black.bgCyanBright(` ${stage} `)
    const server = chalk.black.bgYellowBright(` ${ds_conf} `)
    const bg_duration = chalk.black.bgMagentaBright(` ${duration}ms `)

    console.info(pad_between(server, stage_name) + bg_duration)
  },
  path: (file_path: string): string => {
    const absolutePath = path.resolve(file_path);
    return `\u001B]8;;file://${absolutePath}\u001B\\${file_path}\u001B]8;;\u001B\\`;
  }
}

export const Prompt = {
  /* Prompt the user with a yes/no question */
  yes_no: (question: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const ask = () => rl.question(`${question} (yes/no): `, (answer) => {
        const answer_lower = answer.toLowerCase()

        const is_yes = answer_lower === 'y' || answer_lower === 'yes'
        if (is_yes) {
          resolve(true)
          return rl.close();
        }

        const is_no = answer_lower === 'n' || answer_lower === 'no'
        if (is_no) {
          reject(false)
          return rl.close();
        }

        ask()
      });

      ask()
    });
  }

}
