import { exec } from 'child_process';
import { DataSourceConfig } from '../configs/ds-types';
import { Linter } from '../args';

async function es_lint(dir_path: string, silent: boolean = true) {
  return exec(`eslint --fix ${dir_path}`, (error, stdout, stderr) => {
    // if (error) {
    //   console.error(`Error: ${error?.message}`);
    //   throw Error('FAILED');
    // }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      throw Error('FAILED');
    }

    if (stdout && !silent) {
      console.info(`stdout: ${stdout}`);
    }
  });
}

async function ox_lint(dir_path: string, silent: boolean = true) {
  return exec(`oxlint --fix ${dir_path}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error?.message}`);
      throw Error('FAILED');
    }
    if (stderr) {
      console.error(`Error: ${stderr}`);
      throw Error('FAILED');
    }

    if (stdout && !silent) {
      console.info(`stdout: ${stdout}`);
    }
  });
}

export async function lint(ds_conf: DataSourceConfig, path: string) {
  //prettier-ignore
  switch (ds_conf.linter) {
    case Linter.ES_LINT: return await es_lint(path);
    case Linter.OX_LINT: return await ox_lint(path);
    default: break;
  }
}
