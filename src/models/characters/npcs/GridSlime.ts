import { AnimFrame, Coord, DEFAULT_ANIM_DURATION, GridDirs, Save } from "../../core/misc.js";
import { SpriteConfig } from "../../core/Sprite.js";
import { GridCharacter, GridCharacterConfig } from "../GridCharacter.js";

export interface GridSlimeConfig extends Omit<GridCharacterConfig, "spriteConfig"> {
    spriteConfig?: SpriteConfig
    spawnPoint: Coord
    index: number
}

export class GridSlime extends GridCharacter {
    static getAnimations(y: number): { [key: string]: AnimFrame[] } {
        return {
            "idle": [
                { frame: { x: 0, y }, image: "../assets/spritesheets/slimes/slime_idle2.png" },
                { frame: { x: 1, y } },
                { frame: { x: 2, y } },
                { frame: { x: 3, y } },
                { frame: { x: 4, y } },
                { frame: { x: 5, y } },
                { frame: { x: 6, y } },
            ],
            "jump": [
                { frame: { x: 0, y }, image: "../assets/spritesheets/slimes/slime_jump.png" },
                { frame: { x: 1, y } },
                { frame: { x: 2, y } },
                { frame: { x: 3, y } },
                { frame: { x: 4, y } },
                { frame: { x: 5, y } },
                { frame: { x: 6, y } },
                { frame: { x: 7, y } },
                { frame: { x: 8, y } },
                { frame: { x: 9, y } },
                { frame: { x: 10, y } },
            ],
            "walk-left": [
                { frame: { x: 0, y }, image: "../assets/spritesheets/slimes/slime_move.png", flip: true },
                { frame: { x: 1, y }, flip: true },
                { frame: { x: 2, y }, flip: true },
                { frame: { x: 3, y }, flip: true },
                { frame: { x: 4, y }, flip: true },
                { frame: { x: 5, y }, flip: true },
                { frame: { x: 6, y }, flip: true },
            ],
            "walk-right": [
                { frame: { x: 0, y }, image: "../assets/spritesheets/slimes/slime_move.png" },
                { frame: { x: 1, y } },
                { frame: { x: 2, y } },
                { frame: { x: 3, y } },
                { frame: { x: 4, y } },
                { frame: { x: 5, y } },
                { frame: { x: 6, y } },
            ],
            "die": [
                { frame: { x: 0, y }, image: "../assets/spritesheets/slimes/slime_move.png" },
                { frame: { x: 1, y } },
                { frame: { x: 2, y } },
                { frame: { x: 3, y } },
                { frame: { x: 4, y } },
                { frame: { x: 5, y } },
                { frame: { x: 6, y } },
                { frame: { x: 7, y } },
                { frame: { x: 8, y } },
                { frame: { x: 9, y } },
                { frame: { x: 10, y } },
                { frame: { x: 11, y } },
                { frame: { x: 12, y } },
            ]
        }
    }

    index: number
    spawnPoint: Coord
    isAlive = true
    // deadUpdates = 13 * DEFAULT_ANIM_DURATION
    maxSteps = 24
    failure = 0
    
    constructor(config: GridSlimeConfig) {
        config.spriteConfig = {
            src: "../assets/spritesheets/slimes/slime_idle2.png",
            drawSize: { width: 80, height: 72 },
            cropSize: { width: 80, height: 72 },
            drawOffset: { x: -26, y: -32},
            animations: GridSlime.getAnimations(config.index),
            currentAnim: "idle"
        }
        config.gridPos = config.spawnPoint
        super(config as GridCharacterConfig)

        this.index = config.index
        this.spawnPoint = config.spawnPoint

        const walkListener = (e: any) => {
            if(this.isAlive) {

                if(e.details?.who == this.id) {
                    let chance = Math.random()
                    if(chance < 0.50)
                        this.followPlayer()
                }
            }
        }
        document.addEventListener("complete-walk", walkListener)
        this.eventListeners.set("complete-walk", walkListener)
        
    }

    update(): void {
        super.update()

        if(this.isAlive) {
            if(!this.movingTo) {
                this.followPlayer()
            }
        }
    }

    followPlayer() {
        const playerPos = this.scene.player.gridPos
        if(!this.movingTo) {
            
            this.startWalkTo(playerPos).catch(err => {
                this.failure++

                if(this.failure > 50) {
                    this.die()
                }
            })
        }      
    }

    makeMove(to: GridDirs, resolve?: () => void): void {
        super.makeMove(to, resolve)
        const mapping = {
            "up": "walk-left",
            "right": "walk-right",
            "down": "walk-right",
            "left": "walk-left",
            "none": "idle"
        }
        this.sprite.currentAnimation = mapping[to]

        if(mapping[to] == "walk-left") {
            this.sprite.drawOffset = { x: -36, y: -32}  
        } else {
            this.sprite.drawOffset = { x: -26, y: -32}
        }
    }

    stop() {
        super.stop()
        setTimeout(() => {
            !this.movingTo && (this.sprite.currentAnimation = `idle-${this.facing}`)
        }, 10)
    }

    die() {
        this.stop()
        this.sprite.currentAnimation = "die"
        this.isAlive = false
        this.scene.characters = this.scene.characters.filter(o => o !== this)
        this.destroy()
    }
}