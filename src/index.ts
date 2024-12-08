import { MovableObjectFree, MovableObjectGrid } from "./models/basic/MovableObject.js"
import { utils } from "./utils.js"
import { Time } from "./Time.js"
import { Camera } from "./models/basic/Camera.js"

// HTML Element that supports drawing custom images
const canvas = document.querySelector("canvas#game-canvas") as HTMLCanvasElement

// a "pen" associated with a canvas that is used for drawing to that canvas
const ctx = canvas.getContext("2d")!

// example of creating an object using configs, skipping some optional parameters
const object = new MovableObjectGrid({
    gridPos: { x: 12, y: 7},
    spriteConfig: {
        src: "assets/spritesheets/character.png",
        cropSize: 48,
        drawSize: 48,
        imgOffset: { x: -24, y: -24 },
        animations: {
            "idle-down": [
                { frame: { x: 0, y: 0 } }
            ],
            "walk-down": [
                { frame: { x: 0, y: 0 } },
                { frame: { x: 2, y: 0 } },
                { frame: { x: 0, y: 0 } },
                { frame: { x: 3, y: 0 } },
            ],
            "walk-left": [
                { frame: { x: 0, y: 2 } },
                { frame: { x: 2, y: 2 } },
                { frame: { x: 0, y: 2 } },
                { frame: { x: 3, y: 2 } },
                
            ],
            "bob-down": [
                { frame: { x: 0, y: 0 }, duration: 32 },
                { frame: { x: 1, y: 0 }, duration: 32 },
            ],
            "rotate": [
                { frame: { x: 0, y: 0 } },
                { frame: { x: 0, y: 2 } },
                { frame: { x: 0, y: 1 } },
                { frame: { x: 0, y: 3 } }

            ]
        },
        currentAnim: "rotate"
    }
})

const object2 = new MovableObjectGrid({
    gridPos: { x: 10, y: 5},
    spriteConfig: {
        src: "assets/spritesheets/character.png",
        cropSize: 48,
        drawSize: 48,
        imgOffset: { x: -24, y: -24 },
        isAnimated: false
    }
})

const camera = new Camera({ object: object })
function update() {
    object.update()
    object2.update()
}
function render() {
    const gameState = {
        camera
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    object.sprite.draw(ctx, gameState)
    object2.sprite.draw(ctx, gameState)
}

const time = new Time(48)
const { pause, play } = time.runLoop(update, render)!

await time.delay(4 * 48)
object.makeMove("down")
await time.delay(4 * 48)
object.makeMove("left")