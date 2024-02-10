import { DataSourceConfig } from './configs/ds-types'
import minimist from 'minimist'

export enum Param {
  LOCAL = 'l',
  DEV = 'd',
  TESTS = 't',
  HELP = `h`
}

export function add_args_to_config(args: string[], ds_conf: DataSourceConfig): number {
  const argv = minimist(args.slice(2))

  // add another  -t paremeter for tests 
  // Check for help option
  if (argv.h || argv.help) {
    console.log('Usage:')
    console.log('   -h, --help     Show help')
    console.log('   -l             Get the swagger.json file from this machine')
    console.log('   -d             Get the swagger.json from the dev server.')
    console.log('   -t             Run tests')
    return 1
  }

  if (argv.l) {
    console.log('Read local response.json')
    ds_conf.params = Param.LOCAL
  }

  if (argv.d) {
    console.log('Get swagger.json from the server.')
    ds_conf.params = Param.DEV
  }

  if (argv.d && argv.l) {
    console.error('Invalid arguments! -d -l')
    return 2
  }

  if (!argv.d && !argv.l) {
    console.log('DEFAULT : Get swagger.json from the server.')
    ds_conf.params = Param.DEV
  }

  if (argv.t) {
    console.log('Run tests')
    ds_conf.params = Param.TESTS
  }

  return 0
}
