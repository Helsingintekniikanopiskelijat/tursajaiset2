import {CustomComponent} from "./custom-component.model";

export interface EditorComponentHolder {
  type: any
  singleParams: CompParameter[]
  repeaterParams: MultiCompParameter[]
  selectionName: string
  componentDescription: string
  iconUrl: string
}

export interface CompParameter {
  type: string
  name: string
  description: string
  value?: any
}

export interface MultiCompParameter {
  name: string
  description: string
  params: {compParamValues: CompParameter[]}[]
}