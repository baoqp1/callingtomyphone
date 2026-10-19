/* =========================================================
   20.10 — A LITTLE SOMETHING FOR YOU
   SCRIPT.JS
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const AVATAR = 'images/avatar.jpg';

const TRACKS = [
    {
        t: 'Anh Nhà Ở Đâu Thế?',
        src: 'music/anh-nha-o-dau-the.mp3',
        d: 222
    },
    {
        t: 'Mộng Yu',
        src: 'music/mong-yu.mp3',
        d: 210
    },
    {
        t: 'Tình Đắng Như Ly Cà Phê',
        src: 'music/tinh-dang-nhu-ly-ca-phe.mp3',
        d: 210
    },
    {
        t: 'Nơi Này Có Anh',
        src: 'music/noi-nay-co-anh.mp3',
        d: 220
    }
];


/* =========================================================
   HELPERS
========================================================= */

const $ = id => document.getElementById(id);

const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));


/* =========================================================
   AVATAR
========================================================= */

document.querySelectorAll('.av').forEach(av => {

    av.style.backgroundImage =
        `url("${AVATAR}")`;

    if (!av.classList.contains('in')) {

        setTimeout(() => {
            av.classList.add('in');
        }, 80);

    }

});


/* =========================================================
   SCENE SYSTEM
========================================================= */

let cur = $('s-open');

let run = 0;


function go(id) {

    run++;

    document
        .querySelectorAll('.scene')
        .forEach(scene => {
            scene.classList.remove('on');
        });


    cur = $('s-' + id);


    if (!cur) {
        console.warn('Scene not found:', id);
        return;
    }


    cur.classList.add('on');


    const chapter =
        [
            'smile',
            'music',
            'happy',
            'foryou'
        ].includes(id);


    $('back').style.display =
        chapter ? 'block' : 'none';

}


/* =========================================================
   TEXT SEQUENCE
========================================================= */

async function seq(el, lines, my = run) {

    if (!el) return false;


    el.innerHTML = '';


    for (const item of lines) {

        if (my !== run) {
            return false;
        }


        const text = item[0];

        const pause =
            item[1] ?? 1300;

        const cls =
            item[2] ?? '';


        const d =
            document.createElement('div');


        d.className =
            'ln ' + cls;


        d.textContent =
            text;


        el.appendChild(d);


        await sleep(40);


        d.classList.add('in');


        await sleep(pause);

    }


    return my === run;

}


/* =========================================================
   BACKGROUND STARS
========================================================= */

const cv = $('bg');

const cx = cv.getContext('2d');

let W = 0;
let H = 0;

let stars = [];


function resizeCanvas() {

    W = cv.width = innerWidth;

    H = cv.height = innerHeight;


    stars =
        Array.from(
            {
                length:
                    Math.round(
                        W * H / 9000
                    )
            },
            () => ({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.3 + .2,
                p: Math.random() * 6
            })
        );

}


addEventListener(
    'resize',
    resizeCanvas
);


resizeCanvas();


(function animateStars(t) {

    cx.clearRect(
        0,
        0,
        W,
        H
    );


    for (const s of stars) {

        cx.fillStyle =
            `rgba(
                210,
                200,
                255,
                ${.3 + .35 *
                Math.sin(
                    t / 1200 + s.p
                )}
            )`;


        cx.beginPath();


        cx.arc(
            s.x,
            s.y,
            s.r,
            0,
            Math.PI * 2
        );


        cx.fill();

    }


    requestAnimationFrame(
        animateStars
    );

})(0);


/* =========================================================
   BACKGROUND ROSES
========================================================= */

[
    [8, 6],
    [78, 12],
    [12, 70],
    [80, 74],
    [44, 86]
].forEach(([x, y], i) => {

    const flower =
        document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );


    flower.setAttribute(
        'class',
        'bgf rose'
    );


    flower.style.left =
        x + '%';


    flower.style.top =
        y + '%';


    flower.style.animationDelay =
        i * .8 + 's';


    flower.innerHTML =
        '<use href="#rose"></use>';


    document.body.appendChild(
        flower
    );

});


