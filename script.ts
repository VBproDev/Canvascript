const canvas = document.querySelector('.canvas') as HTMLCanvasElement;
const reset = document.querySelector('.reset')!;
const generate = document.querySelector('.generate')!;
const undo = document.querySelector('.undo')!;
const set = document.querySelector('.setBtn')!;
const ctx = canvas.getContext('2d')!;
const design = document.querySelector('.design') as HTMLInputElement;
const userDesign = document.querySelector('.user-design')!;
const save = document.querySelector('.save')!;
const popup_saved = document.querySelector('.popup_saved') as HTMLDivElement;
const curveInputContainer = document.querySelector('.curve-input-container')!;
const btnClose = document.querySelector('.btn-close')!;
const copyBtn = document.querySelector('.copy')!;
const isFreehand = document.querySelector('.isFreehand') as HTMLInputElement;
const curveY = document.querySelector('.curveY')!;
const curveX = document.querySelector('.curveX')!;
const localCanvas = localStorage.getItem('canvasArray');

const previewLineHandler = (e: PointerEvent) => {
    clear();
    drawGrid();
    drawLines();
    previewLine(e);
    setArray();
};

let stroke = '1';
let color = '#000000';
let canvasWidth: canvasOutput;
let canvasHeight: canvasOutput;
let x: number;
let y: number;
let num = -1;
let canvasArray: (number | string | number[] | array)[] = [];
let warnedUser = false;
let freeArray: array = ['freehandArray'];

type array = (number | string)[];
type canvasOutput = number | HTMLInputElement;

function previewLine(e: PointerEvent) {
    const atX = e.offsetX;
    const atY = e.offsetY;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = +stroke;
    ctx.moveTo(x, y);
    ctx.lineTo(atX, atY);
    ctx.stroke();
}

function int(n: any): boolean {
    return typeof n === 'number';
}

function setArray() {
    if (canvasArray.length === 0) {
        design.value = '[ ]'
    } else {
        design.value = JSON.stringify(canvasArray);
    };
}

function undoFunc() {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function drawLines() {
    let i = 0;

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
            let freeCA1 = [...CA1];

            if (freeCA1[0] === 'freehandArray') {
                freeCA1.shift();
                ctx.moveTo(+freeCA1[0], +freeCA1[1]);
                freeCA1.splice(0, 2);

                for (let j = 0; j < freeCA1.length; j += 2) {
                    ctx.lineTo(+freeCA1[j], +freeCA1[j + 1]);
                };

            }

            else {
                ctx.moveTo(+CA1[0], +CA1[1]);
                ctx.quadraticCurveTo(+CA1[2], +CA1[3], +CA1[4], +CA1[5]);
            };

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

function generateCode() {
    const space = document.querySelector('.space')!;
    const selection = window.getSelection();
    const range = document.createRange();
    let i = 0;

    space.innerHTML = ''; // Clear space first

    const fragments = [
        `<div>const canvas = document.querySelector(\'canvas\');</div>`,
        `<div>const ctx = canvas.getContext(\'2d\');</div>`,
        `<div>ctx.beginPath();</div>`,
        `<div>ctx.strokeStyle = '#000000';</div>`,
        `<div>ctx.lineWidth = 1;</div>`,
    ];

    while (i < canvasArray.length) {
        let CA1 = canvasArray[i];
        let CA2 = canvasArray[i + 1];

        if (int(CA1) && int(CA2)) {
            fragments.push(
                `<div>ctx.moveTo(${CA1}, ${CA2});</div>`,
                `<div>ctx.lineTo(${canvasArray[i + 2]}, ${canvasArray[i + 3]});</div>`
            );
            i += 4;
        } else if (Array.isArray(CA1)) {
            let freeCA1 = [...CA1];

            if (freeCA1[0] === 'freehandArray') {
                freeCA1.shift();
                fragments.push(`<div>ctx.moveTo(${+freeCA1[0]}, ${+freeCA1[1]});</div>`);
                freeCA1.splice(0, 2);

                for (let j = 0; j < freeCA1.length; j += 2) {
                    fragments.push(`<div>ctx.lineTo(${+freeCA1[j]}, ${+freeCA1[j + 1]});</div>`);
                }
            } else {
                fragments.push(
                    `<div>ctx.moveTo(${CA1[0]}, ${CA1[1]});</div>`,
                    `<div>ctx.quadraticCurveTo(${CA1[2]}, ${CA1[3]}, ${CA1[4]}, ${CA1[5]});</div>`
                );
            }
            i++;
        } else {
            if (!(int(CA1) || int(CA2)) && !Array.isArray(CA2)) {
                fragments.push(
                    `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`,
                    `<div>ctx.lineWidth = '${CA2}';</div>`
                );
                i += 2;
            } else {
                fragments.push(
                    Math.sign(+CA1)
                        ? `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.lineWidth = '${CA1}';</div>`
                        : `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`
                );
                i++;
            }
        }
    }

    fragments.push('<div>ctx.stroke();</div>');
    space.innerHTML = fragments.join(''); // Update DOM once

    selection?.removeAllRanges();
    range.selectNodeContents(space);
    selection?.addRange(range);
}

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
                newArray.push(+CA1[i])
            };

            canvasArray.pop();
        };

        newArray.push(Math.round(canvas.width / 100) * +(curveX.value));
        newArray.push(Math.round(canvas.height / 100) * +(curveY.value));
        canvasArray.push(newArray);
    };
};

