import { Player } from "../models/characters/Player.js"
import { Camera } from "../models/core/Camera.js"
import { GameObject, GameObjectConfig } from "../models/core/GameObject.js"
import { KeyInput } from "../models/core/KeyInput.js"
import { Coord } from "../models/core/misc.js"
import { Time } from "../models/core/Time.js"
import { utils } from "../models/core/utils.js"
import { PixelMap } from "./PixelMap.js"

export interface SceneJSON {
    objects: { [key: string]: GameObjectConfig }
}

export interface scene {
    objects: GameObject[]
    interactables: Map<Coord, GameObject>
    player: Player
    map: PixelMap
    time: Time
    camera: Camera

    ispaused: boolean

    load(): Promise<void>
    init(): void
    update(): void
    render(): void
    pause(): void
    play(): void
    togglePause(): boolean
    isSpaceValid(coord: Coord): boolean
}

export class Scene {

    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement

    objects: GameObject[] = []
    interactables: Map<Coord, GameObject>
    player: Player
    map: PixelMap
    time: Time
    camera: Camera
    keyInput: KeyInput

    isPaused: boolean

    constructor() {
        this.canvas = document.getElementById("game-canvas")! as HTMLCanvasElement
        this.ctx = this.canvas.getContext("2d")!
        this.objects = []
        this.interactables = new Map<Coord, GameObject>
        this.player = new Player({
            gridPos: { x: 5, y: 7 },
            name: "player",
            scene: this,
            spriteConfig: {
                src: "assets/spritesheets/character.png",
                currentAnim: "idle-down"
            }
        })
        this.map = new PixelMap("example_map", 6, 8)
        this.time = new Time(48)
        this.camera = new Camera({
            object: this.player
        })
        this.keyInput = new KeyInput({ puppet: this.player })
        this.isPaused = false

    }

    update = () => {
        this.player.update()
        this.objects.forEach(object => object.update())
    }

    render = () => {
        const gameState = {
            camera: this.camera,
            time: this.time
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.map.drawLayer(this.ctx, gameState, "Water");
        this.map.drawLayer(this.ctx, gameState, "Ground");
        this.map.drawLayer(this.ctx, gameState, "main");
        for (const object of this.objects) {
            object.sprite.draw(this.ctx, gameState)
        }
        this.player.sprite.draw(this.ctx, gameState)
        //this.map.drawLayer(this.ctx, gameState, "Roof");
    }

    init() {
        const { pause, play } = this.time.runLoop(this.update, this.render)!
        this.pause = pause
        this.play = play
    }

    pause?: () => void
    play?: () => void

    togglePause() {
        if (this.isPaused) {
            this.play?.()
            this.isPaused = false
        } else {
            this.pause?.()
            this.isPaused = true
        }
    }

    isSpaceValid(_coord: Coord) {
        const coord = utils.coordToString(_coord)
        console.log(this.map.layers["main"].tiles.get(coord), coord)
        
        if (this.map.layers["Ground"].tiles.has(coord) && !this.map.layers["main"].tiles.has(coord)) {
            console.log(true);
            return true;
        } else {
            console.log(false);
            return false;
        }
    }



}