/* =========================================================
   OPENING
========================================================= */

$('openbtn').onclick = async () => {

    document
        .querySelectorAll('.bgf')
        .forEach(f =>
            f.classList.add('lit')
        );


    go('intro');


    const my = run;


    await sleep(1000);


    if (my !== run) return;


    const ok =
        await seq(
            $('introseq'),
            [
                [
                    'Này bà.',
                    1400
                ],

                [
                    'Tôi nghĩ mãi xem 20/10 nên tặng bà cái gì.',
                    1700
                ],

                [
                    'Hoa?',
                    900
                ],

                [
                    'Quà?',
                    900
                ],

                [
                    'Hay một lời chúc thật dài?',
                    1800
                ],

                [
                    'Cuối cùng tôi chọn cách hơi khác một chút.',
                    1900
                ],

                [
                    'Tôi làm cái này. 😌',
                    1800,
                    'hl'
                ]
            ],
            my
        );


    if (!ok) return;


    go('menu');

};


/* =========================================================
   MENU
========================================================= */

document
    .querySelectorAll('.card')
    .forEach(card => {

        card.onclick = () => {

            chapter(
                card.dataset.go
            );

        };

    });


function chapter(k) {

    go(k);


    if (k === 'smile') {
        smile();
    }


    if (k === 'music') {
        music();
    }


    if (k === 'happy') {
        happy();
    }


    if (k === 'foryou') {
        foryou();
    }

}


/* =========================================================
   BACK
========================================================= */

$('back').onclick = () => {

    stopMusic();

    go('menu');

};


/* =========================================================
   01 — SMILE
========================================================= */

let smileCount = 0;

let smileLocked = false;


async function smile() {

    const my = run;


    $('smilegame')
        .classList.remove('show');


    $('smileseq').innerHTML = '';

    $('smileend').innerHTML = '';


    $('smilecontinue').style.display =
        'none';


    await sleep(600);


    const ok =
        await seq(
            $('smileseq'),
            [
                [
                    'Có một điều tôi khá thích ở bà.',
                    1500
                ],

                [
                    'Là lúc bà cười.',
                    1600
                ],

                [
                    'Nên tôi có một thử thách nhỏ.',
                    1500
                ],

                [
                    'Bắt đủ 8 nụ cười nhé. 😉',
                    1200,
                    'hl'
                ]
            ],
            my
        );


    if (!ok) return;


    $('smileseq').innerHTML = '';


    $('smilegame')
        .classList.add('show');


    startSmileGame(my);

}


/* =========================================================
   SMILE GAME
========================================================= */

function startSmileGame(my) {

    smileCount = 0;

    smileLocked = false;


    const area =
        $('gamearea');


    area.innerHTML = '';


    $('smilescore').textContent =
        '0 / 8';


    spawnSmile(my);

}


function spawnSmile(my) {

    if (
        my !== run ||
        smileCount >= 8
    ) {
        return;
    }


    const area =
        $('gamearea');


    const smile =
        document.createElement('div');


    smile.className =
        'smile-target';


    smile.textContent =
        '😊';


    const difficulty =
        smileCount;


    const size =
        Math.max(
            34,
            62 - difficulty * 4
        );


    smile.style.width =
        size + 'px';


    smile.style.height =
        size + 'px';


    smile.style.fontSize =
        size * .55 + 'px';


    const maxX =
        Math.max(
            0,
            area.clientWidth - size
        );


    const maxY =
        Math.max(
            0,
            area.clientHeight - size
        );


    smile.style.left =
        Math.random() * maxX + 'px';


    smile.style.top =
        Math.random() * maxY + 'px';


    area.appendChild(smile);


    const life =
        Math.max(
            900,
            1900 - difficulty * 120
        );


    let removed = false;


    const removeTarget = () => {

        if (removed) return;


        removed = true;

        smile.remove();


        if (my === run) {
            spawnSmile(my);
        }

    };


    smile.onclick = () => {

        if (
            smileLocked ||
            my !== run ||
            removed
        ) {
            return;
        }


        smileLocked = true;


        smile.classList.add('hit');


        smileCount++;


        $('smilescore').textContent =
            smileCount + ' / 8';


        const x =
            parseFloat(
                smile.style.left
            ) + size / 2;


        const y =
            parseFloat(
                smile.style.top
            ) + size / 2;


        createSmileParticles(
            x,
            y
        );


        createGlowRose(
            x,
            y
        );


        setTimeout(() => {

            if (removed) {
                smileLocked = false;
                return;
            }


            removed = true;

            smile.remove();

            smileLocked = false;


            if (
                smileCount >= 8
            ) {

                finishSmileGame(my);

            } else {

                spawnSmile(my);

            }

        }, 420);

    };


    setTimeout(
        removeTarget,
        life
    );

}


