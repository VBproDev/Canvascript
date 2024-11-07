const canvas = document.querySelector('.canvas') as HTMLCanvasElement;
const reset = document.querySelector('.reset');
const generate = document.querySelector('.generate');
const redo = document.querySelector('.redo');
const set = document.querySelector('.setBtn');
const ctx = canvas.getContext('2d');
const copy = document.querySelector('.copy');
const design = document.querySelector('.design') as HTMLInputElement;
const userDesign = document.querySelector('.user-design');
const save = document.querySelector('.save');
const curveInputContainer = document.querySelector('.curve-input-container')!;
const localCanvas = localStorage.getItem('canvasArray');

const previewLineHandler = (e: MouseEvent | PointerEvent) => {
    clear();
    drawGrid();
    drawLines();
    previewLine(e);
};

let stroke = '1';
let color = '#000000';
let canvasWidth: number | HTMLInputElement;
let canvasHeight: number | HTMLInputElement;
let x: number;
let y: number;
let num = -1;
let canvasArray: (number | string | number[])[] = [];
let warnedUser = false;

function previewLine(event: MouseEvent | PointerEvent) {
    const atX = event.offsetX;
    const atY = event.offsetY;

    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = +stroke;
        ctx.moveTo(x, y);
        ctx.lineTo(atX, atY);
        ctx.stroke();
    };
}

function int(n: number | string | number[]): boolean {
    return typeof n === 'number';
}

function copyText() {
    design.select();
    design.setSelectionRange(0, 99999999);
    navigator.clipboard.writeText(JSON.stringify(canvasArray));
}

function setArray() {
    if (canvasArray.length === 0) {
        design.value = '[ ]'
    } else {
        design.value = JSON.stringify(canvasArray);
    };
}

function redoFunc() {
    const CA1 = canvasArray[canvasArray.length - 1];

    if (int(CA1)) {
        for (let i = 0; i < 4; i++) {
            canvasArray.pop();
        };
        num -= 4;
    }

    else if (Array.isArray(CA1)) {
        canvasArray.pop();
        num--;
    };
};

function clear() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
};

function drawLines() {
    let i = 0;

    if (ctx) {
        ctx.beginPath()
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        while (i < canvasArray.length) {
            let CA1 = canvasArray[i];
            let CA2 = canvasArray[i + 1];

            if (int(CA1) && int(CA2)) {
                ctx.moveTo(+CA1, +CA2);
                ctx.lineTo(+canvasArray[i + 2], +canvasArray[i + 3]);
                i += 4;
            }

            else if (Array.isArray(CA1)) {
                ctx.moveTo(CA1[0], CA1[1]);
                ctx.quadraticCurveTo(CA1[2], CA1[3], CA1[4], CA1[5]);
                i++;
            }

            else {
                if (!(int(CA1) || int(CA2)) && !Array.isArray(CA2)) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle = CA1.toString();
                    ctx.lineWidth = +CA2;
                    i += 2;
                } else {
                    if (Math.sign(+CA1)) {
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.lineWidth = +CA1;
                        i++;
                    } else {
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.strokeStyle = CA1.toString();
                        i++;
                    };
                };
            };
        };
        ctx.stroke();
    };
};

