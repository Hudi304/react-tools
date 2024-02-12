import { Print, Prompt } from './printers';
import { DS_CONFIGS } from '../configs/ds-config';
import { execSync } from 'child_process';

export async function is_git_tree_clean(): Promise<boolean> {
  const rez = execSync('git status --porcelain').toString().trim();

  if (!rez) return true;

  if (rez?.trim().length > 0) {
    const changedFiles = rez
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    const changedPaths = changedFiles.map((file) => file.split(' ')[1]);

    const onlyGeneratedFilesChanged = changedPaths.every((path) => {
      const isEnum = path.startsWith(DS_CONFIGS[0].enums.path) && path.endsWith('.enum.ts');
      const isModel = path.startsWith(DS_CONFIGS[0].models.path) && path.endsWith('.model.ts');
      const isController = path.startsWith(DS_CONFIGS[0].apis.path) && path.endsWith('.api.ts');

      return isEnum || isModel || isController;
    });

    console.log(onlyGeneratedFilesChanged);

    if (onlyGeneratedFilesChanged) {
      return true;
    }

    const warning_message =
      'Your git tree is not clean! \n ' +
      'We recommend you to commit your changes before running this script. \n ';
    Print.yellow(warning_message);

    return await Prompt.yes_no('Do you want to continue?')
      .then(() => true)
      .catch(() => false);
  }

  return true; // git tree is clean
}
