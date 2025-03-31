// Querying elements from the DOM
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const tilesetContainer = document.querySelector(".tileset-container") as HTMLElement;
const tilesetSelection = document.querySelector(".tileset-container_selection") as HTMLElement;
const tilesetImage = document.querySelector("#tileset-source") as HTMLImageElement;

let selection: [number, number] = [0, 0]; // Which tile we will paint from the menu

let isMouseDown = false;
let currentLayer = 0;

interface Layer {
   [key: string]: [number, number]; // Key is "x-y" and value is an array with [tileset_x, tileset_y]
}

let layers: Layer[] = [
   // Bottom layer
   {},
   // Middle layer
   {},
   // Top layer
   {}
];


function uploadSprite() {
   const input = document.querySelector("input#sprite") as HTMLInputElement;
   const file = input.files![0]
    
}

// Select tile from the Tiles grid
tilesetContainer.addEventListener("mousedown", (event: MouseEvent) => {
   selection = getCoords(event);
   tilesetSelection.style.left = `${selection[0] * 16}px`;
   tilesetSelection.style.top = `${selection[1] * 16}px`;
});

// Handler for placing new tiles on the map
function addTile(mouseEvent: MouseEvent) {
   const clicked = getCoords(mouseEvent);
   const key = `${clicked[0]}-${clicked[1]}`;

   if (mouseEvent.shiftKey) {
      delete layers[currentLayer][key];
   } else {
      layers[currentLayer][key] = [selection[0], selection[1]];
   }
   draw();
}

// Bind mouse events for painting (or removing) tiles on click/drag
canvas.addEventListener("mousedown", () => {
   isMouseDown = true;
});
canvas.addEventListener("mouseup", () => {
   isMouseDown = false;
});
canvas.addEventListener("mouseleave", () => {
   isMouseDown = false;
});
canvas.addEventListener("mousedown", addTile);
canvas.addEventListener("mousemove", (event: MouseEvent) => {
   if (isMouseDown) {
      addTile(event);
   }
});

// Utility for getting coordinates of mouse click
function getCoords(e: MouseEvent): [number, number] {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return [Math.floor(mouseX / 16), Math.floor(mouseY / 16)];
}


// Converts data to image:data string and pipes into new browser tab
function exportImage(): void {
   const data = canvas.toDataURL();
   const image = new Image();
   image.src = data;

   const w = window.open("");
   w?.document.write(image.outerHTML);
}

// Reset state to empty
function clearCanvas(): void {
   layers = [{}, {}, {}];
   draw();
}

// Set the active layer and update UI
function setLayer(newLayer: number): void {
   // Update the layer
   currentLayer = newLayer;

   // Update the UI to show the updated layer
   const oldActiveLayer = document.querySelector(".layer.active") as HTMLElement;
   if (oldActiveLayer) {
      oldActiveLayer.classList.remove("active");
   }
   const newLayerElement = document.querySelector(`[tile-layer="${currentLayer}"]`) as HTMLElement;
   newLayerElement?.classList.add("active");
}

// Draw the layers on the canvas
function draw(): void {
   const ctx = canvas.getContext("2d")!;
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   const size_of_crop = 16;

   layers.forEach((layer) => {
      Object.keys(layer).forEach((key) => {
         // Determine x/y position of this placement from key ("3-4" -> x=3, y=4)
         const [positionX, positionY] = key.split("-").map(Number);
         const [tilesheetX, tilesheetY] = layer[key];

         ctx.drawImage(
            tilesetImage,
            tilesheetX * 16,
            tilesheetY * 16,
            size_of_crop,
            size_of_crop,
            positionX * 16,
            positionY * 16,
            size_of_crop,
            size_of_crop
         );
      });
   });
}

tilesetImage.src = '/assets/tilesets/Grass.png';
