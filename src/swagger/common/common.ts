import { DataSourceConfig } from '../configs/ds-types'
import { Print } from './printers'

export async function run_stage(
  stage: string,
  ds_conf: DataSourceConfig,
  fn: () => Promise<void>,
) {
  const start_time_ms = performance.now();
  await fn();
  const end_time_ms = performance.now();
  const duration: number = Math.round(end_time_ms - start_time_ms);

  Print.pipeline_stage(stage, ds_conf.name, duration);
}