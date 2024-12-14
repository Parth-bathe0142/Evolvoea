import { Player } from "../models/characters/Player.js"
import { Camera } from "../models/core/Camera.js"
import { GameObject } from "../models/core/GameObject.js"
import { Coord } from "../models/core/misc.js"
import { Time } from "../models/core/Time.js"
import { PixelMap } from "./PixelMap.js"

export interface Scene {
    objects: GameObject[]
    interactables: Map<Coord, GameObject>
    player: Player
    map: PixelMap
    time: Time
    camera: Camera
    
    pause(): void
    play(): void
    togglePause(): boolean
    isSpaceValid(coord: Coord): boolean
}