function generateCode() {
    const space = document.querySelector('.space');
    const range = document.createRange();
    const selection = window.getSelection();
    let i = 0;

    if (space) {
        space.innerHTML = '';
        space.innerHTML += `<div>const canvas = document.querySelector(\'canvas\');</div><div>const ctx = canvas.getContext(\'2d\');</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '#000000';</div><div>ctx.lineWidth = 1;</div>`

        while (i < canvasArray.length) {
            let CA1 = canvasArray[i];
            let CA2 = canvasArray[i + 1];

            if (int(CA1) && int(CA2)) {
                space.innerHTML += `<div>ctx.moveTo(${CA1}, ${CA2});</div>`;
                space.innerHTML += `<div>ctx.lineTo(${canvasArray[i + 2]}, ${canvasArray[i + 3]});</div>`;
                i += 4;
            }
            else if (Array.isArray(CA1)) {
                space.innerHTML += `<div>ctx.moveTo(${CA1[0]}, ${CA1[1]});</div>`;
                space.innerHTML += `<div>ctx.quadraticCurveTo(${CA1[2]}, ${CA1[3]}, ${CA1[4]}, ${CA1[5]});</div>`;
                i++;
            }

            else {
                if (!(int(CA1) || int(CA2)) && !Array.isArray(CA2)) {
                    space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`;
                    space.innerHTML += `<div>ctx.lineWidth = '${CA2}';</div>`;
                    i += 2;
                } else {
                    if (Math.sign(+CA1)) {
                        space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.lineWidth = '${CA1}';</div>`;
                        i++;
                    } else {
                        space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`;
                        i++;
                    };
                };
            };
        };
        space.innerHTML += '<div>ctx.stroke();</div>';
        selection?.removeAllRanges();
        range.selectNodeContents(space);
        selection?.addRange(range);
    };
};

function resize(type: string, ...rest: number[]) {
    if (type === 'def') {
        const height = window.innerHeight;
        const width = window.innerWidth;
        canvas.width = (width / 100) * 70;
        canvas.height = (height / 100) * 72.5;
    } else {
        canvas.width = rest[0];
        canvas.height = rest[1];
    }
}

function drawGrid() {
    const gridSize = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    canvasWidth = +(document.querySelector('.width') as HTMLInputElement).value || canvas.width;
    canvasHeight = +(document.querySelector('.height') as HTMLInputElement).value || canvas.height;

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
    };
};

function calcCurve() {
    const curveX = document.querySelector('.curveX') as HTMLInputElement;
    const curveY = document.querySelector('.curveY') as HTMLInputElement;
    const CA1 = canvasArray[canvasArray.length - 1];
    let newArray: number[] = [];

    if (canvasArray.length !== 0) {
        if (int(CA1)) {
            for (let i = 0; i < 4; i++) {
                newArray.push(canvasArray.pop() as number);
            };

            num = num - 3;
            newArray.reverse();
        };

        if (Array.isArray(CA1)) {
            for (let i = 0; i < 4; i++) {
                newArray.push(CA1[i])
            };

            canvasArray.pop();
        };

        newArray.push((canvas.width / 100) * +(curveX.value));
        newArray.push((canvas.height / 100) * +(curveY.value));
        canvasArray.push(newArray);
    };
};

resize('def');
drawGrid();

if (localCanvas !== null) {
    canvasArray = JSON.parse(localCanvas);
    drawLines();
}

setArray();

window.addEventListener('resize', (e) => {
    canvasWidth = +((document.querySelector('.width') as HTMLInputElement).value);
    canvasHeight = +((document.querySelector('.height') as HTMLInputElement).value);

    if (!(canvasWidth && canvasHeight)) {
        resize('def');
    } else {
        resize('custom', canvasWidth, canvasHeight);
    }

    clear();
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
    const localStroke = (document.querySelector('.stroke-width') as HTMLInputElement).value;
    const localColor = (document.querySelector('.color') as HTMLInputElement).value;

    if (localColor !== color) {
        color = localColor;
        num++;
        canvasArray[num] = color;
    }

    if (localStroke && localStroke !== stroke) {
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
});

canvas.addEventListener('pointerup', (e) => {
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
    };
    setArray();
});

redo?.addEventListener('click', () => {
    clear();
    redoFunc();
    drawGrid();
    drawLines();
    setArray();
});

generate?.addEventListener('click', () => {
    generateCode();
});

reset?.addEventListener('click', () => {
    clear();
    drawGrid();
    canvasArray = [];
    num = -1;
    localStorage.removeItem('canvasArray');
    stroke = '1';
    color = '#000000';
    setArray();
});

set?.addEventListener('click', () => {
    canvasWidth = +((document.querySelector('.width') as HTMLInputElement).value);
    canvasHeight = +((document.querySelector('.height') as HTMLInputElement).value);
    resize('custom', canvasWidth, canvasHeight);
    drawGrid();
    drawLines();
});

copy?.addEventListener('click', () => {
    copyText();
});

save?.addEventListener('click', () => {
    localStorage.setItem('canvasArray', JSON.stringify(canvasArray));
});

userDesign?.addEventListener('click', () => {
    clear();
    canvasArray = JSON.parse((document.querySelector('.design') as HTMLInputElement).value);
    drawGrid();
    drawLines();
    setArray();
});

curveInputContainer.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    const userPercent = target.value;

    if (target.classList.contains('curveX')) {
        const curveXupdate = document.querySelector('.curveXupdate')!;
        curveXupdate.innerHTML = userPercent;
    }

    else {
        const curveYupdate = document.querySelector('.curveYupdate')!;
        curveYupdate.innerHTML = userPercent;
    };

    clear();
    drawGrid();
    calcCurve();
    drawLines();
    setArray();
});