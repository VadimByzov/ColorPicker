let colorBlock: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('color-block');
let contextBlock: CanvasRenderingContext2D = <CanvasRenderingContext2D> colorBlock.getContext('2d');
let wBlock: number = colorBlock.width;
let hBlock: number = colorBlock.height;

let colorStrip: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('color-strip');
let contextStrip: CanvasRenderingContext2D = <CanvasRenderingContext2D> colorStrip.getContext('2d');
let wStrip: number = colorStrip.width;
let hStrip: number = colorStrip.height;

let colorLabel: HTMLLabelElement = <HTMLLabelElement> document.getElementById('color-label');

let hex: HTMLInputElement = <HTMLInputElement> document.getElementById('hex');

let red: HTMLInputElement  = <HTMLInputElement> document.getElementById('red');
let green: HTMLInputElement  = <HTMLInputElement> document.getElementById('green');
let blue: HTMLInputElement  = <HTMLInputElement> document.getElementById('blue');

let hue: HTMLInputElement  = <HTMLInputElement> document.getElementById('hue');
let sat: HTMLInputElement  = <HTMLInputElement> document.getElementById('sat');
let val: HTMLInputElement  = <HTMLInputElement> document.getElementById('val');

let grid: HTMLElement = <HTMLElement> document.getElementById('grid');

let save: HTMLButtonElement = <HTMLButtonElement> document.getElementById('save');
let clear: HTMLButtonElement = <HTMLButtonElement> document.getElementById('clear');
let apply: HTMLButtonElement = <HTMLButtonElement> document.getElementById('apply');

let x: number = 0;
let y: number = 0;
let drag: boolean = false;
let rgbaColor: string = 'rgba(255,0,0,1)';

let myStorage: Storage = localStorage
let len: number;

if (myStorage.getItem("len") !== null) {
    len = Number(myStorage.getItem("len"));
}
else {
    len = 0;
    myStorage.setItem("len", String(len));
}

const loadColor = () : void => {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    let i = 0;
    while (i < len) {
        let div = document.createElement("div");
        let color: string = myStorage.getItem(String(i));
        div.innerHTML = `<label>${myStorage.getItem(String(i))}</label>`;
        div.style.backgroundColor = '#' + color;
        grid.appendChild(div);
        i++;
    }
}
loadColor();

const saveColor = (e) : void => {
    let color = hex.value;
    if (color == "") {
        return;
    }
    if (myStorage.getItem(color) == null && len < 12) {
        myStorage.setItem(String(len), color);
        len++;
        myStorage.setItem("len", String(len));
        loadColor();
    }
}

const clearStorage = () : void => {
    let i = 0;
    while (i < len) {
        myStorage.removeItem(String(i));
        i++;
    }
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    len = 0;
    myStorage.setItem("len", String(len));
    loadColor();
}

const setRgb = (rgb: [number, number, number]) : void => {
    red.value = String(rgb[0]);
    green.value = String(rgb[1]);
    blue.value = String(rgb[2]);
}

const setHsv = (rgb: [number, number, number]) : void => {
    let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    hue.value = String(Math.round(hsv[0] * 100));
    sat.value = String(Math.round(hsv[1] * 100));
    val.value = String(Math.round(hsv[2] * 100));
}

const applyColor = () : void => {
    let color = hex.value;
    let rgb = hexToRgb(color);

    setRgb(rgb);
    setHsv(rgb);

    rgbaColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',1)';
    colorLabel.style.backgroundColor = rgbaColor;
    fillGradient();
}

const fillGradient = () : void => {
    contextBlock.fillStyle = rgbaColor;
    contextBlock.fillRect(0, 0, wBlock, hBlock);

    let gradientWhite: CanvasGradient = contextStrip.createLinearGradient(0, 0, wBlock, 0);
    gradientWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
    contextBlock.fillStyle = gradientWhite;
    contextBlock.fillRect(0, 0, wBlock, hBlock);

    let gradientBlack: CanvasGradient = contextStrip.createLinearGradient(0, 0, 0, hBlock);
    gradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradientBlack.addColorStop(1, 'rgba(0,0,0,1)');
    contextBlock.fillStyle = gradientBlack;
    contextBlock.fillRect(0, 0, wBlock, hBlock);
}

contextBlock.rect(0, 0, wBlock, hBlock);
fillGradient();

contextStrip.rect(0, 0, wStrip, hStrip);
let grd1 = contextStrip.createLinearGradient(0, 0, 0, hBlock);
grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
contextStrip.fillStyle = grd1;
contextStrip.fill();

const click = (e) : void => {
    x = e.offsetX;
    y = e.offsetY;
    let imageData = contextStrip.getImageData(x, y, 1, 1).data;
    rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    fillGradient();
}

const mousedown = (e) : void => {
    drag = true;
    changeColor(e);
}

const mousemove = (e) : void => {
    if (drag) {
        changeColor(e);
    }
}

const mouseup = (e) : void => {
    drag = false;
}

const changeColor = (e) : void => {
    x = e.offsetX;
    y = e.offsetY;
    let imageData = contextBlock.getImageData(x, y, 1, 1).data;

    hex.value = rgbToHex(imageData[0], imageData[1], imageData[2]);

    setRgb([imageData[0], imageData[1], imageData[2]]);
    setHsv([imageData[0], imageData[1], imageData[2]]);

    rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    colorLabel.style.backgroundColor = rgbaColor;
}

const hexToRgb = (color: string) : [number, number, number] =>{
    let r = parseInt(color.substring(0,2),16);
    let g = parseInt(color.substring(2,4),16);
    let b = parseInt(color.substring(4,6),16);
    return [r, g, b];
}

const rgbToHex = (red: number, green: number, blue: number) : string => {
    let r = red.toString(16);
    let g = green.toString(16);
    let b = blue.toString(16);

    if (r.length == 1) r = '0' + r
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return (r + g + b).toUpperCase();
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
    let min: number = Math.min(r, g, b);
    let v: number = Math.max(r, g, b);
    
    if (v == 0) { // black
        return [0, 0, 0];
    }

    let delta: number = v - min;
    let s: number = delta / v;
    if (s == 0) {  // grey
        return [0, s, v / 255];
    }

    let h: number = 0;
    if (r == v) {  // yellow to magenta
        h = (g - b) / delta;
    }
    else if (g == v) {  // cyan to yellow
        h = 2 + (b - r) / delta;
    }
    else {  // magenta to cyan
        h = 4 + (r - g) / delta;
    }

    h /= 6;
    if (h < 0) {
        h += 1;
    }
    
    return [h, s, v / 255];
}

colorStrip.addEventListener("click", click);

colorBlock.addEventListener("mousedown", mousedown);
colorBlock.addEventListener("mouseup", mouseup);
colorBlock.addEventListener("mousemove", mousemove);

save.addEventListener("click", saveColor);
clear.addEventListener("click", clearStorage);
apply.addEventListener("click", applyColor);
