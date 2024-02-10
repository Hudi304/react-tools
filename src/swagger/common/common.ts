import { DataSourceConfig } from '../configs/ds-types'
import { Print, yellowBg } from './printers'

export async function run_stage(
  stage: string,
  ds_conf: DataSourceConfig,
  fn: () => Promise<boolean | void>,
) {
  const start_time_ms = performance.now();
  const rez = await fn();


  if (rez === false) {
    Print.Err2(`Error in stage : `, stage);
    return;
  }

  const end_time_ms = performance.now();
  const duration: number = Math.round(end_time_ms - start_time_ms);

  Print.pipeline_stage(stage, ds_conf.name, duration);
}