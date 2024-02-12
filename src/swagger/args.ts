import { Print } from './common/printers';
import { DataSourceConfig } from './configs/ds-types';
import minimist from 'minimist';
import { run_test } from './tests/main';
export enum Param {
  LOCAL = 'l',
  DEV = 'd',
  TESTS = 't',
  HELP = `h`,
}

export enum Linter {
  ES_LINT = 'es',
  OX_LINT = 'ox',
  None = 'none',
}

export enum ArgsRes {
  Success = 0,
  Help = 1,
  InvalidArguments = 2,
  RunTests = 3,
}

export function add_args_to_config(args: string[], ds_conf: DataSourceConfig): ArgsRes {
  const alias: minimist.Opts = {
    alias: {
      lnt: 'linter',
      h: 'help',
      d: 'dev',
      l: 'local',
      t: 'test',
    },
    string: ['linter'], // Treat the linter option as a string (with a value)
  };

  const argv = minimist(args.slice(2), alias);

  // Check for help option
  if (argv.h) {
    console.log('Usage:');
    console.log('   -h, --help     Show help');
    console.log('   -l, --local    Get the swagger.json file from this machine');
    console.log('   -d             Get the swagger.json from the dev server.');
    console.log('   -t             Run tests');
    console.log('   --linter       Specify the linter (e.g., eslint, oxlint)');
    return ArgsRes.Help;
  }

  if (argv.t) {
    ds_conf.params = Param.TESTS;
    run_test();
    return ArgsRes.RunTests;
  }

  if (argv.l) {
    // Print.Info('Read local response.json');
    ds_conf.params = Param.LOCAL;
  }

  if (argv.d) {
    Print.Info('Get swagger.json from the server.');
    ds_conf.params = Param.DEV;
  }

  if (argv.d && argv.l) {
    Print.Err('Invalid arguments! -d -l');
    return ArgsRes.InvalidArguments;
  }

  if (!argv.d && !argv.l) {
    Print.Info('DEFAULT : Get swagger.json from the server.');
    ds_conf.params = Param.DEV;
  }

  if (argv.linter) {
    // Get the value of the linter option
    const linter_value: string = argv.linter;
    // Print.Info(`Using linter: ${linter_value}`);

    if (!linter_value) {
      ds_conf.linter = Linter.None;
      return ArgsRes.Success;
    }

    const linter_val_low = linter_value.toLowerCase().replaceAll(' ', '');

    if (linter_value === 'es' || linter_val_low === 'eslint') {
      ds_conf.linter = Linter.ES_LINT;
      return ArgsRes.Success;
    }

    if (linter_value === 'ox' || linter_val_low === 'oxlint') {
      ds_conf.linter = Linter.OX_LINT;
      return ArgsRes.Success;
    }
  }

  return ArgsRes.Success;
}
