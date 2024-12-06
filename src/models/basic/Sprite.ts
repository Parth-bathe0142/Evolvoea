import { GameObject } from "./GameObject.js"
import { AnimFrame, Coord, CROP_SIZE, DEFAULT_ANIM_DURATION, DRAW_SIZE } from "./misc.js"           // import only what is needed


// constructor parameters
export interface SpriteConfig {
    gameObject?: GameObject                     // optional paramenter with ?
    src: string                                 // mandatory parameter without ?
    imgOffset?: Coord
    cropSize?: number                           // object with known properties
    drawSize?: number
    animations?: {[key: string] : AnimFrame[]}  // dynamic object with unknown property names
    currentAnim?: string
}

export class Sprite {
    //instance variables
    gameObject: GameObject                      // mention datatype when not immediatly initialised
    img = new Image()                           // datatype can be skipped when immediatly initialised
    cropSize: number                           // object with known properties
    drawSize: number
    imgOffset = { x: 0, y: 0}
    
    private imgLoaded = false
    private animations: {[key: string] : AnimFrame[]} = { 
        "default": [
            { frame: { x: 0, y: 0 } }
        ]
    }
    private currentAnim = "default"
    private currentAnimFrame = 0
    private animProgress = 1

    constructor(config: SpriteConfig) {
        this.gameObject = config.gameObject!//parameter was optional, ! claims that a value definitely exists

        this.img.src = config.src
        this.img.onload = () => this.imgLoaded = true
        this.imgOffset = config.imgOffset || this.imgOffset

        this.cropSize = config.cropSize || CROP_SIZE
        this.drawSize = config.drawSize || DRAW_SIZE

        this.animations = config.animations || this.animations // value from config if present, else default
        this.currentAnim = config.currentAnim || this.currentAnim
    }

    // get methods have a syntax like properties instead of methods
    get frame(): AnimFrame { 
        return this.animations[this.currentAnim][this.currentAnimFrame]
    }

    updateSprite() {
        this.animProgress--
        if(this.animProgress == 0) {
            this.currentAnimFrame += 1
            this.currentAnimFrame %= this.animations[this.currentAnim].length
            
            this.animProgress = this.frame.duration || DEFAULT_ANIM_DURATION
        }
    }


    draw(ctx: CanvasRenderingContext2D) { // function return types are always optional
        if(this.imgLoaded) {
            const drawPos = this.gameObject.drawPos
            const frame = this.frame // calling get method as if it is a property

            const dx = drawPos.x + this.imgOffset.x
            const dy = drawPos.y + this.imgOffset.y

            const sx = frame.frame.x * this.cropSize
            const sy = frame.frame.y * this.cropSize

            // draws one cropped part of the image at the location of the game object
            ctx.drawImage(
                this.img,                           // image to draw from
                sx, sy,                             // crop top left
                this.cropSize, this.cropSize,       // crop width and height
                dx, dy,                             // draw top left
                this.drawSize, this.drawSize        // draw width and height
            )
        }
    }
}