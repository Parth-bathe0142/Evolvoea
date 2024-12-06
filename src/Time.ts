
export class Time {
    FPS = 60;
    timeStep = 1000 / 60;

    now = 0;
    passed = 0;
    currentFrame = 0;

    constructor(fps: number = 60) {
        this.setFPS(fps);
    }

    setFPS(fps: number) {
        if (fps > 100 || fps < 1) {
            throw new Error("FPS out of bounds");
        }

        this.FPS = fps;
        this.timeStep = 1000 / fps;
    }

    runLoop(update: (time: Time) => void, render: () => void) {
        this.currentFrame = 0
        this.now = performance.now();
        
        let paused = false;
        const play = (timestamp: number) => {
            if (!paused) {
                const deltaTime = timestamp - this.now;
                this.now = timestamp;

                this.passed += deltaTime;
                while (this.passed > this.timeStep) {
                    this.passed -= this.timeStep;
                    this.currentFrame++;
                    update(this);
                    render();
                }
                requestAnimationFrame(play);
            }
        };
        requestAnimationFrame(play);

        return {
            pause: () => { paused = true; },

            play: () => {
                paused = false;
                this.now = performance.now();
                play(0);
            },
        };
    }

    async delay(frames: number): Promise<void> {
        if (frames < 0) throw new Error("negative delay demanded");
        const targetFrame = this.currentFrame + frames;
        return new Promise<void>((resolve) => {
            const check = () => {
                if (this.currentFrame >= targetFrame) {
                    return resolve();
                }
                requestAnimationFrame(check);
            };
            setTimeout(() => requestAnimationFrame(check), (frames - 2) * this.timeStep);
        });
    }


    static async Test() {
        const update = (t: Time) => console.log(`frame: ${t.currentFrame}`);
        const render = () => { };

        const time = new Time(2);
        const delayer = new Time(2);
        const { pause, play } = time.runLoop(update, render);

        await delayer.delay(10);

        console.log("delay started");

        await delayer.delay(5);

        console.log("delay ended");
    }
}
