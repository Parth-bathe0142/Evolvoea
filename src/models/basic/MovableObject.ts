import { utils } from "../../utils.js";
import { GameObject, GameObjectConfig } from "./GameObject.js";
import { Coord } from "./misc.js";

type GridDirs = "up" | "right" | "down" | "left" | "none"

export class MovableObjectGrid extends GameObject { 
    gridPos: Coord  
    steps = 0
    direction: GridDirs = "none"
    movingTo: Coord | null = null

    constructor(config: GameObjectConfig & { gridPos?: Coord}) {
        super(config)
        this.gridPos = config.gridPos || { x: 0, y: 0 }
    }

    update(): void {
        super.update()

        if(this.steps == 0 || this.direction == "none") {
            return
        } else {
            switch (this.direction) {
                case "up":
                    this.drawPos.y--
                break;
                case "right":
                    this.drawPos.x++
                break;
                case "down":
                    this.drawPos.y++
                break;
                case "left":
                    this.drawPos.x--
                break;
            }
                    
            this.steps--
            if(this.steps == 0) {
                this.direction = "none"
                this.gridPos = this.movingTo!
                this.movingTo = null
            }
        }
    }

    makeMove(to: GridDirs) {
        if(this.direction == "none" && this.steps == 0) {
            this.direction = to
            this.steps = 16
            switch(to) {
                case "up":
                    this.movingTo = { x: this.gridPos.x, y: this.gridPos.y - 1 }
                break;
                case "right":
                    this.movingTo = { x: this.gridPos.x + 1, y: this.gridPos.y }
                break;
                case "down":
                    this.movingTo = { x: this.gridPos.x, y: this.gridPos.y + 1 }
                break;
                case "left":
                    this.movingTo = { x: this.gridPos.x - 1, y: this.gridPos.y }
                break;
            }
        }
    }
}


export class MovableObjectFree extends GameObject {
    moving: boolean = false
    speed: number
    direction = { x: 0, y: 0 }
    targetPos: Coord | null = null

    constructor(config: GameObjectConfig & { speed: number }) {
        super(config)
        this.speed = config.speed
    }

    update() {
        super.update()
        
        if(this.moving) {
            let dx = this.direction.x * this.speed
            let dy = this.direction.y * this.speed

            this.drawPos.x += dx
            this.drawPos.y += dy

            if(utils.getDistance(this.drawPos, this.targetPos!) < 5) {
                this.stop()
            }
        }
    }

    moveTowards(to: Coord, on: "grid" | "free" = "free") {
        if(on == "grid") {
            to = utils.GridToDraw(to)
        }
        this.direction = utils.getUnitVector(this.drawPos, to)
        this.moving = true
        this.targetPos = to
    }

    stop() {
        this.moving = false
        this.targetPos = null
        this.direction = { x: 0, y: 0 }
        this.drawPos = {
            x: Math.round(this.drawPos.x),
            y: Math.round(this.drawPos.y)
        }
    }
}