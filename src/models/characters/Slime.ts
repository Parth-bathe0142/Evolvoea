import { GameObjectConfig } from "../core/GameObject";
import { MovableObjectFree } from "../core/MovableObject";

export interface SlimeConfig extends GameObjectConfig {
    type: string
    maxHealth: number
    health?: number
    damage: number
    speed: number
}

/**
 * A generic abstract slime that makes no decisions.
 * Only a base for proper slimes. These are meant to 
 * be on the battleground with free movement. NPCs on
 * the grid can be made with the Person class
 */
export abstract class Slime extends MovableObjectFree {
    type: string
    maxHealth: number // the whole health
    health: number // the current health
    damage: number
    speed: number

    targetEnemy: Slime | null = null
    currentAction: "idle" | "attack" | "flee" | "" = "idle"

    constructor(config: SlimeConfig) {
        super(config)

        this.type = config.type
        this.maxHealth = config.maxHealth
        this.health = config.health || config.maxHealth
        this.damage = config.damage
        this.speed = config.speed
    }

    abstract decision(): void
    abstract attack(): void
    abstract takeDamage(): void
}