/* =========================================================
   SMILE PARTICLES
========================================================= */

function createSmileParticles(x, y) {

    const area =
        $('gamearea');


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const p =
            document.createElement(
                'span'
            );


        p.className =
            'smile-particle';


        p.textContent =
            '✦';


        p.style.left =
            x + 'px';


        p.style.top =
            y + 'px';


        p.style.setProperty(
            '--dx',
            `${(
                Math.random() * 80 - 40
            )}px`
        );


        p.style.setProperty(
            '--dy',
            `${(
                Math.random() * 80 - 40
            )}px`
        );


        area.appendChild(p);


        setTimeout(
            () => p.remove(),
            900
        );

    }

}


/* =========================================================
   ROSE HIT
========================================================= */

function createGlowRose(x, y) {

    const area =
        $('gamearea');


    const rose =
        document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );


    rose.classList.add(
        'hit-rose'
    );


    rose.style.left =
        (x - 28) + 'px';


    rose.style.top =
        (y - 28) + 'px';


    rose.innerHTML =
        '<use href="#rose"></use>';


    area.appendChild(
        rose
    );


    setTimeout(
        () => rose.remove(),
        1000
    );

}


/* =========================================================
   SMILE FINISH
========================================================= */

async function finishSmileGame(my) {

    if (my !== run) return;


    await sleep(600);


    $('smilegame')
        .classList.remove('show');


    await sleep(700);


    if (my !== run) return;


    const ok =
        await seq(
            $('smileend'),
            [
                [
                    'You got them all.',
                    1300
                ],

                [
                    'Giỏi ghê. 😌',
                    1300
                ],

                [
                    'Nhưng thật ra...',
                    1300
                ],

                [
                    'tôi chỉ muốn bà cười thôi.',
                    1700,
                    'hl'
                ],

                [
                    'Nên mong bà lúc nào cũng có một lý do để cười.',
                    1700
                ]
            ],
            my
        );


    if (!ok) return;


    $('smilecontinue').style.display =
        'block';

}


$('smilecontinue').onclick = () => {

    go('menu');

};


/* =========================================================
   02 — MUSIC
========================================================= */

let ti = 0;

let playing = false;

let pos = 0;

let sim = false;

let musicSeen = false;


const au =
    new Audio();


au.volume = .8;


au.onerror = () => {

    sim = true;

};


$('wave').innerHTML =
    '<i></i>'.repeat(24);


document
    .querySelectorAll('#wave i')
    .forEach((bar, i) => {

        bar.style.animationDelay =
            (i % 7) * .12 + 's';

    });


$('pl').innerHTML =
    TRACKS
        .map(
            (t, i) =>
                `<div data-i="${i}">
                    0${i + 1} — ${t.t}
                </div>`
        )
        .join('');


$('pl').onclick = e => {

    const item =
        e.target.closest('[data-i]');


    if (!item) return;


    loadTrack(
        Number(item.dataset.i),
        true
    );

};


