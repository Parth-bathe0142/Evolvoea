import { Coord, GameState } from "../models/core/misc.js";
import { utils } from "../models/core/utils.js";
import { Tile } from "./Tile.js";

/**
 * Stores an array of Tiles
 */
interface Layer {
    name: string
    tiles: Tile[] /** @todo change to Map<Coord, Tile> */
    collider: boolean // other data stored in the layer
}

interface JSONInput {
    tileSize: number
    mapWidth: number
    mapHeight: number
    layers: {
        name: string
        tiles: { id: string, x: number, y: number }[]
        collider: boolean
    }[]
}

export interface PixelMapi {
    // height and width of the map
    height: number
    width: number

    // rows and columns in the spritesheet
    spritesheetRows: number
    spritesheetCols: number

    // object that stores all layers as an object 
    // of format layername: layerobject
    layers: { [key: string]: Layer }

    // Images constructed from each layer stored as ImageData
    // to draw to the canvas in bulk
    layerImageData: { [key: string]: ImageData } | null

    constructor(name: string): PixelMap // Creates a new PixelMap

    initLayers(json: any): void // parses the json data into layers
    initImageData(): void // creates images from Layers

    updateImageData(layer: string): void // reconstructs images to show updated tiles
    updateTile(coord: Coord, to: string): void // Makes changes in any layer, changing the id of any tile

    getSpritesheetCoord(id: string): Coord // returns a coord corresponding to a tile id in json

    drawLayer(ctx: CanvasRenderingContext2D, state: GameState, layer: string): void // draws given layer to the ctx
}
export class PixelMap {
    height: number = 0
    width: number = 0

    // rows and columns in the spritesheet
    spritesheetRows: number = 0
    spritesheetCols: number = 0
    spriteSheet = new Image()

    // object that stores all layers as an object 
    // of format layername: layerobject
    layers: { [key: string]: Layer } = {}

    // Images constructed from each layer stored as ImageData
    // to draw to the canvas in bulk
    layerImageData: { [key: string]: ImageData } | null = {}

    /**
     * Displays error when map is not found
     * @param name The folder name in which the spritesheet and map.json is present
     * @param spriteRows number of rows in spritesheet.png (rows -> up/down)
     * @param spriteCols number of cols in spritesheet.png (cols -> right/left)
     */
    constructor(name: string, spriteRows: number, spriteCols: number) {
        let json: JSONInput;
        this.spritesheetCols = spriteCols
        this.spritesheetRows = spriteRows

        fetch(`assets/maps/${name}/map.json`)
            .then(response => response.json())
            .then(js => {
                json = js
                this.initLayer(json)
            })
            .catch(err => console.error("map not found: " + err))

        this.spriteSheet.src = `assets/maps/${name}/spritesheet.png`

    }
    /**
     * Initialize each layer one by one using for of loop
     * @param json stores the Id, coordinates of x and y and the name of the layer
     */
    initLayer(json: JSONInput) {
        this.height = json.mapHeight
        this.width = json.mapWidth

        for (const layer of json.layers) {

            this.layers[layer.name] = {
                name: layer.name,
                tiles: [],
                collider: layer.collider
            }
            const current = this.layers[layer.name]
            // { id: string, x: number, y: number }
            //{gridPos: Coord; spritePos: Coord}
            for (const obj of layer.tiles) {
                current.tiles.push({
                    gridPos: { x: obj.x, y: obj.y },
                    spritePos: this.getSpritesheetCoord(obj.id)
                })
            }
        }
    }

    /**
     * 
     * @todo 
     * @param ctx 
     * @param state 
     * @param layer 
     */
    drawLayerData(ctx: CanvasRenderingContext2D, state: GameState, layer: string) {

    }

    /**
     * Draws the requested layer by iterating each tile
     * @param ctx 
     * @param state 
     * @param layer Which layer to draw
     */
    drayLayer(ctx: CanvasRenderingContext2D, state: GameState, layer: string) {
        const tiles = this.layers[layer].tiles
        for (const tile of tiles) {
            let drawPos = utils.GridToDraw(tile.gridPos)
            drawPos.x += state.camera?.offset.x ?? 0
            drawPos.y += state.camera?.offset.y ?? 0
            ctx.drawImage(
                this.spriteSheet,
                tile.spritePos.x, tile.spritePos.y,
                16, 16,

                drawPos.x, drawPos.y,
                16, 16
            )
        }
    }

    /**
     * Takes the id from the json file of each tile
     * Coords -> The top-left coordinates of a tile
     * @param id String value that is received from the json file
     * @returns converted values as a Coord on the SpriteSheet
     */
    private getSpritesheetCoord(id: string) {
        const nid = parseInt(id)
        return {
            x: (nid % this.spritesheetCols) * 16,
            y: Math.floor(nid / this.spritesheetCols) * 16
        }
    }
}
