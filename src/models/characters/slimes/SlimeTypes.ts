import { utils } from "../../core/utils.js";
import { BaseProjectileConfig } from "../../projectiles/BaseProjectile.js";
import { Slime, SlimeConfig } from "./Slime.js";

export interface MeleeSlimeConfig extends SlimeConfig {

}

export class MeleeSlime extends Slime {
    range: number = 16
    constructor(config: MeleeSlimeConfig) {
        super(config)
    }

    update() {
        super.update()
    }

    decision(): void {
        const enemyTeam = this.arena.getOtherTeam(this.team)
        let closest = enemyTeam[0]
        let distance = utils.getDistance(this.drawPos, closest.drawPos)

        enemyTeam.forEach(en => {
            let newDist = utils.getDistance(this.drawPos, en.drawPos)
            if(newDist < distance) {
                closest = en
                distance = newDist
            }
        })
        this.targetEnemy = closest

        if(distance < this.range) {
            if(this.moving) {
                this.stop()
            }

            if(this.currentAction == "attack") {

            } else {
                this.attack()
            }
        } else {
            this.currentAction = "chase"
            this.moveTowards(closest.drawPos)
        }
    }

    async attack(): Promise<void> {
        if(this.targetEnemy?.isAlive) {
            this.targetEnemy.takeDamage({ type: "normal", damage: this.damage })
        } else {
            this.currentAction = "idle"
        }
    }   
}

export interface RangedSlimeConfig extends SlimeConfig {
    range: number
    projectileConfig: BaseProjectileConfig
}

export class RangedSlime extends Slime {
    range: number
    projectileConfig: BaseProjectileConfig

    constructor(config: RangedSlimeConfig) {
        super(config)

        this.range = config.range
        this.projectileConfig = config.projectileConfig
    }

    update(): void {
        super.update()
    }

    decision(): void {
        const enemyTeam = this.arena.getOtherTeam(this.team)
        let closest = enemyTeam[0]
        let distance = utils.getDistance(this.drawPos, closest.drawPos)

        enemyTeam.forEach(en => {
            let newDist = utils.getDistance(this.drawPos, en.drawPos)
            if(newDist < distance) {
                closest = en
                distance = newDist
            }
        })
        this.targetEnemy = closest

        if(distance < this.range) {
            if(this.moving) {
                this.stop()
            }

            if(this.currentAction == "attack") {

            } else {
                this.attack()
            }
        } else {
            this.currentAction = "chase"
            this.moveTowards(closest.drawPos)
        }
    }

    async attack(): Promise<void> {
        if(this.targetEnemy?.isAlive) {
            this.targetEnemy.takeDamage({ type: "normal", damage: this.damage })
        } else {
            this.currentAction = "idle"
        }
    }
    
}