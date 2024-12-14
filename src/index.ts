import { MovableObjectGrid } from "./models/core/MovableObject.js"
import { Time } from "./models/core/Time.js"
import { Camera } from "./models/core/Camera.js"
import { PixelMap } from "./Scene/PixelMap.js"
import { KeyInput } from "./models/core/KeyInput.js"
import { Player } from "./models/characters/Player.js"

// HTML Element that supports drawing custom images
const canvas = document.querySelector("canvas#game-canvas") as HTMLCanvasElement

// a "pen" associated with a canvas that is used for drawing to that canvas
const ctx = canvas.getContext("2d")!

// example of creating an object using configs, skipping some optional parameters
const object = new Player({
    gridPos: { x: 12, y: 7 },
    name: "player",
    spriteConfig: {
        src: "assets/spritesheets/character.png",
        currentAnim: "idle-down"
    }
})

const object2 = new MovableObjectGrid({
    gridPos: { x: 10, y: 5 },
    spriteConfig: {
        src: "assets/spritesheets/character.png",
        cropSize: { width: 48, height: 48 },
        drawSize: { width: 48, height: 48 },
        drawOffset: { x: 0, y: -4 },
        isAnimated: false
    }
})

const newMap = new PixelMap("example_map", 6, 8)

const camera = new Camera({ object: object })
function update() {
    object.update()
    object2.update()
}
function render() {
    const gameState = { camera, time }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    newMap.drayLayer(ctx, gameState, "Water")
    newMap.drayLayer(ctx, gameState, "Ground")
    newMap.drayLayer(ctx, gameState, "main")
    object.sprite.draw(ctx, gameState)
    object2.sprite.draw(ctx, gameState)
    newMap.drayLayer(ctx, gameState, "Roof")
}

const keyInput = new KeyInput({ puppet: object })

const time = new Time(48)
const { pause, play } = time.runLoop(update, render)!