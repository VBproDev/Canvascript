var canvas = document.querySelector('.canvas');
var reset = document.querySelector('.reset');
var generate = document.querySelector('.generate');
var redo = document.querySelector('.redo');
var set = document.querySelector('.setBtn');
var ctx = canvas.getContext('2d');
var copy = document.querySelector('.copy');
var design = document.querySelector('.design');
var userDesign = document.querySelector('.user-design');
var save = document.querySelector('.save');
var localCanvas = localStorage.getItem('canvasArray');
var previewLineHandler = function (e) {
    clear();
    drawGrid();
    drawLines();
    previewLine(e);
};
var stroke = 1;
var color = '#000000';
var canvasWidth;
var canvasHeight;
var x;
var y;
var num = -1;
var canvasArray = [];
var warnedUser = false;
function previewLine(event) {
    var atX = event.offsetX;
    var atY = event.offsetY;
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = +stroke;
        ctx.moveTo(x, y);
        ctx.lineTo(atX, atY);
        ctx.stroke();
    }
    ;
}
function int(n) {
    return typeof n === 'number';
}
function copyText() {
    design.select();
    design.setSelectionRange(0, 99999999);
    navigator.clipboard.writeText(JSON.stringify(canvasArray));
}
function setArray() {
    if (canvasArray.length === 0) {
        design.value = '[ ]';
    }
    else {
        design.value = JSON.stringify(canvasArray);
    }
    ;
}
function redoFunc() {
    for (var i = 0; i < 4; i++) {
        canvasArray.pop();
    }
    num -= 4;
}
function clear() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
}
;
function drawLines() {
    var i = 0;
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        while (i < canvasArray.length) {
            var CA1 = canvasArray[i];
            var CA2 = canvasArray[i + 1];
            if (int(CA1) && int(CA2)) {
                ctx.moveTo(CA1, CA2);
                ctx.lineTo(+canvasArray[i + 2], +canvasArray[i + 3]);
                i += 4;
            }
            else {
                if (!(int(CA1) || int(CA2))) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle = CA1;
                    ctx.lineWidth = +CA2;
                    i += 2;
                }
                else {
                    if (Math.sign(+CA1)) {
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.lineWidth = +CA1;
                        i++;
                    }
                    else {
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.strokeStyle = CA1.toString();
                        i++;
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
        ctx.stroke();
    }
    ;
}
;
function generateCode() {
    var space = document.querySelector('.space');
    var range = document.createRange();
    var selection = window.getSelection();
    var i = 0;
    if (space) {
        space.innerHTML = '';
        space.innerHTML += "<div>const canvas = document.querySelector('canvas');</div><div>const ctx = canvas.getContext('2d');</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '#000000';</div><div>ctx.lineWidth = 1;</div>";
        while (i < canvasArray.length) {
            var CA1 = canvasArray[i];
            var CA2 = canvasArray[i + 1];
            if (int(CA1) && int(CA2)) {
                space.innerHTML += "<div>ctx.moveTo(".concat(CA1, ", ").concat(CA2, ");</div>");
                space.innerHTML += "<div>ctx.lineTo(".concat(canvasArray[i + 2], ", ").concat(canvasArray[i + 3], ");</div>");
                i += 4;
            }
            else {
                if (!(int(CA1) || int(CA2))) {
                    space.innerHTML += "<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '".concat(CA1, "';</div>");
                    space.innerHTML += "<div>ctx.lineWidth = '".concat(CA2, "';</div>");
                    i += 2;
                }
                else {
                    if (Math.sign(+CA1)) {
                        space.innerHTML += "<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.lineWidth = '".concat(CA1, "';</div>");
                        i++;
                    }
                    else {
                        space.innerHTML += "<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '".concat(CA1, "';</div>");
                        i++;
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
        space.innerHTML += '<div>ctx.stroke();</div>';
        selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
        range.selectNodeContents(space);
        selection === null || selection === void 0 ? void 0 : selection.addRange(range);
    }
    ;
}
;
function resize(type) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    if (type === 'def') {
        var height = window.innerHeight;
        var width = window.innerWidth;
        canvas.width = (width / 100) * 70;
        canvas.height = (height / 100) * 72.5;
    }
    else {
        canvas.width = rest[0];
        canvas.height = rest[1];
    }
}
function drawGrid() {
    var gridSize = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    canvasWidth = +document.querySelector('.width').value || canvas.width;
    canvasHeight = +document.querySelector('.height').value || canvas.height;
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "#AAAAAA";
        ctx.lineWidth = 1;
        for (var x_1 = 0; x_1 <= canvasWidth; x_1 += gridSize) {
            ctx.moveTo(x_1, 0);
            ctx.lineTo(x_1, canvasHeight);
        }
        for (var y_1 = 0; y_1 <= canvasHeight; y_1 += gridSize) {
            ctx.moveTo(0, y_1);
            ctx.lineTo(canvasWidth, y_1);
        }
        ctx.stroke();
    }
    ;
}
resize('def');
drawGrid();
if (localCanvas !== null) {
    canvasArray = JSON.parse(localCanvas);
    drawLines();
}
setArray();
window.addEventListener('resize', function (e) {
    canvasWidth = +(document.querySelector('.width').value);
    canvasHeight = +(document.querySelector('.height').value);
    if (!(canvasWidth && canvasHeight)) {
        resize('def');
    }
    else {
        resize('custom', canvasWidth, canvasHeight);
    }
    drawGrid();
    drawLines();
});
window.addEventListener('beforeunload', function (e) {
    if (localStorage.getItem('canvasArray') !== JSON.stringify(canvasArray) && !warnedUser) {
        e.preventDefault();
        warnedUser = true;
    }
});
canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
canvas.addEventListener('pointerdown', function (e) {
    var localStroke = document.querySelector('.stroke-width').value || 1;
    if (localStroke !== '0') {
        var localColor = document.querySelector('.color').value;
        if (localColor !== color) {
            color = localColor;
            num++;
            canvasArray[num] = color;
        }
        if (localStroke !== stroke) {
            stroke = localStroke;
            num++;
            canvasArray[num] = stroke;
        }
        x = Math.round(e.offsetX);
        y = Math.round(e.offsetY);
        num++;
        canvasArray[num] = x;
        num++;
        canvasArray[num] = y;
        canvas.addEventListener('pointermove', previewLineHandler);
    }
    else {
        stroke = localStroke;
    }
});
canvas.addEventListener('pointerup', function (e) {
    if (stroke !== 0) {
        var a = Math.round(e.offsetX);
        var b = Math.round(e.offsetY);
        clear();
        drawGrid();
        drawLines();
        canvas.removeEventListener('pointermove', previewLineHandler);
        num++;
        canvasArray[num] = a;
        num++;
        canvasArray[num] = b;
        if (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = +stroke;
            ctx.moveTo(x, y);
            ctx.lineTo(a, b);
            ctx.stroke();
            setArray();
        }
        ;
    }
});
redo === null || redo === void 0 ? void 0 : redo.addEventListener('click', function () {
    clear();
    redoFunc();
    drawGrid();
    drawLines();
    setArray();
});
generate === null || generate === void 0 ? void 0 : generate.addEventListener('click', function () {
    generateCode();
});
reset === null || reset === void 0 ? void 0 : reset.addEventListener('click', function () {
    clear();
    drawGrid();
    canvasArray = [];
    num = -1;
    localStorage.removeItem('canvasArray');
    stroke = 1;
    color = '#000000';
    setArray();
});
set === null || set === void 0 ? void 0 : set.addEventListener('click', function () {
    canvasWidth = +(document.querySelector('.width').value);
    canvasHeight = +(document.querySelector('.height').value);
    resize('custom', canvasWidth, canvasHeight);
    drawGrid();
    drawLines();
});
copy === null || copy === void 0 ? void 0 : copy.addEventListener('click', function () {
    copyText();
});
userDesign === null || userDesign === void 0 ? void 0 : userDesign.addEventListener('click', function () {
    clear();
    canvasArray = JSON.parse(document.querySelector('.design').value);
    drawGrid();
    drawLines();
    setArray();
});
save === null || save === void 0 ? void 0 : save.addEventListener('click', function () {
    localStorage.setItem('canvasArray', JSON.stringify(canvasArray));
});