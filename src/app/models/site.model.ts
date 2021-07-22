import {CompParameter, MultiCompParameter} from "./editor-component-holder.model";

export interface Site {
  id: string
  title: string
  dateStringSort?: string
  dateStringFull?: string
  date?: Date
  mainPage?: boolean
  public: boolean
  components: {
    type: string
    componentDescription: string
    singleParams: CompParameter[]
    repeaterParams: MultiCompParameter[]
  }[]
  metaTags: {name: string, content: string}[]
}