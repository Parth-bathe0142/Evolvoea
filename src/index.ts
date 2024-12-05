import { MovableObjectGrid } from "./models/basic/MovableObject.js"

// HTML Element that supports drawing custom images
const canvas = document.querySelector("canvas#game-canvas") as HTMLCanvasElement

// a "pen" associated with a canvas that is used for drawing to that canvas
const ctx = canvas.getContext("2d")!

ctx.fillRect(100, 100, 100, 100)

const icon = new Image()
icon.src = "/assets/icons/GraphicsLogo.png"
icon.onload = () => {
    ctx.drawImage(icon, 105, 105, 90, 90)
}


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
                { frame: { x: 0, y: 0} }
            ],
            "walk-down": [
                { frame: { x: 0, y: 0} },
                { frame: { x: 2, y: 0} },
                { frame: { x: 0, y: 0} },
                { frame: { x: 3, y: 0} },
            ],
            "bob-down": [
                { frame: { x: 0, y: 0}, duration: 32 },
                { frame: { x: 1, y: 0}, duration: 32 },
            ]
        },
        currentAnim: "walk-down"
    }
})
console.log(object.drawPos, " ", canvas.width/2, canvas.height/2)
setInterval(() => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    object.update()
    object.sprite.draw(ctx)
}, 20)

setTimeout(() => object.makeMove("down"), 5000);
