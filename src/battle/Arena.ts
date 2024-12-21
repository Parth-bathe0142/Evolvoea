import { Slime } from "../models/characters/slimes/Slime"
import { Time } from "../models/core/Time"
import { PixelMap } from "../Scene/PixelMap"

export interface ArenaConfig {
    mapName: string
}

export class Arena {
    team1: Slime[] = []
    team2: Slime[] = []

    map: PixelMap | null = null
    time: Time = new Time(48)
}