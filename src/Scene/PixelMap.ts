import { Coord, GameState } from "../models/basic/misc";
import { Tile } from "./Tile";

interface Layer {
    name: string
    tiles: Tile[]
    collider: boolean
}

export interface PixelMap {
    height: number
    width: number
    spritesheetHeight: number
    spritesheetWidth: number

    layers: { [key:string]: Layer }
    layerImageData: ImageData[] | null

    constructor(name: string): PixelMap

    initLayers(): void
    initImageData(): void
    
    updateImageData(layer: string): void
    updateTile(coord: Coord, to: string): void

    getSpritesheetCoord(id: string): Coord
    
    drawLayer(ctx: CanvasRenderingContext2D, state: GameState, layer: string): void
}