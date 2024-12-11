import { Coord, FreeCollider } from "./misc.js";
import { MovableObjectFree } from "./MovableObject.js";

/**
 * contains utility functions for use throughout
 * the program
 */
export const utils = {
    /** @return the unit direction from "from" to "to" */
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

    /** Converts a grid based coord to a free coord */
    GridToDraw(coord: Coord): Coord {
        return { x: coord.x * 16, y: coord.y * 16 }
    },
    
    /** Converts a free coord to a grid based coord */
    DrawToGrid(coord: Coord): Coord {
        return { x: Math.floor(coord.x / 16), y: Math.floor(coord.y / 16) }
    },

    /** @returns the euclidean distance between two coords */
    getDistance(from: Coord, to: Coord): number {
        const dx = to.x - from.x;
        const dy = to.y - from.y;

        return Math.sqrt(dx * dx + dy * dy);
    },

    checkCollision(
        object1: FreeCollider,
        object2: FreeCollider,
    ): boolean {
        let dist = this.getDistance(object1.drawPos, object2.drawPos)

        return dist <= (object1.radius + object2.radius)
    }
}