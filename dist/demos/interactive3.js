"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const terminal_1 = require("../terminal");
if (!process.stdout.isTTY) {
    throw new Error('Not tty');
}
const keyboard = new EventEmitter();
const tty = process.stdout;
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf-8');
process.stdout.on('finish', () => {
    process.exit(0);
});
process.on('SIGINT', () => {
    process.stdout.write('\r\n');
    process.stdout.end();
});
process.on('SIGTERM', () => {
    process.stdout.write('\r\n');
    process.stdout.end();
});
let part = '';
let unfinished = false;
function checkUnfinished() {
    if (part.match(/^\x1b\[(?:\d+(?:;|\d+)+|\d+|)[^\d]$/)) {
        keyboard.emit('key', part);
        part = '';
        unfinished = false;
    }
}
process.stdin.on('data', (key) => {
    const CTRL_C = '\x03';
    const keys = [...key];
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (k === CTRL_C) {
            process.emit('SIGINT', 'SIGINT');
        }
        else {
            if (unfinished) {
                part += k;
                checkUnfinished();
            }
            else {
                if (k === '\x1b') {
                    unfinished = true;
                    part += k;
                }
                else {
                    keyboard.emit('key', k);
                }
            }
        }
    }
});
const printer = new terminal_1.Printer(tty.columns, tty.rows);
const canvas = new terminal_1.TerminalBuffer(tty.columns, tty.rows - 4);
async function main() {
    let x = 0;
    let y = 0;
    let color = terminal_1.Color.red;
    let message = '';
    let down = false;
    function handler(key) {
        if (key === '\x1b[A') {
            y -= 1;
            message = `Up (${y})`;
            if (down) {
                canvas.fill(y, x, 1, 1, '', terminal_1.Attribute.from({
                    colorBackgroundMode: terminal_1.ColorMode.Palette,
                    colorBackground: color
                }));
            }
        }
        if (key === '\x1b[B') {
            y += 1;
            message = `Down (${y})`;
            if (down) {
                canvas.fill(y, x, 1, 1, '', terminal_1.Attribute.from({
                    colorBackgroundMode: terminal_1.ColorMode.Palette,
                    colorBackground: color
                }));
            }
        }
        if (key === '\x1b[D') {
            x -= 1;
            message = `Left (${x})`;
            if (down) {
                canvas.fill(y, x, 1, 1, '', terminal_1.Attribute.from({
                    colorBackgroundMode: terminal_1.ColorMode.Palette,
                    colorBackground: color
                }));
            }
        }
        if (key === '\x1b[C') {
            x += 1;
            message = `Right (${x})`;
            if (down) {
                canvas.fill(y, x, 1, 1, '', terminal_1.Attribute.from({
                    colorBackgroundMode: terminal_1.ColorMode.Palette,
                    colorBackground: color
                }));
            }
        }
        if (key === 'c' || key === 'C') {
            color = (color + 1) % 16;
            message = `Color (${terminal_1.Color[color]})`;
            if (down) {
                canvas.fill(y, x, 1, 1, '', terminal_1.Attribute.from({
                    colorBackgroundMode: terminal_1.ColorMode.Palette,
                    colorBackground: color
                }));
            }
        }
        if (key === 'r' || key === 'R') {
            printer.updateScreenFull();
            message = `Force refreshed`;
        }
        if (key === 'z' || key === 'Z') {
            down = !down;
            message = `Put the pen ${down ? 'down' : 'up'}`;
            if (down) {
                canvas.fill(y, x, 1, 1, '', terminal_1.Attribute.from({
                    colorBackgroundMode: terminal_1.ColorMode.Palette,
                    colorBackground: color
                }));
            }
        }
        paint();
    }
    keyboard.on('key', handler);
    function resizeHandler() {
        printer.resize(tty.columns, tty.rows);
        printer.updateScreenFull();
        paint();
    }
    tty.on('resize', resizeHandler);
    const title = 'Interactive 3';
    const titleWidth = terminal_1.TerminalBuffer.lengthOf(title);
    let index = 0;
    async function paint() {
        printer.clear();
        const titleColor = terminal_1.Attribute.from({
            colorBackgroundMode: terminal_1.ColorMode.Palette,
            colorBackground: terminal_1.Color.white,
            colorForegroundMode: terminal_1.ColorMode.Palette,
            colorForeground: terminal_1.Color.black
        });
        printer.fill(0, 0, 1, printer.width, ' ', titleColor);
        printer.write(0, ~~(printer.width / 2 - titleWidth / 2), title, titleColor);
        printer.draw(canvas, 0, 0, 1, 0, canvas.height, canvas.width);
        printer.write(y + 1, x, down ? '+' : '-', terminal_1.Attribute.from({
            colorBackgroundMode: terminal_1.ColorMode.Palette,
            colorBackground: color,
            colorForegroundMode: terminal_1.ColorMode.Palette,
            colorForeground: color === terminal_1.Color.black ? terminal_1.Color.white : terminal_1.Color.black
        }));
        printer.write(printer.height - 3, 0, 'Last message: ' + message, terminal_1.Attribute.DEFAULT);
        let offset = 0;
        offset += printer.write(printer.height - 2, offset, `[Z] pen down / pen up (${down ? 'down' : 'up'})  `, terminal_1.Attribute.DEFAULT);
        offset += printer.write(printer.height - 2, offset, '[C] change color  ', terminal_1.Attribute.DEFAULT);
        offset += printer.write(printer.height - 2, offset, '[R] force refresh  ', terminal_1.Attribute.DEFAULT);
        offset = 0;
        offset += printer.write(printer.height - 1, offset, '[Up/Down/Left/Right] Move  ', terminal_1.Attribute.DEFAULT);
        offset += printer.write(printer.height - 1, offset, '[Ctrl+C] Exit  ', terminal_1.Attribute.DEFAULT);
        await printer.updateScreen();
    }
    await printer.initScreen();
    await paint();
}
main();
//# sourceMappingURL=interactive3.js.map