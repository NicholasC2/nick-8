import { CPU } from "./CPU";
import fs from "fs";
import sdl from "@kmamal/sdl";

const cpu = new CPU(fs.readFileSync("./program.bin"));

const win = sdl.video.createWindow({
    title: "screen",
    width: 160,
    height: 160,
    resizable: true
});

const pixels = Buffer.alloc(CPU.SCREEN_SIZE * 3);

function render() {
    const screen = cpu.screen;

    for (let i = 0; i < screen.length; i++) {
        const offset = i * 3;

        switch (screen[i]) {
            case 1:
                pixels[offset] = 0;
                pixels[offset + 1] = 0;
                pixels[offset + 2] = 255;
                break;

            case 2:
                pixels[offset] = 0;
                pixels[offset + 1] = 255;
                pixels[offset + 2] = 0;
                break;

            case 3:
                pixels[offset] = 255;
                pixels[offset + 1] = 0;
                pixels[offset + 2] = 0;
                break;

            default:
                pixels[offset] = 0;
                pixels[offset + 1] = 0;
                pixels[offset + 2] = 0;
                break;
        }
    }

    win.render(
        CPU.SCREEN_WIDTH,
        CPU.SCREEN_HEIGHT,
        CPU.SCREEN_WIDTH * 3,
        "bgr24",
        pixels
    );
}

function tick() {
    for (let i = 0; i < 1000; i++) {
        const result = cpu.step();

        if (result.halt) {
            process.exit(0);
        }

        if (result.no_program) {
            console.log("This program is empty...");
            process.exit(0);
        }
    }

    render();
}

setInterval(tick, 16);