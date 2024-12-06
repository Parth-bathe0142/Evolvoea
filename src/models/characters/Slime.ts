import { GameObjectConfig } from "../basic/GameObject";
import { MovableObjectFree } from "../basic/MovableObject";

export interface SlimeConfig extends GameObjectConfig {
    type: string
    maxHealth: number
    health?: number
    damage: number
    speed: number
}

export abstract class Slime extends MovableObjectFree {
    type: string
    maxHealth: number
    health: number
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

    abstract decision(): void;
}