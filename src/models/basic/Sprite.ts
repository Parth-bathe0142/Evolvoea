import { GameObject } from "./GameObject.js"
import { AnimFrame } from "./misc.js"           // import only what is needed


// constructor parameters
export interface SpriteConfig {
    gameObject?: GameObject                     // optional paramenter with ?
    src: string                                 // mandatory parameter without ?
    imgOffset?: { x: number, y: number}         // object with known properties
    animations?: {[key: string] : AnimFrame[]}  // dynamic object with unknown property names
}

export class Sprite {
    //instance variables
    gameObject: GameObject                      // mention datatype when not immediatly initialised
    img = new Image()                           // datatype can be skipped when immediatly initialised
    imgLoaded = false
    imgOffset = { x: 0, y: 0}

    animations: {[key: string] : AnimFrame[]} = { 
        "default": [
            { frame: { x: 0, y: 0 } }
        ]
    }
    currentAnim = "default"
    currentAnimFrame = 0

    constructor(config: SpriteConfig) {
        this.gameObject = config.gameObject!//parameter was optional, ! claims that a value definitely exists

        this.img.src = config.src
        this.img.onload = () => this.imgLoaded = true

        this.animations = config.animations || this.animations // value from config if present, else default
    }

    // get methods have a syntax like properties instead of methods
    get frame(): AnimFrame { 
        return this.animations[this.currentAnim][this.currentAnimFrame]
    }


    draw(ctx: CanvasRenderingContext2D) { // function return types are always optional
        if(this.imgLoaded) {
            const dx = this.gameObject.pos.x - this.imgOffset.x
            const dy = this.gameObject.pos.y - this.imgOffset.y

            const frame = this.frame // calling get method as if it is a property
            const sx = frame.frame.x
            const sy = frame.frame.y

            // draws one cropped part of the image at the location of the game object
            ctx.drawImage(
                this.img,     // image to draw from
                sx, sy,       // crop top left
                48, 48,       // crop width and height
                dx, dy,       // draw top left
                48, 48        // draw width and height
            )
        }
    }
}