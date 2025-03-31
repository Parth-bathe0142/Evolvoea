type screens = "title-screen" | "replay-screen" | "game-screen" | ""

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

    goToGame() {
        this.loadHealthBar()
        this.goToScreen("game-screen")
    },

    loadHealthBar() {
        for (let i = 0; i < 5; i++) {  
            const image = new Image()
            image.src = "/assets/spritesheets/Egg_item.png"
            image.height = 32
            image.width = 32
            document.querySelector("#health-bar")
              ?.appendChild(image)
        }
    },

    removeHealth() {
        const bar = document.querySelector("#health-bar")!
        bar.lastChild && bar.removeChild(bar.lastChild)
        return bar.children.length
    },
    
    emptyHealth() {
        const bar = document.querySelector("#health-bar")!
        bar.innerHTML = ""
    },

    displayScore(score: number | string) {
        document.querySelector("#score")!.innerHTML = "" + score
    },

    gameOver() {
        document.querySelector("#replay-screen_title")!.innerHTML = "Game Over"
        this.goToScreen("replay-screen")
    },
    
    gameWon() {
        document.querySelector("#replay-screen_title")!.innerHTML = "Game Won"
        this.goToScreen("replay-screen")
    }
}

