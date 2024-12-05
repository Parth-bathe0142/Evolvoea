import { GameObjectConfig } from "../../basic/GameObject.js";
import { MovableObjectGrid } from "../../basic/MovableObject.js";

export interface PersonConfig extends GameObjectConfig {
    name: string
}

export class Person extends MovableObjectGrid {
    static instances: {[key: string]: PersonConfig} = {
        "person1": {
            name: "person1",
            spriteConfig: {
                src: "assets/spritesheets/character.png"
            }
        }
    }

    static getPerson(name: string): Person | null {
        let config = this.instances[name]
        return config ? new Person(config) : null
    }

    name: string

    constructor(config: PersonConfig) {
        super(config)

        this.name = config.name
    }

    update() {
        super.update()
    }
}