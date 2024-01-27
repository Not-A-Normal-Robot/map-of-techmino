
let MODE_ICON_DRAW_FUNCTIONS = { // from techmino v0.17.15 /parts/scenes/load.lua, ported to JS
    template: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128); // rescale from 128x128
            // insert code here
        ctx.restore();
    },
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
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 8; // {'setLW',8}
            ctx.beginPath(); // {'dCirc',64,64,56}
            ctx.arc(64, 64, 56, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.beginPath(); // {'line',64,28,64,64,82,82}
            ctx.moveTo(64, 28);
            ctx.lineTo(64, 64);
            ctx.lineTo(82, 82);
            ctx.stroke();
            // we will ignore {'move',1,1}, the OBOE doesn't even happen here
            ctx.fillRect(60, 14, 8, 8); // {'fRect',60,14,8,8}
            ctx.fillRect(14, 60, 8, 8); // {'fRect',14,60,8,8}
            ctx.fillRect(104, 60, 8, 8); // {'fRect',104,60,8,8}
            ctx.fillRect(60, 104, 8, 8); // {'fRect',60,104,8,8}
        ctx.restore();
    },
    classic: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 12; // {'setLW',12}
            ctx.strokeRect(20, 48, 24, 24); // {'dRect',20,48,24,24},
            ctx.strokeRect(52, 48, 24, 24); // {'dRect',52,48,24,24},
            ctx.strokeRect(84, 48, 24, 24); // {'dRect',84,48,24,24},
            ctx.strokeRect(52, 80, 24, 24); // {'dRect',52,80,24,24},
        ctx.restore();
    },
    tsd: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.fillRect(14, 14, 32, 32); // {'fRect',14,14,32,32},
            ctx.fillRect(14, 82, 32, 32); // {'fRect',14,82,32,32},
            ctx.fillRect(82, 82, 32, 32); // {'fRect',82,82,32,32},
            ctx.translate(1, 1); // {'move',1,1}
            ctx.lineWidth = 2; // {'setLW',2}
            ctx.beginPath(); // {'dPoly',14,48,112,48,112,78,78,78,78,112,48,112,48,78,14,78}
            ctx.moveTo(14, 48);
            ctx.lineTo(112, 48);
            ctx.lineTo(112, 78);
            ctx.lineTo(78, 78);
            ctx.lineTo(78, 112);
            ctx.lineTo(48, 112);
            ctx.lineTo(48, 78);
            ctx.lineTo(14, 78);
            ctx.closePath();
            ctx.stroke();
        ctx.restore();
    },
    t49: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 4; // {'setLW',4},
            ctx.strokeRect(10, 10, 20, 40); // {'dRect',10,10,20,40},{'dRect',98,10,20,40},
            ctx.strokeRect(98, 10, 20, 40);
            ctx.strokeRect(10, 78, 20, 40); // {'dRect',10,78,20,40},{'dRect',98,78,20,40},
            ctx.strokeRect(98, 78, 20, 40);
            ctx.strokeRect(40, 20, 46, 86); // {'dRect',40,20,46,86},
            ctx.fillStyle = 'rgba(255,255,255,0.7)'; // {'setCL',1,1,1,.7},
            ctx.fillRect(40, 20, 46, 86); // {'fRect',40,20,46,86},
        ctx.restore();
    },
    t99: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 4; // {'setLW',4},
            ctx.strokeRect(4, 4, 12, 24); // {'dRect',04,004,12,24},{'dRect',022,004,12,24},
            ctx.strokeRect(22, 4, 12, 24);
            ctx.strokeRect(4, 36, 12, 24); // {'dRect',04,036,12,24},{'dRect',022,036,12,24},
            ctx.strokeRect(22, 36, 12, 24);
            ctx.strokeRect(4, 68, 12, 24); // {'dRect',04,068,12,24},{'dRect',022,068,12,24},
            ctx.strokeRect(22, 68, 12, 24);
            ctx.strokeRect(4, 100, 12, 24); // {'dRect',04,100,12,24},{'dRect',022,100,12,24},
            ctx.strokeRect(22, 100, 12, 24);
            ctx.strokeRect(94, 4, 12, 24); // {'dRect',94,004,12,24},{'dRect',112,004,12,24},
            ctx.strokeRect(112, 4, 12, 24);
            ctx.strokeRect(94, 36, 12, 24); // {'dRect',94,036,12,24},{'dRect',112,036,12,24},
            ctx.strokeRect(112, 36, 12, 24);
            ctx.strokeRect(94, 68, 12, 24); // {'dRect',94,068,12,24},{'dRect',112,068,12,24},
            ctx.strokeRect(112, 68, 12, 24);
            ctx.strokeRect(94, 100, 12, 24); // {'dRect',94,100,12,24},{'dRect',112,100,12,24},
            ctx.strokeRect(112, 100, 12, 24);
            ctx.strokeRect(40, 20, 46, 86); // {'dRect',40,20,46,86},
            ctx.fillStyle = 'rgba(255,255,255,0.7)'; // {'setCL',1,1,1,.7},
            ctx.fillRect(40, 20, 46, 86); // {'fRect',40,20,46,86},
        ctx.restore();
    },
    secret_grade: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.fillRect(48, 0, 16, 16); // {'fRect',048,000,16,16},
            ctx.fillRect(64, 16, 16, 16); // {'fRect',064,016,16,16},
            ctx.fillRect(80, 32, 16, 16); // {'fRect',080,032,16,16},
            ctx.fillRect(96, 48, 16, 16); // {'fRect',096,048,16,16},
            ctx.fillRect(112, 64, 16, 16); // {'fRect',112,064,16,16},
            ctx.fillRect(96, 80, 16, 16); // {'fRect',096,080,16,16},
            ctx.fillRect(80, 96, 16, 16); // {'fRect',080,096,16,16},
            ctx.fillRect(64, 112, 16, 16); // {'fRect',064,112,16,16},
        ctx.restore();
    },
    sprint_pento: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            // the game code uses a Unicode PUA to draw the pentomino, but here we will draw it our own way
            ctx.scale(2.8, 2.8);
            ctx.rotate(-0.26);
            ctx.translate(2.6, 12.8);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(10, 0);
            ctx.lineTo(10, 10);
            ctx.lineTo(30, 10);
            ctx.lineTo(30, 20);
            ctx.lineTo(20, 20);
            ctx.lineTo(20, 30);
            ctx.lineTo(10, 30);
            ctx.lineTo(10, 20);
            ctx.lineTo(0, 20);
            ctx.closePath();
            ctx.fill();
        ctx.restore();
    },
    sprint_tri: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 256, 2 * size / 256);
            ctx.translate(72, 20); // {'move',72,20},
            ctx.rotate(0.26); // {'rotate',0.26},
            ctx.fillRect(0, 80, 160, 80); // {'fRect',0,80,160,80},
            ctx.fillRect(80, 0, 80, 81); // {'fRect',80,0,80,80},
        ctx.restore();
    },
    ultra: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 12; // {'setLW',12},
            ctx.fillRect(46, 0, 36, 12); // {'fRect',46,0,36,12},
            ctx.beginPath(); // {'dCirc',64,72,48},
            ctx.arc(64, 72, 48, -0.8, 2 * Math.PI);
            ctx.stroke();
            ctx.fillRect(58, 42, 12, 38); // {'fRect',58,42,12,38,4,4},
            ctx.fillRect(58, 68, 24, 12); // {'fRect',58,68,24,12,4,4},
            ctx.rotate(Math.PI / 4); // {'rotate',math.pi/4},
            ctx.fillRect(90, -64, 16, 24); // {'fRect',90,-64,16,24,4,4}
        ctx.restore();
    },
    big: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 100, 2 * size / 100);
            ctx.lineWidth = 2; // {'setLW',2},
            ctx.fillRect(0, 80, 60, 20); // {'fRect',00,80,60,20},
            ctx.fillRect(20, 60, 20, 20); // {'fRect',20,60,20,20},
            ctx.fillStyle = '#dbcfce'; // {'setCL',unpack(COLOR.lX)},
            ctx.strokeStyle = '#dbcfce';
            ctx.strokeRect(0, 80, 20, 20); // {'dRect',00,80,20,20},
            ctx.strokeRect(20, 80, 20, 20); // {'dRect',20,80,20,20},
            ctx.strokeRect(40, 80, 20, 20); // {'dRect',40,80,20,20},
            ctx.strokeRect(20, 60, 20, 20); // {'dRect',20,60,20,20},

            // Draw grid
            ctx.fillStyle = 'rgba(255,255,255,0.5)'; // {'setCL',1,1,1,.5},
            ctx.translate(0, -2); // not present in original game
            ctx.fillRect(15, 20, 8, 2); // {'fRect',15,20,8,2},{'fRect',35,20,8,2},{'fRect',55,20,8,2},{'fRect',75,20,8,2},
            ctx.fillRect(35, 20, 8, 2);
            ctx.fillRect(55, 20, 8, 2);
            ctx.fillRect(75, 20, 8, 2);
            ctx.fillRect(15, 40, 8, 2); // {'fRect',15,40,8,2},{'fRect',35,40,8,2},{'fRect',55,40,8,2},{'fRect',75,40,8,2},
            ctx.fillRect(35, 40, 8, 2);
            ctx.fillRect(55, 40, 8, 2);
            ctx.fillRect(75, 40, 8, 2);
            ctx.fillRect(15, 60, 8, 2); // {'fRect',15,60,8,2},{'fRect',35,60,8,2},{'fRect',55,60,8,2},{'fRect',75,60,8,2},
            ctx.fillRect(35, 60, 8, 2);
            ctx.fillRect(55, 60, 8, 2);
            ctx.fillRect(75, 60, 8, 2);
            ctx.fillRect(15, 80, 8, 2); // {'fRect',15,80,8,2},{'fRect',35,80,8,2},{'fRect',55,80,8,2},{'fRect',75,80,8,2},
            ctx.fillRect(35, 80, 8, 2);
            ctx.fillRect(55, 80, 8, 2);
            ctx.fillRect(75, 80, 8, 2);

            ctx.fillRect(18, 17, 2, 8); // {'fRect',18,17,2,8},{'fRect',38,17,2,8},{'fRect',58,17,2,8},{'fRect',78,17,2,8},
            ctx.fillRect(38, 17, 2, 8);
            ctx.fillRect(58, 17, 2, 8);
            ctx.fillRect(78, 17, 2, 8);
            ctx.fillRect(18, 37, 2, 8); // {'fRect',18,37,2,8},{'fRect',38,37,2,8},{'fRect',58,37,2,8},{'fRect',78,37,2,8},
            ctx.fillRect(38, 37, 2, 8);
            ctx.fillRect(58, 37, 2, 8);
            ctx.fillRect(78, 37, 2, 8);
            ctx.fillRect(18, 57, 2, 8); // {'fRect',18,57,2,8},{'fRect',38,57,2,8},{'fRect',58,57,2,8},{'fRect',78,57,2,8},
            ctx.fillRect(38, 57, 2, 8);
            ctx.fillRect(58, 57, 2, 8);
            ctx.fillRect(78, 57, 2, 8);
            ctx.fillRect(18, 77, 2, 8); // {'fRect',18,77,2,8},{'fRect',38,77,2,8},{'fRect',58,77,2,8},{'fRect',78,77,2,8},
            ctx.fillRect(38, 77, 2, 8);
            ctx.fillRect(58, 77, 2, 8);
            ctx.fillRect(78, 77, 2, 8);
        ctx.restore();
    },
    tech: (ctx, x, y, size) => {
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 4; // {'setLW',4},

            // Draw Erlenmeyer flask
            ctx.beginPath(); // {'dPoly',51,12, 75,12, 75,43, 109,117, 17,117, 51,43},
            ctx.moveTo(51, 12);
            ctx.lineTo(75, 12);
            ctx.lineTo(75, 43);
            ctx.lineTo(109, 117);
            ctx.lineTo(17, 117);
            ctx.lineTo(51, 43);
            ctx.closePath();
            ctx.stroke();

            // Draw flask rim
            ctx.beginPath(); // {'fPoly',42,10, 52,10, 52,20},
            ctx.moveTo(42, 10);
            ctx.lineTo(52, 10);
            ctx.lineTo(52, 20);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath(); // {'fPoly',74,10, 84,10, 74,20},
            ctx.moveTo(74, 10);
            ctx.lineTo(84, 10);
            ctx.lineTo(74, 20);
            ctx.closePath();
            ctx.fill();

            // Draw flask measurement marks
            ctx.beginPath(); // {'line',42,105, 62,105},
            ctx.moveTo(42, 105);
            ctx.lineTo(62, 105);
            ctx.moveTo(46, 91); // {'line',46,91, 62,91},
            ctx.lineTo(62, 91);
            ctx.moveTo(50, 75); // {'line',50,75,  62,75},
            ctx.lineTo(62, 75);
            ctx.moveTo(54, 57); // {'line',54,57, 62,57},
            ctx.lineTo(62, 57);
            ctx.stroke();
        ctx.restore();
    },
    tech_plus: (ctx, x, y, size) => {
        // Draw tech icon
        MODE_ICON_DRAW_FUNCTIONS.tech(ctx, x, y, size);
        
        ctx.save();
            ctx.translate(x, y);
            ctx.translate(-size / 2, -size / 2);
            ctx.scale(2 * size / 128, 2 * size / 128);
            ctx.lineWidth = 4;

            // Draw plus icon
            ctx.beginPath();// {'line',105,16, 105,38},
            ctx.moveTo(105, 16);
            ctx.lineTo(105, 38);
            ctx.moveTo(94, 27); // {'line',94,27,  116,27},
            ctx.lineTo(116, 27);
            ctx.stroke();
        ctx.restore();
    },
    none: ()=>{}
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
    'survivor',
    'zen'
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
        return ()=>{};
    }
    
    // try to find the png from /data/img/modeicons
    let img = new Image();
    img.src = `data/img/modeicons/${icon}.png`;
    
    // check if image exists
    if(!img.width) {
        return ()=>{};
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