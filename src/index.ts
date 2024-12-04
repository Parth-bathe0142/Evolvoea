import { GameObject } from "./models/basic/GameObject.js"

// HTML Element that supports drawing custom images
const canvas = document.querySelector("canvas#game-canvas") as HTMLCanvasElement

// a "pen" associated with a canvas that is used for drawing to that canvas
const ctx = canvas.getContext("2d")!

ctx.fillRect(200, 200, 200, 200)

const icon = new Image()
icon.src = "/assets/icons/GraphicsLogo.png"
icon.onload = () => {
    ctx.drawImage(icon, 210, 210, 180, 180)
}


// example of creating an object using configs, skipping some optional parameters
const object = new GameObject({
    pos: { x: 5, y: 7},
    spriteConfig: {
        src: "assets/spritesheets/character.png",
    }
})

setTimeout(() => {
    object.sprite.draw(ctx)
}, 2000)