function fmt(seconds) {

    return (
        Math.floor(seconds / 60) +
        ':' +
        String(
            Math.floor(seconds % 60)
        ).padStart(2, '0')
    );

}


function loadTrack(
    i,
    shouldPlay
) {

    ti =
        (i + TRACKS.length) %
        TRACKS.length;


    const track =
        TRACKS[ti];


    pos = 0;


    sim = !track.src;


    au.src =
        track.src || '';


    if (track.src) {
        au.load();
    }


    $('tname').textContent =
        '♪ ' + track.t;


    $('tdur').textContent =
        fmt(track.d);


    $('seek').value = 0;

    $('tcur').textContent =
        '0:00';


    document
        .querySelectorAll('#pl div')
        .forEach((d, j) => {

            d.classList.toggle(
                'cur',
                j === ti
            );

        });


    setPlay(
        shouldPlay
    );

}


function setPlay(state) {

    playing = state;


    $('pp').textContent =
        state ? '⏸' : '▶';


    $('ring')
        .classList.toggle(
            'pulse',
            state
        );


    $('player')
        .classList.toggle(
            'playing',
            state
        );


    if (
        state &&
        !sim
    ) {

        au.play()
            .catch(() => {
                sim = true;
            });

    } else {

        au.pause();

    }

}


function stopMusic() {

    playing = false;

    au.pause();


    try {
        au.currentTime = 0;
    } catch (_) {}


    $('pp').textContent =
        '▶';


    $('ring')
        .classList.remove(
            'pulse'
        );


    $('player')
        .classList.remove(
            'playing'
        );

}


$('pp').onclick = () => {

    setPlay(
        !playing
    );

};


$('prev').onclick = () => {

    loadTrack(
        ti - 1,
        playing
    );

};


$('next').onclick = () => {

    loadTrack(
        ti + 1,
        playing
    );

};


$('vol').oninput = e => {

    au.volume =
        Number(
            e.target.value
        );

};


$('seek').oninput = e => {

    const percent =
        Number(
            e.target.value
        ) / 100;


    const duration =
        au.duration ||
        TRACKS[ti].d;


    pos =
        percent * duration;


    if (
        !sim &&
        au.duration
    ) {

        au.currentTime =
            percent * au.duration;

    }

};


setInterval(() => {

    if (!playing) return;


    let duration =
        TRACKS[ti].d;


    if (sim) {

        pos += .25;

    } else {

        pos =
            au.currentTime;

        duration =
            au.duration ||
            duration;

    }


    if (
        pos >= duration ||
        au.ended
    ) {

        loadTrack(
            ti + 1,
            true
        );

        return;

    }


    $('seek').value =
        pos / duration * 100;


    $('tcur').textContent =
        fmt(pos);

}, 250);


/* =========================================================
   MUSIC CHAPTER
========================================================= */

async function music() {

    const my = run;


    $('player')
        .classList.remove('in');


    $('musicseq').innerHTML = '';

    $('musicend').innerHTML = '';


    $('musiccontinue').style.display =
        'none';


    await sleep(600);


    const ok =
        await seq(
            $('musicseq'),
            [
                [
                    'Có những người gặp nhau rồi nói chuyện.',
                    1600
                ],

                [
                    'Có những người gặp nhau rồi...',
                    1500
                ],

                [
                    'hát. 🎤',
                    1300,
                    'hl'
                ]
            ],
            my
        );


    if (!ok) return;


    if (!musicSeen) {

        loadTrack(
            0,
            false
        );

        musicSeen = true;

    }


    $('musicseq').innerHTML = '';


    $('player')
        .classList.add('in');


    await sleep(800);


    if (my !== run) return;


    const ok2 =
        await seq(
            $('musicend'),
            [
                [
                    'Có những bài nghe một mình cũng hay.',
                    1600
                ],

                [
                    'Nhưng có vài bài...',
                    1300
                ],

                [
                    'nghe cùng một người thì vui hơn. 😉',
                    1700,
                    'hl'
                ],

                [
                    'Bà tự chọn một bài đi.',
                    1400
                ]
            ],
            my
        );


    if (!ok2) return;


    $('musiccontinue').style.display =
        'block';

}


