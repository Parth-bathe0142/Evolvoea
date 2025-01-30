import { GridCharacterConfig } from "../models/characters/GridCharacter.js"
import { GridSlime, GridSlimeConfig } from "../models/characters/npcs/GridSlime.js"
import { Player } from "../models/characters/Player.js"
import { Camera } from "../models/core/Camera.js"
import { GameObject, GameObjectConfig } from "../models/core/GameObject.js"
import { KeyInput } from "../models/core/KeyInput.js"
import { Coord } from "../models/core/misc.js"
import { PathFinder } from "../models/core/PathFinder.js"
import { Time } from "../models/core/Time.js"
import { utils } from "../models/core/utils.js"
import { PixelMap } from "./PixelMap.js"

interface SceneConfig {
    mapConfig?: {
        name: string
        spritesheetSize: [number, number]
    }
    playerPos?: Coord
    Characters?: ["person" | "slime", GridSlimeConfig][]
}

export class Scene {

    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement

    characters: GameObject[] = []
    interactables: Map<Coord, GameObject>
    player: Player
    map: PixelMap
    time: Time
    camera: Camera
    keyInput: KeyInput
    pathFinder: PathFinder

    isPaused: boolean

    constructor(config: SceneConfig) {
        this.canvas = document.getElementById("game-canvas")! as HTMLCanvasElement
        this.ctx = this.canvas.getContext("2d")!
        this.characters = []
        this.interactables = new Map<Coord, GameObject>
        this.player = new Player({
            gridPos: config.playerPos ?? { x: 5, y: 7 },
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
        this.pathFinder = new PathFinder()

        this.isPaused = false

        this.load(config)
    }

    async load(config: SceneConfig) {

        
        config.Characters?.forEach(([type, conf]) => {
            conf.scene = this
            switch(type) {
                case "slime":
                    this.characters.push(new GridSlime(conf as GridSlimeConfig))
                }
        })
        await this.map.load()
        const bmap = PathFinder.mapFromPixelMap(this.map)
        this.pathFinder.setMap(bmap, this.map.height, this.map.width)
        this.init()
    }

    update = () => {
        this.player.update()
        this.characters.forEach(object => object.update())
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
        for (const object of this.characters) {
            object.sprite.draw(this.ctx, gameState)
        }
        this.player.sprite.draw(this.ctx, gameState)
        this.map.drawLayer(this.ctx, gameState, "Roof");
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
        
        if (this.map.layers["Ground"].tiles.has(coord) && !this.map.layers["main"].tiles.has(coord)) {
            return true;
        } else {
            return false;
        }
    }

    getCharacterById(id: number | string): GameObject | null {
        for(const obj of this.characters) {
            if(obj.id == id) {
                return obj
            }
        }

        return null
    }
}



