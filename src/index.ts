import { GridCharacter } from "./models/characters/GridCharacter.js";
import { Scene } from "./Scene/Scene.js"

const scene = new Scene({
    playerPos: { x: 4, y: 8 },
    Characters: [
        ["slime", {
            spawnPoint: { x: 4, y: 4 },
            index: 2,
            name: "slime1",
            id: "slime1"
        }]
    ]
});
setTimeout(async() => {
    await scene.player.startWalkTo({ x: 4, y: 7 });  
    await scene.time.delay(2);
    (scene.getCharacterById("slime1") as GridCharacter).startWalkTo({ x: 6, y: 15 })
}, 800);

