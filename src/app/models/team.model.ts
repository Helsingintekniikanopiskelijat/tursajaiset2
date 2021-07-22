import {Bar} from "./bar.model";

export interface Team {
    id?: string
    loginId: number
    name: string
    fuksiStatus: boolean
    bars: Bar[]
    totalScore: number
}