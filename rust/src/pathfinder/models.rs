#[derive(PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Hash, Debug)]
pub struct Coord {
    pub x: usize,
    pub y: usize
}
impl Coord {
    #[allow(unused)]
    fn distance_eu(&self, other: &Self) -> f32 {
        let dx = self.x as isize - other.x as isize;
        let dy = self.y as isize - other.y as isize;
        ((dx.pow(2) + dy.pow(2)) as f32).sqrt()
    }
    #[allow(unused)]
    fn distance_man(&self, other: &Self) -> usize {
        (self.x.abs_diff(other.x)) + (self.y.abs_diff(other.y))
    }
}

#[derive(PartialOrd, PartialEq)]
pub struct Tile {
    pub coord: Coord,
    pub cost: u8,
    pub heur: f32,
}
impl Eq for Tile {}
impl Ord for Tile {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        let f1 = self.cost as f32 + self.heur;
        let f2 = other.cost as f32 + other.heur;
        if f1 > f2 {
            std::cmp::Ordering::Less
        } else if f2 > f1 {
            std::cmp::Ordering::Greater
        } else {
            std::cmp::Ordering::Equal
        }
    }
}
impl Tile {
    /* pub fn new(coord: Coord) -> Self {
        Tile {
            coord,
            cost: 0,
            heur: 0.0
        }
    } */

    pub fn new_path(coord: Coord, cost: u8, end: Coord) -> Self {
        Tile {
            coord: coord.clone(),
            cost,
            heur: Coord::distance_eu(&coord, &end) as f32 * 10.0
        }
    }
}

pub enum Mode {
    Four, Eight
}