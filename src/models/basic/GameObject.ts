import { Coord } from "./misc.js"
import { Sprite, SpriteConfig } from "./Sprite.js"


/**
 * @param drawPos Optional, starting position of the object on the grid
 * @param spriteConfig The sprite corresponding to this game object
 */
export interface GameObjectConfig {
    drawPos?: Coord,
    spriteConfig: SpriteConfig 
}

// exported items can be used in other files
export abstract class GameObject {

    //instance variables
    drawPos: Coord = { x: 0, y: 0 }
    sprite: Sprite

    constructor(config: GameObjectConfig) {
        this.drawPos = config.drawPos || { x: 0, y: 0 }

        // definitely assigning a value to an optional param, ! can be used later in Sprite constructor
        // to claim that a value definitely exists and is not undefined
        config.spriteConfig.gameObject = this 
        this.sprite = new Sprite(config.spriteConfig)
    }

    update(): void {
        this.sprite.updateSprite()
    }
}