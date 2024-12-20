import { GameObject } from "./GameObject.js"
import { AnimFrame, BoundingBox, Coord, CROP_SIZE, DEFAULT_ANIM_DURATION, DRAW_SIZE, GameState } from "./misc.js"

export interface SpriteConfig {
    gameObject?: GameObject
    src: string
    drawOffset?: Coord
    spritePadding?: BoundingBox
    cropSize?: BoundingBox
    drawSize?: BoundingBox
    isAnimated?: boolean
    animations?: { [key: string] : AnimFrame[] }
    currentAnim?: string
}

export class Sprite {

    private static imageCache = new Map<string, { img: HTMLImageElement, count: number}>()

    private static async addImage(src: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            if(this.imageCache.has(src)) {
                this.imageCache.get(src)!.count++
                resolve(this.imageCache.get(src)!.img)
            } else {
                const img = new Image()
                img.src = src
                this.imageCache.set(src, { img, count: 1 })
                img.onload = () => resolve(img)
            }
        })
    }

    private static removeImage(src: string) {
        if(this.imageCache.has(src)) {
            let entry = this.imageCache.get(src)!
            entry.count--
            if(entry.count == 0) {
                this.imageCache.delete(src)
            }
        }
    }

    src: string
    img: HTMLImageElement | null = null
    spritePadding = { width: 0, height: 0 }
    cropSize: BoundingBox
    drawSize: BoundingBox
    drawOffset: Coord = { x: 0, y: 0 }
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

        this.src = config.src
        if (this.src != "") {
            Sprite.addImage(config.src)
              .then(img => {
                  this.img = img
                  this.imgLoaded = true
              })
            this.drawOffset = config.drawOffset ?? this.drawOffset
        }

        this.spritePadding = config.spritePadding ?? this.spritePadding
        this.cropSize = config.cropSize ?? CROP_SIZE
        this.drawSize = config.drawSize ?? DRAW_SIZE

        this.isAnimated = config.isAnimated ?? this.isAnimated
        this.animations = config.animations ?? this.animations
        this.currentAnim = config.currentAnim ?? this.currentAnim
    }

    get frame(): AnimFrame { 
        return this.animations[this.currentAnim][this.currentAnimFrame]
    }

    set currentAnimation(value: string) {
        if(this.animations[value] && this.currentAnim != value) {
            this.currentAnim = value
            this.currentAnimFrame = 0
        }
    }

    updateSprite() {
        this.animProgress--
        if(this.animProgress == 0) {
            this.currentAnimFrame += 1
            this.currentAnimFrame %= this.animations[this.currentAnim].length
            
            this.animProgress = this.frame.duration ?? DEFAULT_ANIM_DURATION
        }
    }

    destroy() {
        if(this.img) {
            Sprite.removeImage(this.src)
        }
    }


    draw(ctx: CanvasRenderingContext2D, state: GameState) {
        if(this.imgLoaded) {
            const drawPos = this.gameObject.drawPos
            const frame = this.frame

            let dx = drawPos.x + this.drawOffset.x + (frame.offset?.x ?? 0)
            let dy = drawPos.y + this.drawOffset.y + (frame.offset?.y ?? 0)

            if(state.camera) {
                const cameraOffset = state.camera.offset
                dx += cameraOffset.x
                dy += cameraOffset.y
            }

            const sx = frame.frame.x * (this.cropSize.width + this.spritePadding.width)
            const sy = frame.frame.y * (this.cropSize.height + this.spritePadding.height)

            // draws one cropped part of the image at the location of the game object
            ctx.drawImage(
                this.img!,                                   // image to draw from
                sx, sy,                                      // crop top left
                this.cropSize.width, this.cropSize.height,   // crop width and height
                dx, dy,                                      // draw top left
                this.drawSize.width, this.drawSize.height    // draw width and height
            )
        }
    }
}