import { ROOT } from '..'
import { lowercaseFirstLetter, remove_start_end_slash } from './utils'
import { writeFile } from './io'
import { rimraf } from 'rimraf'
import { mkdirp } from 'mkdirp'
import { ControllerFile_Imp_Ign_Cnt } from '../types/ctrler-types'
import { DataSourceConfig } from '../configs/ds-types'
import { ModelFile_Imp_Cnt } from '../types/model-types'

export function write_models(
  models: Map<string, ModelFile_Imp_Cnt>,
  ds_conf: DataSourceConfig,
) {
  const PATH = ds_conf.models.path

  const root = remove_start_end_slash(ROOT)
  const path = remove_start_end_slash(PATH)

  // writeLine()

  rimraf.sync(`${root}/${path}`)
  mkdirp.sync(`${root}/${path}`)

  const models_iter = models[Symbol.iterator]()
  for (const [model_name, model] of models_iter) {
    const file_path = `${root}/${path}/${model_name}.model.ts`
    const content = model.content.join('\n')

    writeFile(file_path, content)
  }
}

export function write_controllers(
  controllers: Map<string, ControllerFile_Imp_Ign_Cnt>,
  ds_conf: DataSourceConfig,
) {
  const PATH = ds_conf.apis.path

  const root = remove_start_end_slash(ROOT)
  const path = remove_start_end_slash(PATH)

  // writeLine()

  rimraf.sync(`${root}/${path}`)
  mkdirp.sync(`${root}/${path}`)

  const controllers_iter = controllers[Symbol.iterator]()
  for (const [controller_name, controller] of controllers_iter) {
    const file_name = lowercaseFirstLetter(controller_name)
    const file_path = `${root}/${path}/${file_name}.api.ts`
    const content = controller.content.join('\n')

    writeFile(file_path, content)
  }
}
