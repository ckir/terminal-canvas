"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
test('resize up', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(1, 1);
    buf1.resize(2, 2);
    expect(buf1.grid.length).toBe(2);
    expect(buf1.grid[0].length).toBe(2);
});
test('resize down', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(2, 2);
    buf1.resize(1, 1);
    expect(buf1.grid.length).toBe(1);
    expect(buf1.grid[0].length).toBe(1);
});
test('clear', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(1, 1);
    buf1.nullFillCharacter = '.';
    buf1.clear(c1);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][0].text).toBe('.');
});
test('write: simple', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(4, 1);
    buf1.write(0, 0, '中1', c1);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][0].text).toBe('中');
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][2].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][2].text).toBe('1');
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('write: clip on head', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(4, 1);
    buf1.nullFillCharacter = '.';
    buf1.write(0, 0, '中1', c1, 1);
    expect(buf1.grid[0][0].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
    expect(buf1.grid[0][0].text).toBe('.');
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][1].text).toBe('.');
    expect(buf1.grid[0][2].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][2].text).toBe('1');
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('write: clip on end', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(4, 1);
    buf1.nullFillCharacter = '.';
    buf1.write(0, 0, '1中', c1, undefined, 2);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][0].text).toBe('1');
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][1].text).toBe('.');
    expect(buf1.grid[0][2].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('fill: horizontal', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(4, 2);
    buf1.fill(0, 0, 2, 2, '', c1);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][2].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('fill: vertical', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(2, 4);
    buf1.fill(0, 0, 2, 2, '', c1);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[1][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[2][0].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
    expect(buf1.grid[3][0].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('fill: double width on edge', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const buf1 = new __1.TerminalBuffer(4, 2);
    buf1.nullFillCharacter = '.';
    buf1.fill(0, 0, 2, 3, '中', c1);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][0].text).toBe('中');
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][2].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][2].text).toBe('.');
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('draw: horizontal', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const c2 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.red
    });
    const buf1 = new __1.TerminalBuffer(4, 2);
    buf1.fill(0, 0, 2, 2, '', c1);
    const buf2 = new __1.TerminalBuffer(2, 2);
    buf2.fill(0, 0, 2, 2, '', c2);
    buf1.draw(buf2, 0, 0, 0, 1, 2, 2);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.red);
    expect(buf1.grid[0][2].attributes.colorBackground).toBe(__1.Color.red);
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('draw: horizontal with double width - text overlap', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const c2 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.red
    });
    const buf1 = new __1.TerminalBuffer(4, 2);
    buf1.fill(0, 0, 2, 2, '中', c1);
    const buf2 = new __1.TerminalBuffer(2, 2);
    buf2.fill(0, 0, 2, 2, '中', c2);
    buf1.draw(buf2, 0, 0, 0, 1, 2, 2);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[0][0].text).toBe('');
    expect(buf1.grid[0][1].attributes.colorBackground).toBe(__1.Color.red);
    expect(buf1.grid[0][1].text).toBe('中');
    expect(buf1.grid[0][2].attributes.colorBackground).toBe(__1.Color.red);
    expect(buf1.grid[0][3].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
test('draw: vertical', () => {
    const c1 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.blue
    });
    const c2 = __1.Attribute.from({
        colorBackgroundMode: __1.ColorMode.Palette,
        colorBackground: __1.Color.red
    });
    const buf1 = new __1.TerminalBuffer(2, 4);
    buf1.fill(0, 0, 2, 2, '', c1);
    const buf2 = new __1.TerminalBuffer(2, 2);
    buf2.fill(0, 0, 2, 2, '', c2);
    buf1.draw(buf2, 0, 0, 1, 0, 2, 2);
    expect(buf1.grid[0][0].attributes.colorBackground).toBe(__1.Color.blue);
    expect(buf1.grid[1][0].attributes.colorBackground).toBe(__1.Color.red);
    expect(buf1.grid[2][0].attributes.colorBackground).toBe(__1.Color.red);
    expect(buf1.grid[3][0].attributes.colorBackgroundMode).toBe(__1.ColorMode.Default);
});
//# sourceMappingURL=terminalBuffer.test.js.map