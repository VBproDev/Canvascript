"use strict";
const canvas = document.querySelector('.canvas');
const reset = document.querySelector('.reset');
const generate = document.querySelector('.generate');
const redo = document.querySelector('.redo');
const set = document.querySelector('.setBtn');
const ctx = canvas.getContext('2d');
const copy = document.querySelector('.copy');
const design = document.querySelector('.design');
const userDesign = document.querySelector('.user-design');
const save = document.querySelector('.save');
const localCanvas = localStorage.getItem('canvasArray');
const previewLineHandler = (e) => {
    clear();
    drawGrid();
    drawLines();
    previewLine(e);
};
let stroke = 1;
let color = '#000000';
let canvasWidth;
let canvasHeight;
let x;
let y;
let num = -1;
let canvasArray = [];
let warnedUser = false;
function previewLine(event) {
    const atX = event.offsetX;
    const atY = event.offsetY;
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
    for (let i = 0; i < 4; i++) {
        canvasArray.pop();
    }
    num -= 4;
}
function clear() {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
}
;
function drawLines() {
    let i = 0;
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        while (i < canvasArray.length) {
            let CA1 = canvasArray[i];
            let CA2 = canvasArray[i + 1];
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
    const space = document.querySelector('.space');
    const range = document.createRange();
    const selection = window.getSelection();
    let i = 0;
    if (space) {
        space.innerHTML = '';
        space.innerHTML += `<div>const canvas = document.querySelector(\'canvas\');</div><div>const ctx = canvas.getContext(\'2d\');</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '#000000';</div><div>ctx.lineWidth = 1;</div>`;
        while (i < canvasArray.length) {
            let CA1 = canvasArray[i];
            let CA2 = canvasArray[i + 1];
            if (int(CA1) && int(CA2)) {
                space.innerHTML += `<div>ctx.moveTo(${CA1}, ${CA2});</div>`;
                space.innerHTML += `<div>ctx.lineTo(${canvasArray[i + 2]}, ${canvasArray[i + 3]});</div>`;
                i += 4;
            }
            else {
                if (!(int(CA1) || int(CA2))) {
                    space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`;
                    space.innerHTML += `<div>ctx.lineWidth = '${CA2}';</div>`;
                    i += 2;
                }
                else {
                    if (Math.sign(+CA1)) {
                        space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.lineWidth = '${CA1}';</div>`;
                        i++;
                    }
                    else {
                        space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`;
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
function resize(type, ...rest) {
    if (type === 'def') {
        const height = window.innerHeight;
        const width = window.innerWidth;
        canvas.width = (width / 100) * 70;
        canvas.height = (height / 100) * 72.5;
    }
    else {
        canvas.width = rest[0];
        canvas.height = rest[1];
    }
}
function drawGrid() {
    const gridSize = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    canvasWidth = +document.querySelector('.width').value || canvas.width;
    canvasHeight = +document.querySelector('.height').value || canvas.height;
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = "#AAAAAA";
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvasWidth; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
        for (let y = 0; y <= canvasHeight; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
        ctx.stroke();
    }
    ;
}
;
resize('def');
drawGrid();
if (localCanvas !== null) {
    canvasArray = JSON.parse(localCanvas);
    drawLines();
}
setArray();
window.addEventListener('resize', (e) => {
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
window.addEventListener('beforeunload', (e) => {
    if (localStorage.getItem('canvasArray') !== JSON.stringify(canvasArray) && !warnedUser) {
        e.preventDefault();
        warnedUser = true;
    }
});
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});
canvas.addEventListener('pointerdown', (e) => {
    const localStroke = document.querySelector('.stroke-width').value || 1;
    if (localStroke !== '0') {
        const localColor = document.querySelector('.color').value;
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
canvas.addEventListener('pointerup', (e) => {
    if (stroke !== 0) {
        let a = Math.round(e.offsetX);
        let b = Math.round(e.offsetY);
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
redo === null || redo === void 0 ? void 0 : redo.addEventListener('click', () => {
    clear();
    redoFunc();
    drawGrid();
    drawLines();
    setArray();
});
generate === null || generate === void 0 ? void 0 : generate.addEventListener('click', () => {
    generateCode();
});
reset === null || reset === void 0 ? void 0 : reset.addEventListener('click', () => {
    clear();
    drawGrid();
    canvasArray = [];
    num = -1;
    localStorage.removeItem('canvasArray');
    stroke = 1;
    color = '#000000';
    setArray();
});
set === null || set === void 0 ? void 0 : set.addEventListener('click', () => {
    canvasWidth = +(document.querySelector('.width').value);
    canvasHeight = +(document.querySelector('.height').value);
    resize('custom', canvasWidth, canvasHeight);
    drawGrid();
    drawLines();
});
copy === null || copy === void 0 ? void 0 : copy.addEventListener('click', () => {
    copyText();
});
userDesign === null || userDesign === void 0 ? void 0 : userDesign.addEventListener('click', () => {
    clear();
    canvasArray = JSON.parse(document.querySelector('.design').value);
    drawGrid();
    drawLines();
    setArray();
});
save === null || save === void 0 ? void 0 : save.addEventListener('click', () => {
    localStorage.setItem('canvasArray', JSON.stringify(canvasArray));
});
