import { MovableObjectFree } from "./models/basic/MovableObject.js"

// HTML Element that supports drawing custom images
const canvas = document.querySelector("canvas#game-canvas") as HTMLCanvasElement

// a "pen" associated with a canvas that is used for drawing to that canvas
const ctx = canvas.getContext("2d")!

// example of creating an object using configs, skipping some optional parameters
const object = new MovableObjectFree({
    drawPos: { x: 12, y: 7},
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
setInterval(() => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    object.update()
    object.sprite.draw(ctx)
}, 20)

setTimeout(() => object.moveTowards({ x: 16, y: 3}, "grid"), 5000);
