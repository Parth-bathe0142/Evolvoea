import { Scene, SceneConfig } from "./Scene/Scene.js"
import { ui } from "./ui.js";

const titleScreen = document.getElementById("title-screen")!
const replayScreen = document.getElementById("replay-screen")!

ui.goToScreen("title-screen")

document.querySelector("#title-screen_button")?.addEventListener("click", async e => {
    runGame()
    ui.goToScreen("")
})

document.querySelector("#replay-screen_button_return")?.addEventListener("click", async e => {
    ui.goToScreen("title-screen")
})
document.querySelector("#replay-screen_button_replay")?.addEventListener("click", async e => {
    ui.goToScreen("")
})

async function runGame() {
    const response = await fetch("/assets/demo_scenes/scenes.json")
    const json = await response.json()
    
    const scenes = Object.keys(json)
    const randomScene = scenes[Math.floor(scenes.length * Math.random())]
    
    const scene = new Scene(json[randomScene] as SceneConfig)
}

