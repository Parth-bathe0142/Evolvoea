import { Slime, SlimeConfig } from "../models/characters/slimes/Slime.js";
import { MeleeSlime, MeleeSlimeConfig } from "../models/characters/slimes/SlimeTypes.js";
import { teams } from "../models/core/misc.js";
import { Time } from "../models/core/Time.js";
import { utils } from "../models/core/utils.js";
import { BaseProjectile } from "../models/projectiles/BaseProjectile.js";
import { Scene } from "../Scene/Scene.js";

interface ArenaConfig {
    scene: Scene
    backgroundsrc: string
    team1: ["melee" | "ranged", SlimeConfig][]
    team2: ["melee" | "ranged", SlimeConfig][]
}

export class Arena {
    background: HTMLImageElement
    scene: Scene

    time: Time
    team1: Slime[]
    team2: Slime[]
    dead: Slime[]
    projectiles: BaseProjectile[]

    isPaused: boolean = false
    isImageLoaded: boolean = false

    pause?: () => void
    play?: () => void
    resolve?: (val: teams) => void
    reject?: () => void

    constructor(config: ArenaConfig) {
        this.scene = config.scene

        this.background = new Image()
        
        this.team1 = []
        this.team2 = []
        this.dead = []
        this.projectiles = []
        
        this.time = new Time(48)
        this.load(config)
    }
    
    async load(config: ArenaConfig) {
        this.background.src = config.backgroundsrc
        this.background.onload = () => this.isImageLoaded = true
        
        config.team1.forEach(([type, conf]) => {
            switch(type) {
                case "melee":
                    this.team1.push(new MeleeSlime(conf as MeleeSlimeConfig))
                break
            }
        })

        config.team2.forEach(([type, conf]) => {
            switch(type) {
                case "melee":
                    this.team2.push(new MeleeSlime(conf as MeleeSlimeConfig))
                break
            }
        })
    }

    update = () => {
        this.updateProjectiles()
        
        this.team1.forEach(s => s.update())
        this.team2.forEach(s => s.update())
    }

    render = () => {
        const gamestate = {
            time: this.time
        }
        if(!this.isImageLoaded) {
            return
        }

        this.scene.ctx.drawImage(this.background, 0, 0);

        [...this.team1, ...this.team2, ...this.dead].forEach(slime => {
            slime.sprite.draw(this.scene.ctx, gamestate)
        })
    }

    async init() {
        const { pause, play } = this.time.runLoop(this.update, this.render)!
        this.pause = pause
        this.play = play

        return new Promise<teams>((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

    togglePause() {
        if (this.isPaused) {
            this.play?.()
            this.isPaused = false
        } else {
            this.pause?.()
            this.isPaused = true
        }
    }

    getOtherTeam(team: teams) {
        return team == "team1" ? this.team2 : this.team1
    }

    addProjectile(projectile: BaseProjectile) {
        this.projectiles.push(projectile)
    }

    updateProjectiles() {
        this.projectiles.forEach(proj => {
            const enemies = this.getOtherTeam(proj.team)

            enemies.forEach(en => {
                if(utils.checkCollision(proj, en)) {
                    const toBeRemoved = proj.hitSlime(en)
                    if(toBeRemoved) {
                        this.projectiles.splice(this.projectiles.indexOf(proj))
                    }
                }
            })
        })
    }

    slimeDeath(slimeTeam: teams, id: number | string) {
        let team;
        if(slimeTeam == "team1") {
            team = this.team1
        } else {
            team = this.team2
        }

        let index = team.findIndex(slime => slime.id == id)
        let slime = team.splice(index, 1)[0]
        this.dead.push(slime)

        if(team.length == 0) {
            this.endBattle(slimeTeam == "team1" ? "team2" : "team1")
        }
    }

    endBattle(team: teams) {
        this.resolve?.(team)
        this.pause?.()
    }
}