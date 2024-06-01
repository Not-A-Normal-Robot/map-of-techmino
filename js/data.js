// Static data

/**
 * @typedef {Object} Polyomino
 * @property {string} name
 * @property {number} mino_count
 * @property {number} width
 * @property {number} height
 * @property {number[][]} shape
 */

/** @type {Object<string, Polyomino>} */
export const POLYOMINO_OBJMAP = {
    Z: {
        name: "Z",
        mino_count: 4,
        width: 3,
        height: 2,
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    S: {
        name: "S",
        mino_count: 4,
        width: 3,
        height: 2,
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    J: {
        name: "J",
        mino_count: 4,
        width: 3,
        height: 2,
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ]
    },
    L: {
        name: "L",
        mino_count: 4,
        width: 3,
        height: 2,
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ]
    },
    T: {
        name: "T",
        mino_count: 4,
        width: 3,
        height: 2,
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    O: {
        name: "O",
        mino_count: 4,
        width: 2,
        height: 2,
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    I: {
        name: "I",
        mino_count: 4,
        width: 4,
        height: 1,
        shape: [
            [1, 1, 1, 1]
        ]
    },
    Z5: {
        name: "Z5",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ]
    },
    S5: {
        name: "S5",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [0, 1, 1],
            [0, 1, 0],
            [1, 1, 0]
        ]
    },
    P: {
        name: "P",
        mino_count: 5,
        width: 3,
        height: 2,
        shape: [
            [1, 1, 0],
            [1, 1, 1]
        ]
    },
    Q: {
        name: "Q",
        mino_count: 5,
        width: 3,
        height: 2,
        shape: [
            [0, 1, 1],
            [1, 1, 1]
        ]
    },
    F: {
        name: "F",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    },
    E: {
        name: "E",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 1, 0]
        ]
    },
    T5: {
        name: "T5",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 1]
        ]
    },
    U: {
        name: "U",
        mino_count: 5,
        width: 3,
        height: 2,
        shape: [
            [1, 0, 1],
            [1, 1, 1]
        ]
    },
    V: {
        name: "V",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [0, 0, 1],
            [0, 0, 1],
            [1, 1, 1]
        ]
    },
    W: {
        name: "W",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    X: {
        name: "X",
        mino_count: 5,
        width: 3,
        height: 3,
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]
    },
    J5: {
        name: "J5",
        mino_count: 5,
        width: 4,
        height: 2,
        shape: [
            [1, 0, 0, 0],
            [1, 1, 1, 1]
        ]
    },
    L5: {
        name: "L5",
        mino_count: 5,
        width: 4,
        height: 2,
        shape: [
            [0, 0, 0, 1],
            [1, 1, 1, 1]
        ]
    },
    R: {
        name: "R",
        mino_count: 5,
        width: 4,
        height: 2,
        shape: [
            [1, 1, 1, 1],
            [0, 1, 0, 0]
        ]
    },
    Y: {
        name: "Y",
        mino_count: 5,
        width: 4,
        height: 2,
        shape: [
            [1, 1, 1, 1],
            [0, 0, 1, 0]
        ]
    },
    N: {
        name: "N",
        mino_count: 5,
        width: 4,
        height: 2,
        shape: [
            [0, 1, 1, 1],
            [1, 1, 0, 0]
        ]
    },
    H: {
        name: "H",
        mino_count: 5,
        width: 4,
        height: 2,
        shape: [
            [1, 1, 1, 0],
            [0, 0, 1, 1]
        ]
    },
    I5: {
        name: "I5",
        mino_count: 5,
        width: 5,
        height: 1,
        shape: [
            [1, 1, 1, 1, 1]
        ]
    },
    I3: {
        name: "I3",
        mino_count: 3,
        width: 3,
        height: 1,
        shape: [
            [1, 1, 1]
        ]
    },
    C: {
        name: "C",
        mino_count: 3,
        width: 2,
        height: 2,
        shape: [
            [1, 1],
            [0, 1]
        ]
    },
    I2: {
        name: "I2",
        mino_count: 2,
        width: 2,
        height: 1,
        shape: [
            [1, 1]
        ]
    },
    O1: {
        name: "O1",
        mino_count: 1,
        width: 1,
        height: 1,
        shape: [
            [1]
        ]
    }
}

/** @type {Polyomino[]} */
export const POLYOMINO_LIST = POLYOMINO_OBJMAP.values();

