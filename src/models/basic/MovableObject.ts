import utils from "../../utils.js";
import { GameObject, GameObjectConfig } from "./GameObject.js";
import { Coord } from "./misc.js";

type GridDirs = "up" | "right" | "down" | "left" | "none"

export class MovableObjectGrid extends GameObject {    
    steps = 0
    direction: GridDirs = "none"
    movingTo: Coord | null = null

    constructor(config: GameObjectConfig) {
        super(config)
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
    movementSpeed: number
    direction = { x: 0, y: 0 }
    target: Coord | null = null

    constructor(config: GameObjectConfig & { movementSpeed: number }) {
        super(config)
        this.movementSpeed = config.movementSpeed
    }

    update(): void {
        super.update()
        
        if(this.moving) {
            let dx = this.direction.x * this.movementSpeed
            let dy = this.direction.y * this.movementSpeed

            this.drawPos.x += dx
            this.drawPos.y += dy
        }
    }

    moveTowards(to: Coord) {
        this.direction = utils.getUnitVector(this.drawPos, to)
        this.moving = true
        this.target = to
    }
}