$('musiccontinue').onclick = () => {

    stopMusic();

    go('menu');

};


/* =========================================================
   03 — HAPPINESS
========================================================= */

const WISH = [

    [
        'Bình yên',
        'Mong những ngày mệt mỏi rồi cũng có lúc được nghỉ ngơi.'
    ],

    [
        'May mắn',
        'Mong những điều bà cố gắng đều gặp được một chút may mắn.'
    ],

    [
        'Niềm vui',
        'Mong mỗi ngày đều có ít nhất một chuyện khiến bà phải mỉm cười.'
    ]

];


async function happy() {

    const my = run;


    $('happyseq').innerHTML = '';

    $('happy2').innerHTML = '';

    $('fl3').innerHTML = '';


    $('happycontinue').style.display =
        'none';


    $('fl3').style.opacity = 0;


    let opened = 0;


    await sleep(600);


    const ok =
        await seq(
            $('happyseq'),
            [
                [
                    'Tôi không biết 20/10 có thể chúc bà bao nhiêu thứ.',
                    1700
                ],

                [
                    'Nên tôi gói chúng lại thành ba bông hoa.',
                    1600
                ],

                [
                    'Mở từng bông nhé.',
                    1200,
                    'hl'
                ]
            ],
            my
        );


    if (!ok) return;


    $('fl3').style.transition =
        'opacity 1.2s';


    $('fl3').style.opacity =
        1;


    $('fl3').innerHTML =
        WISH
            .map(
                (w, i) => {

                    return `
                        <div
                            class="fl"
                            data-i="${i}"
                        >

                            <svg
                                class="rose"
                                viewBox="0 0 100 100"
                            >
                                <use href="#rose"></use>
                            </svg>

                            <div>
                                0${i + 1} — ${w[0]}
                            </div>

                        </div>
                    `;

                }
            )
            .join('');


    $('fl3').onclick =
        async e => {

            const flower =
                e.target.closest(
                    '.fl'
                );


            if (
                !flower ||
                flower.classList.contains(
                    'open'
                )
            ) {
                return;
            }


            flower.classList.add(
                'open'
            );


            const text =
                document.createElement(
                    'div'
                );


            text.className =
                'ln in';


            text.style.marginTop =
                '8px';


            text.textContent =
                WISH[
                    Number(
                        flower.dataset.i
                    )
                ][1];


            flower.appendChild(
                text
            );


            flower.style.width =
                '200px';


            opened++;


            if (opened !== 3) {
                return;
            }


            await sleep(1400);


            if (my !== run) return;


            const ok2 =
                await seq(
                    $('happy2'),
                    [
                        [
                            'Còn một điều nữa...',
                            1500
                        ],

                        [
                            'Mong bà luôn gặp được những người khiến bà cảm thấy mình được trân trọng.',
                            2000,
                            'hl'
                        ]
                    ],
                    my
                );


            if (!ok2) return;


            $('happycontinue').style.display =
                'block';

        };

}


$('happycontinue').onclick = () => {

    go('menu');

};


/* =========================================================
   04 — FOR YOU
========================================================= */

let foryouOpened = false;


async function foryou() {

    const my = run;


    foryouOpened = false;


    $('foryouseq').innerHTML = '';


    $('foryoubox').classList.remove(
        'opened'
    );


    $('foryouopen').style.display =
        'inline-block';


    $('foryoucontinue').style.display =
        'none';


    await sleep(700);


    const ok =
        await seq(
            $('foryouseq'),
            [
                [
                    'Có một điều cuối cùng tôi muốn dành cho bà.',
                    1800
                ],

                [
                    'Không phải một món quà.',
                    1500
                ],

                [
                    'Chỉ là một lời chúc thôi.',
                    1600,
                    'hl'
                ]
            ],
            my
        );


    if (!ok) return;

}


