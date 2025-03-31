import { GameObject, GameObjectConfig } from "../models/core/GameObject.js";
import { Coord } from "../models/core/misc.js";
import { utils } from "../models/core/utils.js";

export interface Tile {
    spritePos: Coord
}

export class TileMarker extends GameObject {
    constructor(pos: Coord) {
        const config = {
            drawPos: utils.GridToDraw(pos),
            spriteConfig: {
                src: "/assets/spritesheets/tile_marker.png",
                cropSize: { width: 16, height: 16 },
                drawSize: { width: 16, height: 16 },
                animations: {
                    "bob": [
                        { frame: { x: 0, y: 0 }},
                        { frame: { x: 1, y: 0 }}
                    ]
                },
                currentAnim: "bob",
                drawOffset: { x: 0, y: 0 }
                
            }
        }
        super(config)
    }
}