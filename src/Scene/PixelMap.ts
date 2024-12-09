import { Coord, GameState } from "../models/basic/misc";
import { Tile } from "./Tile";

/**
 * Stores an array of Tiles
 */
interface Layer {
    name: string
    tiles: Tile[] // tile array parsed from what was received from json
    collider: boolean // other data stored in the layer
}

export interface PixelMap {
    // height and width of the map
    height: number
    width: number

    // rows and columns in the spritesheet
    spritesheetRows: number
    spritesheetCols: number

    // object that stores all layers as an object 
    // of format layername: layerobject
    layers: { [key:string]: Layer }

    // Images constructed from each layer stored as ImageData
    // to draw to the canvas in bulk
    layerImageData: { [key: string]: ImageData } | null

    constructor(name: string): PixelMap // Creates a new PixelMap

    initLayers(): void // parses the json data into layers
    initImageData(): void // creates images from Layers
    
    updateImageData(layer: string): void // reconstructs images to show updated tiles
    updateTile(coord: Coord, to: string): void // Makes changes in any layer, changing the id of any tile

    getSpritesheetCoord(id: string): Coord // returns a coord corresponding to a tile id in json
    
    drawLayer(ctx: CanvasRenderingContext2D, state: GameState, layer: string): void // draws given layer to the ctx
}