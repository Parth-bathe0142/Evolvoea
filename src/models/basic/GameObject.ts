import { Coord } from "./misc.js"
import { Sprite, SpriteConfig } from "./Sprite.js"


// constructor parameters
interface GameObjectConfig {
    pos?: Coord,
    spriteConfig: SpriteConfig 
}

// exported items can be used in other files
export class GameObject {

    //instance variables
    pos: Coord = { x: 0, y: 0}
    sprite: Sprite

    constructor(config: GameObjectConfig) {
        this.pos = config.pos || this.pos

        // definitely assigning a value to an optional param, ! can be used later in Sprite constructor
        // to claim that a value definitely exists and is not undefined
        config.spriteConfig.gameObject = this 
        this.sprite = new Sprite(config.spriteConfig)
    }
}