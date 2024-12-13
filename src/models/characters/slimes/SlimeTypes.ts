import { utils } from "../../core/utils.js";
import { Slime, SlimeConfig } from "../Slime.js";

export interface MeleeSlimeConfig extends SlimeConfig {

}

export class MeleeSlime extends Slime {
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
    }
    attack(): void {
        throw new Error("Method not implemented.");
    }
    takeDamage(): void {
        throw new Error("Method not implemented.");
    }
    
}