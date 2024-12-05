import { Coord } from "./misc.js"
import { Sprite, SpriteConfig } from "./Sprite.js"


// constructor parameters
export interface GameObjectConfig {
    gridPos?: Coord,
    spriteConfig: SpriteConfig 
}

// exported items can be used in other files
export abstract class GameObject {

    //instance variables
    gridPos: Coord = { x: 0, y: 0 }
    drawPos: Coord = { x: 0, y: 0 }
    sprite: Sprite

    constructor(config: GameObjectConfig) {
        this.gridPos = config.gridPos || this.gridPos
        this.drawPos = { x: this.gridPos.x * 16, y: this.gridPos.y * 16 }

        // definitely assigning a value to an optional param, ! can be used later in Sprite constructor
        // to claim that a value definitely exists and is not undefined
        config.spriteConfig.gameObject = this 
        this.sprite = new Sprite(config.spriteConfig)
    }

    update(): void {
        this.sprite.updateSprite()
    }
}