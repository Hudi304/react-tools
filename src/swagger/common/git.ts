import { exec } from 'child_process';
import { Print, Prompt } from './printers';

// TODO check for changes in the folders of DS config
export async function is_git_tree_clean(): Promise<boolean> {
  const child_process = exec('git status --porcelain')

  // if (child_process.exitCode !== 0) {// git error
  //   Print.Err(`Error checking git status: ${child_process.stderr}`);
  //   return false;
  // }

  if (child_process.stdout) {// git tree  not clean
    const warning_message = "Your git tree is not clean! \n " +
      "We recommend you to commit your changes before running this script. \n " +
      "If you want to continue, type 'y' or 'yes' and press enter."
    Print.Warn(warning_message)

    return await Prompt.yes_no('Do you want to continue?')
      .then(() => true)
      .catch(() => false)
  }

  return true// git tree is clean
}