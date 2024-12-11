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

/**
 * The root class for all ingame entities. Contains
 * only sprite and draw position information
 */
export abstract class GameObject {

    drawPos: Coord = { x: 0, y: 0 }
    sprite: Sprite

    constructor(config: GameObjectConfig) {
        this.drawPos = config.drawPos || { x: 0, y: 0 }

        config.spriteConfig.gameObject = this
        this.sprite = new Sprite(config.spriteConfig)
    }
    /**
     * only updates the sprite if it is animated, 
     * otherwise does nothing
     */
    update(): void {
        this.sprite.isAnimated && this.sprite.updateSprite()
    }

    destroy() {
        this.sprite.destroy()
    }
}