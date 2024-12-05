// very small and universal definitions are kept in a seperate file

export interface Coord {
    x: number
    y: number
}

export interface AnimFrame {
    frame: Coord 
    duration?: number
}

export const CROP_SIZE = 16

export const DRAW_SIZE = 16

export const DEFAULT_ANIM_DURATION = 8