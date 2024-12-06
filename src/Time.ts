/**
 * The class that manages all time related tasks in the game.
 */
export class Time {
    private timeStep = 1000 / 60;    // duration of one frame in milliseconds
    private now = 0;                 // current time
    private passed = 0;              // time since last frame
    private initialised = false;     // has the loop started? one time can only be initialised once

    private _currentFrame = 0;       // sort of frame count 
    FPS = 60;                        // FPS

    get currentFrame() {             // can be used for scheduling tasks
        return this._currentFrame
    }
    
    constructor(fps: number = 60) {
        this.setFPS(fps);
    }

    /** Changes the speed of this time */
    setFPS(fps: number) {
        if (fps > 100 || fps < 1) {
            throw new Error("FPS out of bounds");
        }

        this.FPS = fps;
        this.timeStep = 1000 / fps;
    }

    /** 
     * The method that starts a time loop, it can only be called once on one time.
     * Takes one or two callbacks, allowing optional seperation of update and render.
     * @returns An object that can pause or resume the loop
     * If an attempt is made to call it more than once, it returns nothing and logs
     * a warnig to the console
     */
    runLoop(update: (time: this) => void, render?: (time: this) => void)
      : { pause: () => void, play: () => void } | undefined
    {
        if(this.initialised) {
            console.warn("attempt at running multiple time loops on the same timeline")
            return
        }
        this._currentFrame = 0
        this.now = performance.now();
        let paused = false;

        // the internal loop function
        const play = (timestamp: number) => {
            if (!paused) {
                const deltaTime = timestamp - this.now;
                this.now = timestamp;

                this.passed += deltaTime;
                while (this.passed > this.timeStep) {
                    this.passed -= this.timeStep;
                    this._currentFrame++;
                    update(this);
                    render && render(this);
                }
                requestAnimationFrame(play);
            }
        };
        requestAnimationFrame(play);

        return {
            pause: () => { paused = true },

            play: () => {
                paused = false;
                this.now = performance.now();
                play(0);
            },
        };
    }

    /** 
     * Resets the frame count back to 0. Very risky
     * Should only be used when changing scenes and when it is known
     * that no delays are set as they will be missed and start their own 
     * RAF loops causing severe performance issues
     */
    rewind() {
        this._currentFrame = 0
    }

    /**
     * Creates a promise that resolves after X frames
     * @issue if the game is paused, all delays will start
     * RAF loops and cause performance issues
     * @todo Implement event handling to to fix issue
     */
    async delay(frames: number): Promise<void> {
        if (frames < 0) throw new Error("negative delay demanded");
        const targetFrame = this._currentFrame + frames;
        return new Promise<void>((resolve) => {
            const check = () => {
                if (this._currentFrame >= targetFrame) {
                    return resolve();
                }
                requestAnimationFrame(check);
            };
            setTimeout(() => requestAnimationFrame(check), (frames - 2) * this.timeStep);
        });
    }

    /** mini unit test */
    static async Test() {
        const update = (t: Time) => console.log(`frame: ${t._currentFrame}`)
        const render = () => {}

        const time = new Time(2)
        const delayer = new Time(2)
        const { pause, play } = time.runLoop(update)!
        delayer.runLoop(render)

        await delayer.delay(10)

        console.log("delay started")
        pause()

        await delayer.delay(5)

        console.log("delay ended")
        play()
    }
}
