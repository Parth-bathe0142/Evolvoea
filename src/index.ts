import { Scene } from ""
const scene = new Scene({
    mapConfig: {
        name: "example_map",
        spritesheetSize: [6, 8]
    },
    playerPos: { x: 4, y: 4 }
});
setTimeout(async() => {
    await scene.time.delay(5)
    await scene.player.startWalkTo({ x: 11, y: 5 })
    await scene.time.delay(5)
    await scene.player.startWalkTo({ x: 10, y: 18 })
    await scene.time.delay(5)
    await scene.player.startWalkTo({ x: 8, y: 7 })
}, 200);

