import {Bar} from "./bar.model";

export interface Region {
    id?: string
    regionCode: string
    bars: Bar[]
}