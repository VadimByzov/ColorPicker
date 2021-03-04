var colorBlock = document.getElementById('color-block');
var contextBlock = colorBlock.getContext('2d');
var wBlock = colorBlock.width;
var hBlock = colorBlock.height;
var colorStrip = document.getElementById('color-strip');
var contextStrip = colorStrip.getContext('2d');
var wStrip = colorStrip.width;
var hStrip = colorStrip.height;
var colorLabel = document.getElementById('color-label');
var hex = document.getElementById('hex');
var red = document.getElementById('red');
var green = document.getElementById('green');
var blue = document.getElementById('blue');
var hue = document.getElementById('hue');
var sat = document.getElementById('sat');
var val = document.getElementById('val');
var grid = document.getElementById('grid');
var save = document.getElementById('save');
var clear = document.getElementById('clear');
var apply = document.getElementById('apply');
var x = 0;
var y = 0;
var drag = false;
var rgbaColor = 'rgba(255,0,0,1)';
var myStorage = localStorage;
var len;
if (myStorage.getItem("len") !== null) {
    len = Number(myStorage.getItem("len"));
}
else {
    len = 0;
    myStorage.setItem("len", String(len));
}
var loadColor = function () {
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    var i = 0;
    while (i < len) {
        var div = document.createElement("div");
        var color = myStorage.getItem(String(i));
        div.innerHTML = "<label>" + myStorage.getItem(String(i)) + "</label>";
        div.style.backgroundColor = '#' + color;
        grid.appendChild(div);
        i++;
    }
};
loadColor();
var saveColor = function (e) {
    var color = hex.value;
    if (color == "") {
        return;
    }
    if (myStorage.getItem(color) == null && len < 12) {
        myStorage.setItem(String(len), color);
        len++;
        myStorage.setItem("len", String(len));
        loadColor();
    }
};
var clearStorage = function () {
    var i = 0;
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
};
var setRgb = function (rgb) {
    red.value = String(rgb[0]);
    green.value = String(rgb[1]);
    blue.value = String(rgb[2]);
};
var setHsv = function (rgb) {
    var hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    hue.value = String(Math.round(hsv[0] * 100));
    sat.value = String(Math.round(hsv[1] * 100));
    val.value = String(Math.round(hsv[2] * 100));
};
var applyColor = function () {
    var color = hex.value;
    var rgb = hexToRgb(color);
    setRgb(rgb);
    setHsv(rgb);
    rgbaColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',1)';
    colorLabel.style.backgroundColor = rgbaColor;
    fillGradient();
};
var fillGradient = function () {
    contextBlock.fillStyle = rgbaColor;
    contextBlock.fillRect(0, 0, wBlock, hBlock);
    var gradientWhite = contextStrip.createLinearGradient(0, 0, wBlock, 0);
    gradientWhite.addColorStop(0, 'rgba(255,255,255,1)');
    gradientWhite.addColorStop(1, 'rgba(255,255,255,0)');
    contextBlock.fillStyle = gradientWhite;
    contextBlock.fillRect(0, 0, wBlock, hBlock);
    var gradientBlack = contextStrip.createLinearGradient(0, 0, 0, hBlock);
    gradientBlack.addColorStop(0, 'rgba(0,0,0,0)');
    gradientBlack.addColorStop(1, 'rgba(0,0,0,1)');
    contextBlock.fillStyle = gradientBlack;
    contextBlock.fillRect(0, 0, wBlock, hBlock);
};
contextBlock.rect(0, 0, wBlock, hBlock);
fillGradient();
contextStrip.rect(0, 0, wStrip, hStrip);
var grd1 = contextStrip.createLinearGradient(0, 0, 0, hBlock);
grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
contextStrip.fillStyle = grd1;
contextStrip.fill();
var click = function (e) {
    x = e.offsetX;
    y = e.offsetY;
    var imageData = contextStrip.getImageData(x, y, 1, 1).data;
    rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    fillGradient();
};
var mousedown = function (e) {
    drag = true;
    changeColor(e);
};
var mousemove = function (e) {
    if (drag) {
        changeColor(e);
    }
};
var mouseup = function (e) {
    drag = false;
};
var changeColor = function (e) {
    x = e.offsetX;
    y = e.offsetY;
    var imageData = contextBlock.getImageData(x, y, 1, 1).data;
    hex.value = rgbToHex(imageData[0], imageData[1], imageData[2]);
    setRgb([imageData[0], imageData[1], imageData[2]]);
    setHsv([imageData[0], imageData[1], imageData[2]]);
    rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    colorLabel.style.backgroundColor = rgbaColor;
};
var hexToRgb = function (color) {
    var r = parseInt(color.substring(0, 2), 16);
    var g = parseInt(color.substring(2, 4), 16);
    var b = parseInt(color.substring(4, 6), 16);
    return [r, g, b];
};
var rgbToHex = function (red, green, blue) {
    var r = red.toString(16);
    var g = green.toString(16);
    var b = blue.toString(16);
    if (r.length == 1)
        r = '0' + r;
    if (g.length == 1)
        g = '0' + g;
    if (b.length == 1)
        b = '0' + b;
    return (r + g + b).toUpperCase();
};
function rgbToHsv(r, g, b) {
    var min = Math.min(r, g, b);
    var v = Math.max(r, g, b);
    if (v == 0) { // black
        return [0, 0, 0];
    }
    var delta = v - min;
    var s = delta / v;
    if (s == 0) { // grey
        return [0, s, v / 255];
    }
    var h = 0;
    if (r == v) { // yellow to magenta
        h = (g - b) / delta;
    }
    else if (g == v) { // cyan to yellow
        h = 2 + (b - r) / delta;
    }
    else { // magenta to cyan
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
//# sourceMappingURL=main.js.map