function updateStrokeSettings() {
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
};

function pointerDownHandler(e: PointerEvent) {
    x = Math.round(e.offsetX);
    y = Math.round(e.offsetY);

    num++;
    canvasArray[num] = x;
    num++;
    canvasArray[num] = y;

    canvas.addEventListener('pointermove', previewLineHandler);
};

function pointerUpHandler(e: PointerEvent) {
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

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = +stroke;
    ctx.moveTo(x, y);
    ctx.lineTo(a, b);
    ctx.stroke();
};

function freehandPointerDownHandler(e: PointerEvent) {
    freeArray.push(Math.round(e.offsetX));
    freeArray.push(Math.round(e.offsetY));
    canvas.addEventListener('pointermove', freehandPointerMoveHandler);
}

function freehandPointerMoveHandler(e: PointerEvent) {
    freeArray.push(Math.round(e.offsetX));
    freeArray.push(Math.round(e.offsetY));

    if (freeArray.length === 5) {
        num++;
        canvasArray[num] = freeArray;
    }

    else {
        canvasArray[num] = freeArray;
    };

    clear();
    drawGrid();
    drawLines();
    setArray();
}

function freehandPointerUpHandler(e: PointerEvent) {
    canvas.removeEventListener('pointermove', freehandPointerMoveHandler);
    freeArray = ['freehandArray'];
}

function isFreehandChecker() {
    if (isFreehand.checked) {
        canvas.removeEventListener('pointerdown', pointerDownHandler);
        canvas.removeEventListener('pointermove', previewLineHandler);
        canvas.removeEventListener('pointerup', pointerUpHandler);
        canvas.addEventListener('pointerdown', freehandPointerDownHandler);
        canvas.addEventListener('pointerup', freehandPointerUpHandler);

        curveY?.setAttribute('disabled', 'disabled');
        curveX?.setAttribute('disabled', 'disabled');
    }

    else {
        canvas.removeEventListener('pointerdown', freehandPointerDownHandler);
        canvas.removeEventListener('pointermove', freehandPointerMoveHandler);
        canvas.removeEventListener('pointerup', freehandPointerUpHandler);
        canvas.addEventListener('pointerdown', pointerDownHandler);
        canvas.addEventListener('pointerup', pointerUpHandler);

        curveY?.removeAttribute('disabled');
        curveX?.removeAttribute('disabled');
    };
}

resize('def');
drawGrid();
isFreehandChecker();

if (localCanvas !== null) {
    canvasArray = JSON.parse(localCanvas);
    num += canvasArray.length;
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

canvas.addEventListener('pointerdown', updateStrokeSettings);

canvas.addEventListener('pointerdown', pointerDownHandler);

canvas.addEventListener('pointerup', pointerUpHandler);

undo.addEventListener('click', () => {
    clear();
    undoFunc();
    drawGrid();
    drawLines();
    setArray();
});

generate.addEventListener('click', () => {
    generateCode();
});

reset.addEventListener('click', () => {
    clear();
    drawGrid();
    canvasArray = [];
    freeArray = [];
    num = -1;
    localStorage.removeItem('canvasArray');
    stroke = '1';
    color = '#000000';
    setArray();
});

set.addEventListener('click', () => {
    canvasWidth = +((document.querySelector('.width') as HTMLInputElement).value);
    canvasHeight = +((document.querySelector('.height') as HTMLInputElement).value);
    resize('custom', canvasWidth, canvasHeight);
    drawGrid();
    drawLines();
});

save.addEventListener('click', () => {
    localStorage.setItem('canvasArray', JSON.stringify(canvasArray));
    num += canvasArray.length;
    popup_saved.classList.add('show');

    btnClose?.addEventListener('click', () => {
        clearTimeout(saveTimer);
        popup_saved.classList.remove('show');
    })

    const saveTimer = setTimeout(() => {
        popup_saved.classList.remove('show');
    }, 2300);
});

userDesign.addEventListener('click', () => {
    clear();
    canvasArray = JSON.parse((document.querySelector('.design') as HTMLInputElement).value);
    drawGrid();
    drawLines();
    setArray();
});

curveInputContainer.addEventListener('input', (e) => {
    if (!isFreehand.checked) {
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
    };
});

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText((document.querySelector('.design') as HTMLInputElement).value);
});

isFreehand.addEventListener('change', () => {
    isFreehandChecker();
});