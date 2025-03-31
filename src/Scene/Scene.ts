import { GridSlime, GridSlimeConfig } from "../models/characters/npcs/GridSlime.js"
import { Player } from "../models/characters/Player.js"
import { Slime } from "../models/characters/slimes/Slime.js"
import { Camera } from "../models/core/Camera.js"
import { GameObject, GameObjectConfig } from "../models/core/GameObject.js"
import { KeyInput } from "../models/core/KeyInput.js"
import { Coord } from "../models/core/misc.js"
import { PathFinder } from "../models/core/PathFinder.js"
import { Time } from "../models/core/Time.js"
import { utils } from "../models/core/utils.js"
import { ui } from "../ui.js"
import { PixelMap } from "./PixelMap.js"
import { TileMarker } from "./Tile.js"

export interface SceneConfig {
    mapConfig?: {
        name: string
        spritesheetSize: [number, number]
        goal: Coord
    }
    playerPos?: Coord
    Characters?: ["person" | "slime", GridSlimeConfig][]
    randomSpawns?: number
}

export class Scene {

    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement

    characters: GameObject[] = []
    randomeSpawns = 0
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
        this.randomeSpawns = config.randomSpawns ?? 0

        this.player = new Player({
            gridPos: config.playerPos ?? { x: 5, y: 7 },
            name: "player",
            scene: this,
            spriteConfig: {
                src: "../assets/spritesheets/character.png",
                currentAnim: "idle-down"
            }
        })

        this.interactables = new Map<Coord, GameObject>
        const goal = config.mapConfig?.goal
        if(goal) {
            const marker = new TileMarker(goal)
            this.interactables.set(goal, marker)

        }

        if(config.mapConfig) {
            this.map = new PixelMap(
                config.mapConfig.name,
                ...config.mapConfig.spritesheetSize,
                config.mapConfig.goal
            )
        } else {
            this.map = new PixelMap("example_map", 6, 8, { x: 0, y: 0 })
        }
        this.time = new Time(48)
        this.camera = new Camera({
            object: this.player
        })
        this.keyInput = new KeyInput({ puppet: this.player })
        this.pathFinder = new PathFinder()

        this.isPaused = false

        this.load(config)
    }

    private async load(config: SceneConfig) {

        
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
        
        if(config.randomSpawns) {
            for(let i = 1; i <= config.randomSpawns; i++) {
                this.spawnRandomSlime()
                console.log("attempt");
            }
        }
        this.init()
    }

    update = () => {
        this.player.update()
        this.characters.forEach(object => {
            object.update()

            if(object instanceof GridSlime) {
                if(utils.getDistance(object.gridPos, this.player.gridPos) < 1.5) {
                    object.die()

                    this.player.health --
                    ui.removeHealth()
                    if(this.player.health <= 0) {
                        this.endGame("lose")
                    }
                }
            }
        })
        for(let i = 0; i < this.randomeSpawns - this.characters.length; i++) {
            this.spawnRandomSlime()
        }

        this.interactables.forEach(object => object.update())

        if(utils.getDistance(this.player.gridPos, this.map.goal) < 1.5) {
            this.endGame("win", this.player.health)
        }
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
        this.interactables.forEach(object => {
            object.sprite.draw(this.ctx, gameState)
        })
        for (const object of this.characters) {
            object.sprite.draw(this.ctx, gameState)
        }
        this.player.sprite.draw(this.ctx, gameState)
        this.map.drawLayer(this.ctx, gameState, "Roof");
    }

    private init() {
        setTimeout(() => {
            const { pause, play } = this.time.runLoop(this.update, this.render)!
            this.pause = pause
            this.play = play
        }, 500)
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


    spawnRandomSlime() {
        const playerPos = this.player.gridPos

        const randomPos = {
            x: Math.floor(Math.random() * this.map.width),
            y: Math.floor(Math.random() * this.map.width)
        }
        for(let trial = 0; trial < 5000; trial++) {
            if(utils.getDistance(playerPos, randomPos) > 5) {
                if(this.isSpaceValid(randomPos)) {
                    this.characters.push(new GridSlime({
                        name: "",
                        spawnPoint: randomPos,
                        index: Math.floor(Math.random() * 7),
                        scene: this
                    }))
                    break
                }
            }
        }
    }

    endGame(status: "lose"): void;
    endGame(status: "win", health: number): void;

    endGame(status: "win" | "lose", health?: number) {
        this.destroy()

        if(status == "win") {
            health = health!

            ui.gameWon()
            fetch("/add-score", {
                headers: {
                    'content-type': "application/json"
                },
                method: 'post',
                body: JSON.stringify({
                    score: health * 10 * (health / 5)
                })
            })
              .then(res => {
                if(res.ok) {
                    return res.json()
                }
              })
              .then(json => {
                if(json.result == "success") {
                    ui.displayScore(json.newscore)
                } else {
                    ui.displayScore("error: " + json.reason)
                }
              })
              .catch(err => {
                ui.displayScore("error: " + err)
              })
        } else {
            ui.gameOver()
            ui.displayScore("0")
        }
    }

    destroy() {
        this.pause?.()
        setTimeout(() => {
            this.characters.forEach(char => {
                char.destroy()
            })
            this.characters = []
            this.player.destroy()
            this.map.destroy()
            this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
            
            ui.emptyHealth()
        }, 20)
      }
}



