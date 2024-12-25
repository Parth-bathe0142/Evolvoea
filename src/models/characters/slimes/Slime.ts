import { Arena } from "../../../battle/Arena.js";
import { GameObjectConfig } from "../../core/GameObject.js";
import { MovableObjectFree } from "../../core/MovableObject.js";
import { SpriteConfig } from "../../core/Sprite.js";
import { Attack, FreeCollider } from "../../core/misc.js";

export interface SlimeConfig extends Omit<GameObjectConfig, "spriteConfig"> {
    radius?: number
    type: string
    maxHealth: number
    health?: number
    damage: number
    attackSpeed: number
    speed: number
    arena: Arena
    team: 1 | 2
    spriteConfig?: SpriteConfig
}

/**
 * A generic abstract slime that makes no decisions.
 * Only a base for proper slimes. These are meant to 
 * be on the battleground with free movement. NPCs on
 * the grid can be made with the Person class
 */
export abstract class Slime extends MovableObjectFree implements FreeCollider {
    static decisionRate = 15 // makes a decision once every x updates

    radius: number = 16
    type: string
    maxHealth: number // the whole health
    health: number // the current health
    damage: number
    attackSpeed: number
    speed: number
    arena: Arena

    targetEnemy: Slime | null = null
    currentAction: "idle" | "attack" | "flee" | "chase" = "idle"
    team: 1 | 2
    isAlive: boolean = true
    private tick: number = 0

    // does not come from config, any subclass with implemented behavior will set it to true
    // used to play post death animations or effects
    actingAfterDeath: boolean = false

    constructor(config: SlimeConfig) {
        config.spriteConfig = {
            src: "assets/spritesheets/slimes/all_slime_sprites.png",
            drawOffset: { x: 34, y: 42},
            cropSize: { width: 80, height: 72 },
            drawSize: { width: 80, height: 72 },
            isAnimated: true,
            animations: {
                "idle1": [
                    { frame: { x: 0, y: 0 } },
                    { frame: { x: 1, y: 0 } }
                ]
            },
            currentAnim: "idle1"
        }
        super(config as SlimeConfig & { spriteConfig: SlimeConfig})

        this.radius = config.radius ?? this.radius
        this.type = config.type
        this.maxHealth = config.maxHealth
        this.health = config.health ?? config.maxHealth
        this.damage = config.damage
        this.attackSpeed = config.attackSpeed
        this.speed = config.speed
        this.arena = config.arena
        this.team = config.team
    }

    abstract decision(): void
    abstract attack(): void

    update() {
        if(!this.isAlive) {
            if(!this.actingAfterDeath) {
                return
            }
        }

        super.update()

        if(this.health <= 0) {
            this.death()
            return
        }

        this.tick++
        if(this.tick >= Slime.decisionRate) {
            this.tick = 0
            this.decision()
        }
    }

    takeDamage(attack: Attack) {
        this.health -= attack.damage;
        if(this.health <= 0)
            this.death();
    }

    death() {
        this.isAlive = false
    }
}