export const CHARCODE_MAP = {
    zChan: {
        none: 0xF0000,
        normal: 0xF0001,
        full: 0xF0002,
        happy: 0xF0003,
        confused: 0xF0004,
        grinning: 0xF0005,
        frowning: 0xF0006,
        tears: 0xF0007,
        anxious: 0xF0008,
        rage: 0xF0009,
        fear: 0xF000A,
        question: 0xF000B,
        angry: 0xF000C,
        shocked: 0xF000D,
        ellipses: 0xF000E,
        sweatDrop: 0xF000F,
        cry: 0xF0010,
        cracked: 0xF0011,
        qualified: 0xF0012,
        unqualified: 0xF0013,
        understand: 0xF0014,
        thinking: 0xF0015,
        spark: 0xF0016,
    },
    mino: {
        Z: 0xF0040,
        S: 0xF0041,
        J: 0xF0042,
        L: 0xF0043,
        T: 0xF0044,
        O: 0xF0045,
        I: 0xF0046,

        Z5: 0xF0047,
        S5: 0xF0048,
        P: 0xF0049,
        Q: 0xF004A,
        F: 0xF004B,
        E: 0xF004C,
        T5: 0xF004D,
        U: 0xF004E,
        V: 0xF004F,
        W: 0xF0050,
        X: 0xF0051,
        J5: 0xF0052,
        L5: 0xF0053,
        R: 0xF0054,
        Y: 0xF0055,
        N: 0xF0056,
        H: 0xF0057,
        I5: 0xF0058,

        I3: 0xF0059,
        C: 0xF005A,
        I2: 0xF005B,
        O1: 0xF005C,
    },
    icon: {
        menu: 0xF0080,
        music: 0xF0081,
        language: 0xF0082,
        back: 0xF0083,
        play_pause: 0xF0084,
        info: 0xF0085,
        help: 0xF0086,
        mute: 0xF0087,
        volume_up: 0xF0088,
        volume_down: 0xF0089,
        retry_spin: 0xF008A,
        filledLogo: 0xF008B,
        hollowLogo: 0xF008C,
        toUp: 0xF008D,
        toDown: 0xF008E,
        toLeft: 0xF008F,
        toRight: 0xF0090,
        checkMark: 0xF0091,
        crossMark: 0xF0092,
        musicMark: 0xF0093,
        infoMark: 0xF0094,
        warnMark: 0xF0095,
        console: 0xF0096,
        globe: 0xF0097,
        video_camera: 0xF0098,
        settings: 0xF0099,
        mrz: 0xF009A,
        apple: 0xF009B,
        home: 0xF009C,
        cross_thick: 0xF009D,
        num0InSpin: 0xF009E,
        num1InSpin: 0xF009F,
        num2InSpin: 0xF00A0,
        num3InSpin: 0xF00A1,
        num4InSpin: 0xF00A2,
        play: 0xF00A3,
        pause: 0xF00A4,
        nextFrame: 0xF00A5,
        yen: 0xF00A6,
        dollar: 0xF00A7,
        euro: 0xF00A8,
        pound: 0xF00A9,
        bitcoin: 0xF00AA,
        onebag: 0xF00AB,
        export: 0xF00AC,
        import: 0xF00AD,
        trash: 0xF00AE,
        loadOne: 0xF00AF,
        saveOne: 0xF00B0,
        loadTwo: 0xF00B1,
        saveTwo: 0xF00B2,
        zBook: 0xF00B3,
        rankX: 0xF00B4,
        rankU: 0xF00B5,
        rankA: 0xF00B6,
        rankB: 0xF00B7,
        rankC: 0xF00B8,
        rankD: 0xF00B9,
        rankE: 0xF00BA,
        rankF: 0xF00BB,
        rankZ: 0xF00BC,
        rankS: 0xF00C2,
        speedOneEights: 0xF00BD,
        speedOneHalf: 0xF00BE,
        speedOne: 0xF00BF,
        speedTwo: 0xF00C0,
        speedFive: 0xF00C1,
        bone: 0xF00C3,
        invis: 0xF00C4,
        bomb: 0xF00C5,
        garbage: 0xF00C6,
        copy: 0xF00C7,
        tas: 0xF00C8,
        pencil: 0xF00C9,
        magGlass: 0xF00CA,
        zoomIn: 0xF00CB,
        zoomOut: 0xF00CC,
        zoomDefault: 0xF00CD,
        share: 0xF00CE,
        save: 0xF00CF,
        fastForward: 0xF00D0,
        rewind: 0xF00D1,
        nextSong: 0xF00D2,
        previousSong: 0xF00D3,
        cycle: 0xF00D4,
        cycleOne: 0xF00D5,
        cycleOff: 0xF00D6,
        random: 0xF00D7,
        randomOff: 0xF00D8,
        randomAuto: 0xF00D9,
        closedCaption: 0xF00DA,
        fullBeat: 0xF00DB,
        rewind10: 0xF00DC,
        rewind30: 0xF00DD,
        foward10: 0xF00DE,
        foward30: 0xF00DF,
        fontUp: 0xF00E0,
        fontDown: 0xF00E1,
        erase: 0xF00E2,
        auto: 0xF00E3,
    },
    key: {
        macCmd: 0xF0100,
        macOpt: 0xF0101,
        macCtrl: 0xF0102,
        shift: 0xF0103,
        capsLock: 0xF0104,
        enter_or_return: 0xF0105,
        backspace: 0xF0106,
        clear: 0xF0107,
        macFowardDel: 0xF0108,
        macEsc: 0xF0109,
        macTab: 0xF010A,
        fn: 0xF010B,
        macHome: 0xF010C,
        macEnd: 0xF010D,
        macPgup: 0xF010E,
        macPgdn: 0xF010F,
        macEnter: 0xF0110,
        space: 0xF0111,
        windows: 0xF0112,
        alt: 0xF0113,
        ctrl: 0xF0114,
        winMenu: 0xF0115,
        tab: 0xF0116,
        esc: 0xF0117,
        up: 0xF0118,
        down: 0xF0119,
        left: 0xF011A,
        right: 0xF011B,
        del: 0xF011C,
        enterText: 0xF011D,
        keyboard: 0xF011E,
        macMediaEject: 0xF011F,
        isoCtrl: 0xF0120,
        isoAlt: 0xF0121,
        macHomeAlt: 0xF0122,
        macEndAlt: 0xF0123,
        macPgupAlt: 0xF0124,
        macPgdnAlt: 0xF0125,
        iecPower: 0xF0126,
    },
    controller: {
        xbox: 0xF0180,
        lt: 0xF0181,
        rt: 0xF0182,
        lb: 0xF0183,
        rb: 0xF0184,
        xboxX: 0xF0185,
        xboxY: 0xF0186,
        xboxA: 0xF0187,
        xboxB: 0xF0188,
        joystickL: 0xF0189,
        joystickR: 0xF018A,
        jsLU: 0xF018B,
        jsLD: 0xF018C,
        jsLR: 0xF018D,
        jsLL: 0xF018E,
        jsRU: 0xF018F,
        jsRD: 0xF0190,
        jsRR: 0xF0191,
        jsRL: 0xF0192,
        jsLPress: 0xF0193,
        jsRPress: 0xF0194,
        dpad: 0xF0195,
        dpadU: 0xF0196,
        dpadD: 0xF0197,
        dpadL: 0xF0198,
        dpadR: 0xF0199,
        xboxView: 0xF019A,
        xboxMenu: 0xF019B,
        xboxShare: 0xF019C,
        xboxConnect: 0xF019D,
        ps: 0xF019E,
        psTriangle: 0xF019F,
        psCircle: 0xF01A0,
        psCross: 0xF01A1,
        psSquare: 0xF01A2,
        psMute: 0xF01A3,
        psCreate: 0xF01A4,
        psOption: 0xF01A5,
    }
}

