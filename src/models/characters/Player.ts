import { GridDirs, Puppet, PuppetCommand } from "../core/misc.js";
import { utils } from "../core/utils.js";
import { Person, PersonConfig } from "./people/Person.js";

export interface PlayerConfig extends PersonConfig {

}

export class Player extends Person implements Puppet {
    facing: GridDirs = 'down'
    beingControlled: boolean = false

    constructor(config: PlayerConfig) {
        config.spriteConfig.animations = {
            "idle-down": [
                { frame: { x: 0, y: 0 } }
            ],
            "idle-left": [
                { frame: { x: 0, y: 2 } }
            ],
            "idle-up": [
                { frame: { x: 0, y: 1 } }
            ],
            "idle-right": [
                { frame: { x: 0, y: 3 } }
            ],
            "walk-down": [
                { frame: { x: 0, y: 0 } },
                { frame: { x: 2, y: 0 } },
                { frame: { x: 0, y: 0 } },
                { frame: { x: 3, y: 0 } },
            ],
            "walk-left": [
                { frame: { x: 0, y: 2 } },
                { frame: { x: 2, y: 2 } },
                { frame: { x: 0, y: 2 } },
                { frame: { x: 3, y: 2 } },

            ],
            "walk-up": [
                { frame: { x: 0, y: 1 } },
                { frame: { x: 2, y: 1 } },
                { frame: { x: 0, y: 1 } },
                { frame: { x: 3, y: 1 } },
            ],
            "walk-right": [
                { frame: { x: 0, y: 3 } },
                { frame: { x: 2, y: 3 } },
                { frame: { x: 0, y: 3 } },
                { frame: { x: 3, y: 3 } },

            ],
            "bob-down": [
                { frame: { x: 0, y: 0 }, duration: 32 },
                { frame: { x: 1, y: 0 }, duration: 32 },
            ],
            "bob-left": [
                { frame: { x: 0, y: 2 }, duration: 32 },
                { frame: { x: 1, y: 2 }, duration: 32 },
            ],
            "bob-up": [
                { frame: { x: 0, y: 1 }, duration: 32 },
                { frame: { x: 1, y: 1 }, duration: 32 },
            ],
            "bob-right": [
                { frame: { x: 0, y: 3 }, duration: 32 },
                { frame: { x: 1, y: 3 }, duration: 32 },
            ],
        }
        config.spriteConfig.cropSize = { width: 48, height: 48 }
        config.spriteConfig.drawSize = { width: 48, height: 48 }
        config.spriteConfig.drawOffset = { x: -16, y: -20 }

        super(config)
    }

    async startBehavior(command: PuppetCommand): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if(this.beingControlled) {
                reject()
                return
            }
            switch (command.action) {
                case "walk":
                    const next = utils.getNextCoord(this.gridPos, command.direction)
                    if(this.scene.isSpaceValid(next)) {
                        await this.startWalk(command.direction)
                        resolve()
                    } else {
                        reject()
                    }
                break
            
                case "stand":
                    await this.startStand(command.direction, command.duration!)
                    resolve()
                break
            }
        })
    }

    startWalk(dir: GridDirs): Promise<void> {
        return new Promise<void>((res) => {
            this.facing = dir
            this.makeMove(dir, res)
        })
    }

    startStand(dir: GridDirs, duration: number): Promise<void> {
        return new Promise<void>(async res => {
            this.facing = dir
            await this.scene.time.delay(duration)
            res()
        })
    }

    startInteraction(): Promise<void> {
        return new Promise<void>((res) => {

        })
    }

    makeMove(to: GridDirs, resolve?: () => void): void {
        super.makeMove(to, resolve)
        this.sprite.currentAnimation = `walk-${to}`
    }

    stop() {
        super.stop()
        setTimeout(() => {
            !this.movingTo && (this.sprite.currentAnimation = `idle-${this.facing}`)
        }, 10);
    }
}