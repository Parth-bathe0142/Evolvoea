type screens = "title-screen" | "replay-screen" | ""

export const ui = {
    goToScreen(name: screens) {
        Array.from(document.getElementsByClassName("ui")).forEach(screen => {
            let element = screen as HTMLDivElement
            
            if(element.id == name) {
                element.style.display = "flex"
            } else {
                element.style.display = "none"
            }
        })
    },

    gameOver() {
        document.querySelector("#replay-screen-title")!.innerHTML = "Game Over"
        this.goToScreen("replay-screen")
    },
    
    gameWon() {
        document.querySelector("#replay-screen-title")!.innerHTML = "Game Won"

    }

}

