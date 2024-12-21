import { Attack } from "../../core/misc.js";
import { utils } from "../../core/utils.js";
import { Slime, SlimeConfig } from "Slime.js";

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
        const enemyTeam = this.team == 1 ? this.arena.team2 : this.arena.team1
        let closest = enemyTeam[0]
        let distance = utils.getDistance(this.drawPos, closest.drawPos)

        enemyTeam.forEach(en => {
            let newDist = utils.getDistance(this.drawPos, en.drawPos)
            if(newDist < distance) {
                closest = en
                distance = newDist
            }
        })

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
        this.currentAction = "attack"
        while(true) {
            if(this.isAlive && this.currentAction == "attack" && this.targetEnemy?.isAlive) {
                this.targetEnemy.takeDamage({ type: "normal", damage: this.damage })
            }
            await this.arena.time.delay(this.attackSpeed)
        }
    }   
}