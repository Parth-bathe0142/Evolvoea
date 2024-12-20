import { Scene } from "../../../Scene/Scene.js";
import { MovableObjectGrid, MovableObjectGridConfig } from "../../core/MovableObject.js";

export interface PersonConfig extends MovableObjectGridConfig {
    name: string
    scene?: Scene
}

/**
 * Represents a generic entity that stays on the
 * grid and might move. Not really limited to people,
 * can be any npc on the map
 */
export class Person extends MovableObjectGrid {
    /** Some known entities for easy creation */
    static instances: {[key: string]: PersonConfig} = {
        "person1": {
            name: "person1",
            spriteConfig: {
                src: "assets/spritesheets/character.png"
            }
        }
    }
    /** Creates a known person */
    static getPerson(name: string): Person | null {
        let config = this.instances[name]
        return config ? new Person(config) : null
    }

    name: string
    scene: Scene

    constructor(config: PersonConfig) {
        super(config)

        this.name = config.name
        this.scene = config.scene!
    }

    /** Does nothing */
    update() {
        super.update()
    }
}