$('foryouopen').onclick =
    async () => {

        if (foryouOpened) {
            return;
        }


        foryouOpened = true;


        const my = run;


        $('foryouopen').style.display =
            'none';


        $('foryoubox')
            .classList.add('opened');


        await sleep(500);


        if (my !== run) return;


        const ok =
            await seq(
                $('foryouseq'),
                [
                    [
                        'Chúc bà một ngày 20/10 thật vui.',
                        1800,
                        'hl'
                    ],

                    [
                        'Mong bà luôn được yêu thương,',
                        1500
                    ],

                    [
                        'được trân trọng,',
                        1300
                    ],

                    [
                        'và luôn có những người thật lòng ở bên.',
                        1800
                    ],

                    [
                        'Mong những điều bà mong muốn',
                        1400
                    ],

                    [
                        'rồi sẽ có ngày trở thành hiện thực.',
                        1800,
                        'hl'
                    ],

                    [
                        'Và quan trọng nhất...',
                        1500
                    ],

                    [
                        'mong bà luôn có thật nhiều lý do để cười. 🌸',
                        2200,
                        'hl'
                    ]
                ],
                my
            );


        if (!ok) return;


        $('foryoucontinue').style.display =
            'block';

    };


/* =========================================================
   FOR YOU → FINAL
========================================================= */

$('foryoucontinue').onclick =
    async () => {

        const my =
            run;


        $('foryoucontinue')
            .style.display =
            'none';


        go('final');


        await sleep(800);


        if (my !== run) return;


        const ok =
            await seq(
                $('finalseq'),
                [
                    [
                        'Happy 20/10, bà nhé.',
                        2000,
                        'hl'
                    ],

                    [
                        'Mong bà luôn vui.',
                        1400
                    ],

                    [
                        'Mong bà luôn có lý do để cười.',
                        1500
                    ],

                    [
                        'Và mong những ngày bình thường của bà',
                        1300
                    ],

                    [
                        'cũng có thật nhiều điều đáng nhớ.',
                        1800
                    ],

                    [
                        'Còn nếu một ngày bà cần người hát cùng...',
                        1800
                    ],

                    [
                        'tôi vẫn ở đây. 🎤😉',
                        2200,
                        'hl'
                    ]
                ],
                my
            );


        if (!ok) return;


        await sleep(1000);


        if (my !== run) return;


        go('end');


        $('s-end')
            .classList.add('fin');


        await sleep(1800);


        if (my !== run) return;


        $('replay').style.opacity =
            '1';

    };


/* =========================================================
   REPLAY
========================================================= */

$('replay').onclick = () => {

    stopMusic();


    $('s-end')
        .classList.remove('fin');


    $('replay').style.opacity =
        '0';


    /* RESET SMILE */

    $('smilegame')
        .classList.remove('show');


    $('gamearea').innerHTML =
        '';


    $('smileseq').innerHTML =
        '';


    $('smileend').innerHTML =
        '';


    $('smilecontinue').style.display =
        'none';


    /* RESET MUSIC */

    $('musicseq').innerHTML =
        '';


    $('musicend').innerHTML =
        '';


    $('musiccontinue').style.display =
        'none';


    /* RESET HAPPINESS */

    $('happyseq').innerHTML =
        '';


    $('happy2').innerHTML =
        '';


    $('fl3').innerHTML =
        '';


    $('happycontinue').style.display =
        'none';


    /* RESET FOR YOU */

    $('foryouseq').innerHTML =
        '';


    $('foryoubox')
        .classList.remove(
            'opened'
        );


    $('foryouopen').style.display =
        'inline-block';


    $('foryoucontinue').style.display =
        'none';


    foryouOpened = false;


    /* RESET FINAL */

    $('finalseq').innerHTML =
        '';


    /* MUSIC RESET */

    musicSeen = false;

    ti = 0;

    pos = 0;

    sim = false;


    /* BACK TO START */

    go('open');

};