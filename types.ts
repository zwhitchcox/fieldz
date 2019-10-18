import { IValidatorzRequirements, ValidatorzPresetName } from 'validatorz/types';

export type ReactFieldzInput = {
  [key: string]: IReactFieldzInputObject | ValidatorzPresetName | string
}

export interface IReactFieldzInputObject {
  validate?: IValidatorzRequirements | string
  init?: any
}