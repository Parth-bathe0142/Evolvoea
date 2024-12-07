import { MovableObjectFree } from "./models/basic/MovableObject.js"
import { utils } from "./utils.js"
import { Time } from "./Time.js"

// HTML Element that supports drawing custom images
const canvas = document.querySelector("canvas#game-canvas") as HTMLCanvasElement

// a "pen" associated with a canvas that is used for drawing to that canvas
const ctx = canvas.getContext("2d")!

// example of creating an object using configs, skipping some optional parameters
const object = new MovableObjectFree({
    drawPos: utils.GridToDraw({ x: 11, y: 7}),
    speed: 1,
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
            "bob-down": [
                { frame: { x: 0, y: 0 }, duration: 32 },
                { frame: { x: 1, y: 0 }, duration: 32 },
            ]
        },
        currentAnim: "walk-down"
    }
})
function update() {
    object.update()
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    object.sprite.draw(ctx)
}

const time = new Time(48)
const { pause, play } = time.runLoop(update, render)!
Time.Test()

