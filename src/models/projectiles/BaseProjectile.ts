import { Slime } from "../characters/slimes/Slime.js";
import { Attack, Coord, FreeCollider, PROJECTILE_RADIUS, teams } from "../core/misc.js";
import { MovableObjectFree, MovableObjectFreeConfig } from "../core/MovableObject.js";

export interface BaseProjectileConfig extends MovableObjectFreeConfig {
    source: Slime
    team: teams
    destination: Coord
    attack: Attack
}
export class BaseProjectile extends MovableObjectFree implements FreeCollider {
    source: Slime
    team: teams
    attack: Attack
    radius: number = PROJECTILE_RADIUS
    
    constructor(config: BaseProjectileConfig) {
        super(config)

        this.source = config.source
        this.team = config.team
        this.attack = config.attack

        this.init(config)
    }

    init(config: BaseProjectileConfig) {
        this.moveBeyond(config.destination)
    }

    destroy(): void {
        this.stop()
        super.destroy()
    }

    update(): void {
        super.update()
    }

    hitSlime(slime: Slime) {
        slime.takeDamage(this.attack)
        this.destroy()
        return true
    }
}