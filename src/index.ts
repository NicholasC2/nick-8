import { CPU } from "./CPU";
import fs from "fs";
import sdl from "@kmamal/sdl"

const cpu = new CPU(fs.readFileSync("./program.bin"))

const win = sdl.video.createWindow({
    title: "screen",
    width: 160,
    height: 160,
})

while(true) {
    win.render(CPU.SCREEN_WIDTH, CPU.SCREEN_HEIGHT, CPU.SCREEN_SIZE*3, "argb32")

    const result = cpu.step();

    if(result.halt) {
        process.exit(0);
    }

    if(result.no_program) {
        console.log("This program is empty...");
        process.exit(0);
    }
}