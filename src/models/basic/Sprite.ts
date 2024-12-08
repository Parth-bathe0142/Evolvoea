import { GameObject } from "./GameObject.js"
import { AnimFrame, Coord, CROP_SIZE, DEFAULT_ANIM_DURATION, DRAW_SIZE, GameState } from "./misc.js"


// constructor parameters
export interface SpriteConfig {
    gameObject?: GameObject                     // optional paramenter with ?
    src: string                                 // mandatory parameter without ?
    imgOffset?: Coord
    cropSize?: number
    drawSize?: number
    isAnimated?: boolean
    animations?: {[key: string] : AnimFrame[]}  // dynamic object with unknown property names
    currentAnim?: string
}

export class Sprite {
    img: HTMLImageElement | null = null
    cropSize: number
    drawSize: number
    imgOffset = { x: 0, y: 0 }
    isAnimated = true
    
    private gameObject: GameObject
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
        this.gameObject = config.gameObject!

        if (config.src != "") {
            this.img = new Image()
            this.img.src = config.src
            this.img.onload = () => this.imgLoaded = true
            this.imgOffset = config.imgOffset || this.imgOffset
        }

        this.cropSize = config.cropSize || CROP_SIZE
        this.drawSize = config.drawSize || DRAW_SIZE

        this.isAnimated = config.isAnimated || this.isAnimated
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


    draw(ctx: CanvasRenderingContext2D, state: GameState) { // function return types are always optional
        if(this.imgLoaded) {
            const drawPos = this.gameObject.drawPos
            const frame = this.frame // calling get method as if it is a property

            let dx = drawPos.x + this.imgOffset.x + (frame.offset?.x || 0)
            let dy = drawPos.y + this.imgOffset.y + (frame.offset?.x || 0)

            if(state.camera) {
                const cameraOffset = state.camera.offset
                dx += cameraOffset.x
                dy += cameraOffset.y
            }

            const sx = frame.frame.x * this.cropSize
            const sy = frame.frame.y * this.cropSize

            // draws one cropped part of the image at the location of the game object
            ctx.drawImage(
                this.img!,                           // image to draw from
                sx, sy,                             // crop top left
                this.cropSize, this.cropSize,       // crop width and height
                dx, dy,                             // draw top left
                this.drawSize, this.drawSize        // draw width and height
            )
        }
    }
}