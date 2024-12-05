import { Coord } from "./models/basic/misc.js";

export const utils = {
    getUnitVector(from: Coord, to: Coord): Coord {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        const magnitude = Math.sqrt(dx * dx + dy * dy);

        if (magnitude < 5) {
            return { x: 0, y: 0 }; // Return a zero vector for target is too close
        }

        const x = dx / magnitude;
        const y = dy / magnitude;

        return { x, y };
    },

    getDistance(from: Coord, to: Coord): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
}


export const time = {
    async delay(seconds: number): Promise<void> {
        if(seconds < 0) throw new Error("negative delay demanded")
    
        return new Promise<void>((resolve) => {
            setTimeout(resolve, seconds * 1000)
        })
    }
}