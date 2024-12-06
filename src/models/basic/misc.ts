// very small and universal definitions are kept in a seperate file


/**
 * Used to represent a position on the canvas or in the grid.
 * It ressembles several other objects throughout the code 
 * but should not be used interchangably
*/
export interface Coord {
    x: number
    y: number
}


/**
 * Represents one frame in an animation.
 * The parameters crop size and draw size are maintained in the 
 * Sprite class, not here
 * 
 * @param frame represents the location of corresponding sprite
 * in the spritesheet
 * 
 * @param duration mentions how many updates this frame will last
 */
export interface AnimFrame {
    frame: Coord 
    offset?: Coord
    duration?: number
}


/** Default assumed size of each sprite in any spritesheet, there will be several exceptions */
export const CROP_SIZE = 16

/** The default size at which a sprite is to be drawn on the canvas, usually matches the crop size*/
export const DRAW_SIZE = 16

/** The duration for frames for whome duration is not mentioned */
export const DEFAULT_ANIM_DURATION = 8