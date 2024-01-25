
let MODE_ICON_DRAW_FUNCTIONS = { // from techmino v0.17.15 /parts/scenes/load.lua, ported to JS
    marathon: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.translate(6, 2); // {'move',6,2}
            ctx.fillRect(32, 12, 8, 84); // {'fRect',40,12,-8,84}
            ctx.beginPath(); // {'fPoly',40,12,96,40,40,68}
            ctx.moveTo(39.5, 12);
            ctx.lineTo(96, 40);
            ctx.lineTo(39.5, 68);
            ctx.closePath();
            ctx.fill();
            ctx.fillRect(16, 96, 40, 12); // {'fRect',16,96,40,12}
        ctx.restore();
    },
    infinite: (ctx, x, y, size) => {
        // TODO: infinite modeicon
    },
    classic: (ctx, x, y, size) => {
        // TODO: classic modeicon
    },
    tsd: (ctx, x, y, size) => {
        // TODO: tsd modeicon
    },
    t49: (ctx, x, y, size) => {
        // TODO: t49 modeicon
    },
    t99: (ctx, x, y, size) => {
        // TODO: t99 modeicon
    },
    secret_grade: (ctx, x, y, size) => {
        // TODO: secret_grade modeicon
    },
    sprint_pento: (ctx, x, y, size) => {
        // TODO: sprint_pento modeicon
    },
    sprint_tri: (ctx, x, y, size) => {
        // TODO: sprint_tri modeicon
    },
    ultra: (ctx, x, y, size) => {
        // TODO: ultra modeicon
    },
    big: (ctx, x, y, size) => {
        // TODO: big modeicon
    },
    zen: (ctx, x, y, size) => {
        // TODO: zen modeicon
    },
    tech: (ctx, x, y, size) => {
        // TODO: tech modeicon
    },
    tech_plus: (ctx, x, y, size) => {
        // TODO: tech_plus modeicon
    },
};
const MODE_ICON_IMAGE_NAMES = [ // NOTE: Update this list whenever you add a new image to /data/image/modeicons!
    'attack',
    'backfire',
    'defend',
    'dig','dig_eff','dig_sprint',
    'drought',
    'hidden','hidden2','hidden3','hidden4','hidden5',
    'master','master_ex',
    'mess',
    'pc',
    'round',
    'solo',
    'sprint1','sprint2','sprint3',
    'survivor'
];


// Get a function that draws a mode icon.
// It may draw it using an image or using a canvas.
// Input: the icon name as a string
// Output: a function where:
//   - input: the canvas context (object) and X/Y/size of the mode icon (number)
//   - output: none
const getModeIconDrawFunction = (icon) => {
    if(MODE_ICON_DRAW_FUNCTIONS[icon]) {
        return MODE_ICON_DRAW_FUNCTIONS[icon];
    }
    if(!icon || icon === '' || icon === 'none') {
        return (_,__,___,____)=>{};
    }
    
    // try to find the png from /data/img/modeicons
    let img = new Image();
    img.src = `data/img/modeicons/${icon}.png`;
    
    // check if image exists
    if(!img.width) {
        return (_,__,___,____)=>{};
    }

    let func = (ctx, x, y, size) => {
        const x2 = x - size * 0.5;
        const y2 = y - size * 0.5;
        ctx.drawImage(img, x2, y2, 2 * size, 2 * size);
    }
    MODE_ICON_DRAW_FUNCTIONS[icon] = func;
    return func;
}


// Get a map of mode icon names to functions that draw them.
// Input: none
// Output: a map of mode icon names to functions that draw them, where each function:
//   - input: the canvas context (object) and X/Y/size of the mode icon (number)
//   - output: none
const getModeIconDrawFunctionMap = () => {
    MODE_ICON_IMAGE_NAMES.forEach((icon) => {
        getModeIconDrawFunction(icon);
    })
    return MODE_ICON_DRAW_FUNCTIONS;
}