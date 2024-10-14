// @ts-check

// Initalize HTML elements
const /** @type{HTMLCanvasElement | null} */ canvas = document.querySelector('.canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const /** @type{HTMLButtonElement | null} */ reset = document.querySelector('.reset');
const /** @type{HTMLButtonElement | null} */ generate = document.querySelector('.generate');
const /** @type{HTMLButtonElement | null} */ redo = document.querySelector('.redo');
const /** @type{HTMLButtonElement | null} */ set = document.querySelector('.setBtn');
const /** @type{HTMLButtonElement | null} */ copy = document.querySelector('.copy');
const /** @type{HTMLInputElement | null} */ design = document.querySelector('.design');
const /** @type{HTMLButtonElement | null} */ userDesign = document.querySelector('.user-design');
const /** @type{HTMLInputElement | null} */ newDesign = document.querySelector('.new-design');
const /** @type{HTMLButtonElement | null} */ save = document.querySelector('.save');
const /** @type{HTMLInputElement | null} */ widthInput = document.querySelector('.width');
const /** @type{HTMLInputElement | null} */ heightInput = document.querySelector('.height');

// Initialize local variables
let stroke = 1;
let color = '#000000';
let canvasWidth;
let canvasHeight;
let x;
let y;
let num = -1;
let canvasArray = [];
let warnedUser = false;
const localCanvasArray = localStorage.getItem('canvasArray');

resize('def');
drawGrid();
if (localCanvasArray !== null) {
    canvasArray = JSON.parse(localCanvasArray);
    drawLines();
}
setArray();
initializeEventListeners();

function initializeEventListeners() {
    window.addEventListener('resize', windowResizeHandler);
    window.addEventListener('beforeunload', windowPreLoadHandler);

    if (canvas) {
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        canvas.addEventListener('pointerup', canvasPointerHandler);
        canvas.addEventListener('pointerdown', canvasPointerHandler);

    }

    if (redo) {
        redo.addEventListener('click', () => {
            clear();
            redoFunc();
            drawGrid();
            drawLines();
            setArray();
        });
    }

    if (generate) {
        generate.addEventListener('click', () => {
            generateCode();
        });
    }

    if (reset) {
        reset.addEventListener('click', () => {
            clear();
            drawGrid();
            canvasArray = [];
            num = -1;
            localStorage.removeItem('canvasArray');
            stroke = 1;
            color = '#000000';
            setArray();
        });
    }

    if (set) {
        set.addEventListener('click', () => {
            if (widthInput && heightInput) {
                canvasWidth = parseInt(widthInput.value);
                canvasHeight = parseInt(heightInput.value);
                resize('custom', canvasWidth, canvasHeight);
                drawGrid();
                drawLines();
            }
        });
    }

    if (copy) {
        copy.addEventListener('click', () => {
            copyText();
        });
    }

    if (userDesign) {
        userDesign.addEventListener('click', () => {
            clear();
            canvasArray = newDesign ? JSON.parse(newDesign.value) : [];
            drawGrid();
            drawLines();
            setArray();
        });
    }

    if (save) {
        save.addEventListener('click', () => {
            localStorage.setItem('canvasArray', JSON.stringify(canvasArray));
        });
    }
}

function windowResizeHandler() {
    const canvasWidth = widthInput ? parseInt(widthInput.value) : 0;
    const canvasHeight = heightInput ? parseInt(heightInput.value) : 0;

    if (!(canvasWidth && canvasHeight)) {
        resize('def');
    } else {
        resize('custom', canvasWidth, canvasHeight);
    }

    drawGrid();
    drawLines();
}

function windowPreLoadHandler(/** @type {Event} */ e) {
    if (localStorage.getItem('canvasArray') !== JSON.stringify(canvasArray) && !warnedUser) {
        e.preventDefault();
        warnedUser = true;
    }
}

function canvasPointerHandler(/** @type {PointerEvent} */ e) {
    if (e.type === 'pointerup') {
        if (stroke !== 0 && canvas && ctx) {
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
            ctx.lineWidth = stroke;
            ctx.moveTo(x, y);
            ctx.lineTo(a, b);
            ctx.stroke();
            setArray();
        }
    } else if (e.type === 'pointerdown') {
        const /** @type{HTMLInputElement | null} */ strokeInput = document.querySelector('.stroke-width');
        const localStroke = strokeInput ? parseInt(strokeInput.value) : 1;
        if (localStroke !== 0 && canvas) {
            const /** @type{HTMLInputElement | null} */ colorInput = document.querySelector('.color');
            const localColor = colorInput ? colorInput.value : color;

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
    }
}

// Canvas functions
function previewLineHandler(/** @type {PointerEvent} */ e) {
    clear();
    drawGrid();
    drawLines();
    previewLine(e);
};

function previewLine(/** @type {PointerEvent} */ event) {
    const atX = event.offsetX;
    const atY = event.offsetY;
    if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = stroke > 0 ? stroke : 0;
        ctx.moveTo(x, y);
        ctx.lineTo(atX, atY);
        ctx.stroke();
    }
}

function clear() {
    if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

function drawLines() {
    if (canvas && ctx) {
        let i = 0;
        ctx.beginPath()
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        while (i < canvasArray.length) {
            let CA1 = canvasArray[i];
            let CA2 = canvasArray[i + 1];

            if (_int(CA1) && _int(CA2)) {
                ctx.moveTo(CA1, CA2);
                ctx.lineTo(canvasArray[i + 2], canvasArray[i + 3]);
                i += 4;
            } else {
                if (!(_int(CA1) || _int(CA2))) {
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.strokeStyle = CA1;
                    ctx.lineWidth = +CA2;
                    i += 2;
                } else {
                    if (Math.sign(CA1)) {
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.lineWidth = CA1;
                        i++;
                    } else {
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.strokeStyle = CA1;
                        i++;
                    };
                };
            };
        };
        ctx.stroke();
    }
};

/**
 * @param {string} type
 * @param {number[]} rest
 */
function resize(type, ...rest) {
    if (type === 'def') {
        if (canvas) {
            canvas.width = (window.innerWidth / 100) * 70;
            canvas.height = (window.innerHeight / 100) * 72.5;
        }
    } else {
        if (canvas) {
            canvas.width = rest[0];
            canvas.height = rest[1];
        }
    }
}

function drawGrid() {
    if (canvas && ctx) {
        const gridSize = 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        const canvasWidth = widthInput ? parseInt(widthInput.value) : canvas.width;
        const canvasHeight = heightInput ? parseInt(heightInput.value) : canvas.height;

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

}

function copyText() {
    if (design) {
        design.select();
        design.setSelectionRange(0, 99999999);
        navigator.clipboard.writeText(JSON.stringify(canvasArray));
    }
}

function setArray() {
    if (design) {
        if (canvasArray.length === 0) {
            design.value = '[ ]'
        } else {
            design.value = JSON.stringify(canvasArray);
        };
    }
}

function redoFunc() {
    for (let i = 0; i < 4; i++) {
        canvasArray.pop();
    }
    num -= 4;
}



function generateCode() {
    const space = document.querySelector('.space');
    const range = document.createRange();
    const selection = window.getSelection();
    let i = 0;
    if (space && selection) {
        space.innerHTML = `<div>const canvas = document.querySelector(\'canvas\');</div><div>const ctx = canvas.getContext(\'2d\');</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '#000000';</div><div>ctx.lineWidth = 1;</div>`


        while (i < canvasArray.length) {
            let CA1 = canvasArray[i];
            let CA2 = canvasArray[i + 1];

            if (_int(CA1) && _int(CA2)) {
                space.innerHTML += `<div>ctx.moveTo(${CA1}, ${CA2});</div>`;
                space.innerHTML += `<div>ctx.lineTo(${canvasArray[i + 2]}, ${canvasArray[i + 3]});</div>`;
                i += 4;
            } else {
                if (!(_int(CA1) || _int(CA2))) {
                    space.innerHTML += `<div>ctx.stroke();</div><div>ctx.beginPath();</div><div>ctx.strokeStyle = '${CA1}';</div>`;
                    space.innerHTML += `<div>ctx.lineWidth = '${CA2}';</div>`;
                    i += 2;
                } else {
                    if (Math.sign(CA1)) {
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
        selection.removeAllRanges();
        range.selectNodeContents(space);
        selection.addRange(range);
    }
};

function _int(/** @type {any} */ n) {
    return typeof n === 'number';
}