/**
 * @type {{
 *   zChan: {
 *     none: string,
 *     normal: string,
 *     full: string,
 *     happy: string,
 *     confused: string,
 *     grinning: string,
 *     frowning: string,
 *     tears: string,
 *     anxious: string,
 *     rage: string,
 *     fear: string,
 *     question: string,
 *     angry: string,
 *     shocked: string,
 *     ellipses: string,
 *     sweatDrop: string,
 *     cry: string,
 *     cracked: string,
 *     qualified: string,
 *     unqualified: string,
 *     understand: string,
 *     thinking: string,
 *     spark: string,
 *   },
 *   mino: {
 *     Z: string,
 *     S: string,
 *     J: string,
 *     L: string,
 *     T: string,
 *     O: string,
 *     I: string,
 *     Z5: string,
 *     S5: string,
 *     P: string,
 *     Q: string,
 *     F: string,
 *     E: string,
 *     T5: string,
 *     U: string,
 *     V: string,
 *     W: string,
 *     X: string,
 *     J5: string,
 *     L5: string,
 *     R: string,
 *     Y: string,
 *     N: string,
 *     H: string,
 *     I5: string,
 *     I3: string,
 *     C: string,
 *     I2: string,
 *     O1: string,
 *   },
 *   icon: {
 *     menu: string,
 *     music: string,
 *     language: string,
 *     back: string,
 *     play_pause: string,
 *     info: string,
 *     help: string,
 *     mute: string,
 *     volume_up: string,
 *     volume_down: string,
 *     retry_spin: string,
 *     filledLogo: string,
 *     hollowLogo: string,
 *     toUp: string,
 *     toDown: string,
 *     toLeft: string,
 *     toRight: string,
 *     checkMark: string,
 *     crossMark: string,
 *     musicMark: string,
 *     infoMark: string,
 *     warnMark: string,
 *     console: string,
 *     globe: string,
 *     video_camera: string,
 *     settings: string,
 *    mrz: string,
 *     apple: string,
 *     home: string,
 *     cross_thick: string,
 *     num0InSpin: string,
 *     num1InSpin: string,
 *     num2InSpin: string,
 *     num3InSpin: string,
 *     num4InSpin: string,
 *     play: string,
 *     pause: string,
 *     nextFrame: string,
 *     yen: string,
 *     dollar: string,
 *     euro: string,
 *     pound: string,
 *     bitcoin: string,
 *     onebag: string,
 *     export: string,
 *     import: string,
 *     trash: string,
 *     loadOne: string,
 *     saveOne: string,
 *     loadTwo: string,
 *     saveTwo: string,
 *     zBook: string,
 *     rankX: string,
 *     rankU: string,
 *     rankA: string,
 *     rankB: string,
 *     rankC: string,
 *     rankD: string,
 *     rankE: string,
 *     rankF: string,
 *     rankZ: string,
 *     rankS: string,
 *     speedOneEights: string,
 *     speedOneHalf: string,
 *     speedOne: string,
 *     speedTwo: string,
 *     speedFive: string,
 *     bone: string,
 *     invis: string,
 *     bomb: string,
 *     garbage: string,
 *     copy: string,
 *     tas: string,
 *     pencil: string,
 *     magGlass: string,
 *     zoomIn: string,
 *     zoomOut: string,
 *     zoomDefault: string,
 *     share: string,
 *     save: string,
 *     fastForward: string,
 *     rewind: string,
 *     nextSong: string,
 *     previousSong: string,
 *     cycle: string,
 *     cycleOne: string,
 *     cycleOff: string,
 *     random: string,
 *     randomOff: string,
 *     randomAuto: string,
 *     closedCaption: string,
 *     fullBeat: string,
 *     rewind10: string,
 *     rewind30: string,
 *     foward10: string,
 *     foward30: string,
 *     fontUp: string,
 *     fontDown: string,
 *     erase: string
 *   },
 *   key: {
 *     macCmd: string,
 *     macOpt: string,
 *     macCtrl: string,
 *     shift: string,
 *     capsLock: string,
 *     enter_or_return: string,
 *     backspace: string,
 *     clear: string,
 *     macFowardDel: string,
 *     macEsc: string,
 *     macTab: string,
 *     fn: string,
 *     macHome: string,
 *     macEnd: string,
 *     macPgup: string,
 *     macPgdn: string,
 *     macEnter: string,
 *     space: string,
 *     windows: string,
 *     alt: string,
 *     ctrl: string,
 *     winMenu: string,
 *     tab: string,
 *     esc: string,
 *     up: string,
 *     down: string,
 *     left: string,
 *     right: string,
 *     del: string,
 *     enterText: string,
 *     keyboard: string,
 *     macMediaEject: string,
 *     isoCtrl: string,
 *     isoAlt: string,
 *     macHomeAlt: string,
 *     macEndAlt: string,
 *     macPgupAlt: string,
 *     macPgdnAlt: string,
 *     iecPower: string,
 *   },
 *   controller: {
 *     xbox: string,
 *     lt: string,
 *     rt: string,
 *     lb: string,
 *     rb: string,
 *     xboxX: string,
 *     xboxY: string,
 *     xboxA: string,
 *     xboxB: string,
 *     joystickL: string,
 *     joystickR: string,
 *     jsLU: string,
 *     jsLD: string,
 *     jsLR: string,
 *     jsLL: string,
 *     jsRU: string,
 *     jsRD: string,
 *     jsRR: string,
 *     jsRL: string,
 *     jsLPress: string,
 *     jsRPress: string,
 *     dpad: string,
 *     dpadU: string,
 *     dpadD: string,
 *     dpadL: string,
 *     dpadR: string,
 *     xboxView: string,
 *     xboxMenu: string,
 *     xboxShare: string,
 *     xboxConnect: string,
 *     ps: string,
 *     psTriangle: string,
 *     psCircle: string,
 *     psCross: string,
 *     psSquare: string,
 *     psMute: string,
 *     psCreate: string,
 *     psOption: string,
 *   }
 * }}
 */
export const CHARACTER_MAP = {};

// Traverse through CHARCODE_MAP and create character map (actual characters, not charcodes)
for (const [charType, charObj] of Object.entries(CHARCODE_MAP)) {
    CHARACTER_MAP[charType] = {};
    for (const [charName, charCode] of Object.entries(charObj)) {
        CHARACTER_MAP[charType][charName] = String.fromCodePoint(charCode);
    }
}