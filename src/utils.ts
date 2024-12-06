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

    GridToDraw(coord: Coord): Coord {
        return { x: coord.x * 16, y: coord.y * 16 }
    },
    
    DrawToGrid(coord: Coord): Coord {
        return { x: Math.floor(coord.x / 16), y: Math.floor(coord.y / 16) }
    },

    getDistance(from: Coord, to: Coord): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        return Math.sqrt(dx * dx + dy * dy);
    }
}