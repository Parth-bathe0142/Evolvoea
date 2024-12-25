import { Slime } from "../models/characters/slimes/Slime.js"
import { Time } from "../models/core/Time.js"
import { PixelMap } from "../Scene/PixelMap.js"
import { Scene } from "../Scene/Scene.js"

export interface ArenaConfig {
    scene: Scene
}

export class Arena {
    team1: Slime[] = []
    team2: Slime[] = []

    map: PixelMap | null = null
    scene: Scene
    time: Time = new Time(48)
    isPaused: boolean  = false

    constructor(config: ArenaConfig) {
        this.scene = config.scene
    }

    init() {
        const { pause, play } = this.time.runLoop(this.update, this.render)!
        this.pause = pause
        this.play = play
    }

    pause?: () => void
    play?: () => void

    togglePause() {
        if(this.isPaused) {
            this.play!()
            this.isPaused = false
        } else {
            this.pause!()
            this.isPaused = true
        }
    }

    update() {
        this.team1.forEach(e => {

        })
        this.team2.forEach(e => {

        })
    }

    render() {

    }
}