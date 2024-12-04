// very small and universal definitions are kept in a seperate file

export interface Coord {
    x: number,
    y: number
}

export interface AnimFrame {
    frame: Coord,
    duration?: number
}