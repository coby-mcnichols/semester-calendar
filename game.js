/* Visual-novel engine for the birthday story. The script lives in story.js. */
(function () {
  'use strict';

  const STAGE_W = 1536, STAGE_H = 1024;
  const SPRITE_SCALE = 0.8;      // sprite sheet pixels -> stage pixels
  const HABBI_SCALE = 0.98;      // Habbi is drawn 2% smaller than Parky
  const HABBI_SIT_SCALE = 0.97;  // ...and a further 3% smaller when sitting
  const TYPE_MS = 26;            // typewriter speed per character
  const HABBI_X = 800;           // Habbi's resting spot (stage px from left)
  const OFF_RIGHT = 1620;        // just outside the right edge
  const BACK = { bottom: 500, scale: 0.7, stopX: 470 };   // Habbi's run-up before the pounce

  const POSES = {
    parky: ['neutral', 'open', 'knife', 'angry', 'angry-open', 'sleep', 'peek', 'tongue', 'tilt'],
    habbi: ['neutral', 'open', 'run1', 'run2', 'pounce', 'shock', 'excited', 'reach', 'tilt'],
  };

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const el = {
    parky: $('parky'), habbi: $('habbi'),
    parkyImg: $('parky').querySelector('img'),
    habbiImg: $('habbi').querySelector('.sprite'),
    carry: $('habbi').querySelector('.carry'),
    textbox: $('textbox'), name: $('name'), text: $('text'),
    choices: $('choices'), card: $('card'), overlay: $('card-overlay'),
    title: $('title'), startHint: $('start-hint'), endHint: $('end-hint'), fade: $('fade'),
  };

  const sizes = {};              // "parky-neutral" -> natural width
  let index = -1;                // current beat
  let mode = 'loading';          // loading | title | play | busy | card | cardOpen | choice | end
  let typer = null;              // active typewriter {finish()}

  /* ---------- layout ---------- */
  function fit() {
    const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    stage.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  fit();

  /* ---------- assets ---------- */
  function preload() {
    const jobs = [];
    for (const who of Object.keys(POSES)) {
      for (const pose of POSES[who]) {
        const key = who + '-' + pose;
        jobs.push(new Promise((resolve) => {
          const img = new Image();
          img.onload = () => { sizes[key] = img.naturalWidth; resolve(); };
          img.onerror = () => { console.error('Missing sprite: ' + key); resolve(); };
          img.src = 'assets/' + key + '.png';
        }));
      }
    }
    return Promise.all(jobs);
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- characters ---------- */
  function setPose(who, pose) {
    const img = who === 'parky' ? el.parkyImg : el.habbiImg;
    const key = who + '-' + pose;
    if (img.dataset.pose === pose) return;
    img.dataset.pose = pose;
    img.src = 'assets/' + key + '.png';
    const sitting = !pose.startsWith('run') && pose !== 'pounce';
    const scale = SPRITE_SCALE * (who === 'habbi' ? HABBI_SCALE * (sitting ? HABBI_SIT_SCALE : 1) : 1);
    if (sizes[key]) img.style.width = Math.round(sizes[key] * scale) + 'px';
    // Sitting Habbi is mirrored so he faces Parky. Runs set their own direction.
    if (who === 'habbi' && !pose.startsWith('run')) el.habbi.classList.toggle('flip', pose !== 'pounce');
    restartAnim(el[who], 'pop');
  }

  function restartAnim(node, cls) {
    node.classList.remove('hop', 'pop');
    void node.offsetWidth;       // reflow so the animation restarts
    node.classList.add(cls);
  }

  function hop(who) {
    const list = who === 'both' ? ['parky', 'habbi'] : [who];
    list.forEach((w) => restartAnim(el[w], 'hop'));
  }

  /* Habbi's run cycle: swaps the two running frames while he moves. */
  async function runHabbi(fromX, toX, ms, faceLeft, back) {
    el.habbi.classList.remove('hidden');
    el.habbi.classList.toggle('flip', faceLeft);
    let frame = 0;
    setPose('habbi', 'run1');
    const cycle = setInterval(() => { frame ^= 1; setPose('habbi', frame ? 'run2' : 'run1'); }, 110);
    const depth = back ? { bottom: BACK.bottom + 'px', transform: 'scale(' + BACK.scale + ')' } : {};
    const anim = el.habbi.animate(
      [Object.assign({ left: fromX + 'px' }, depth), Object.assign({ left: toX + 'px' }, depth)],
      { duration: ms, easing: 'linear' }
    );
    await anim.finished.catch(() => {});
    clearInterval(cycle);
  }

  async function habbiEnter(instant) {
    if (!instant) await runHabbi(OFF_RIGHT, HABBI_X, 1000, true);
    el.habbi.classList.remove('hidden');
    setPose('habbi', 'neutral');
  }

  async function habbiExit(instant) {
    if (!instant) await runHabbi(HABBI_X, OFF_RIGHT, 800, false);
    el.habbi.classList.add('hidden');
    el.carry.classList.add('hidden');
  }

  async function habbiPounce(instant) {
    el.habbi.classList.remove('hidden');
    if (!instant) {
      // Runs in from the left, further back (behind Parky), then leaps forwards.
      el.habbi.style.zIndex = '1';
      await runHabbi(-420, BACK.stopX, 900, false, true);
      el.habbi.style.zIndex = '';
    }
    setPose('habbi', 'pounce');
    if (instant) return;
    const anim = el.habbi.animate(
      [
        { left: BACK.stopX + 'px', bottom: BACK.bottom + 'px', transform: 'scale(' + BACK.scale + ')' },
        { left: '700px', bottom: '470px', transform: 'scale(1.2) rotate(5deg)', offset: 0.6 },
        { left: HABBI_X + 'px', bottom: '300px', transform: 'scale(1) rotate(0deg)' },
      ],
      { duration: 620, easing: 'ease-in' }
    );
    setTimeout(() => restartAnim(el.parky, 'hop'), 380);
    await anim.finished.catch(() => {});
  }

  /* ---------- text box ---------- */
  function showText(speaker, line, isNarration) {
    el.textbox.classList.remove('hidden', 'nohint');
    el.textbox.classList.toggle('narr', isNarration);
    el.name.textContent = speaker || '';
    el.name.className = speaker === 'Parky' ? 'parky' : speaker === 'Habbi' ? 'habbi' : speaker ? 'both' : '';
    if (typer) typer.finish();

    let n = 0;
    el.text.textContent = '';
    el.textbox.classList.add('typing');
    const timer = setInterval(() => {
      n += 1;
      el.text.textContent = line.slice(0, n);
      if (n >= line.length) typer.finish();
    }, TYPE_MS);
    typer = {
      finish() {
        clearInterval(timer);
        el.text.textContent = line;
        el.textbox.classList.remove('typing');
        typer = null;
      },
    };
  }

  function hideText() {
    if (typer) typer.finish();
    el.textbox.classList.add('hidden');
  }

  /* ---------- beats ---------- */
  function findLabel(label) {
    const i = STORY.findIndex((b) => b.label === label);
    if (i < 0) throw new Error('Unknown label: ' + label);
    return i;
  }

  function nextIndex(i) {
    const beat = STORY[i];
    return beat && beat.goto ? findLabel(beat.goto) : i + 1;
  }

  /* Applies one beat. `instant` skips animation/text (used by ?beat= jumps). */
  async function apply(beat, instant) {
    if (beat.finale && !instant) {
      el.fade.classList.add('on');
      await sleep(520);
    }
    if (beat.finale) {
      stage.classList.add('finale');
      $('slice').classList.remove('on', 'for-habbi');
      ['banner', 'presents-l', 'presents-r', 'bowl-blue', 'bowl-green', 'cake'].forEach((id) => $(id).classList.add('on'));
    }

    if (beat.p) setPose('parky', beat.p);
    if (beat.h) setPose('habbi', beat.h);
    if (beat.carry === true) el.carry.classList.remove('hidden');
    if (beat.carry === false) el.carry.classList.add('hidden');
    if (beat.cake === 'cut') $('cake').src = 'assets/cake-cut.png';
    (beat.show || []).forEach((id) => $(id).classList.add('on'));
    (beat.hide || []).forEach((id) => $(id).classList.remove('on'));
    if (beat.takeSlice) {
      $('slice').classList.add('taken');
      if (instant) $('slice').classList.remove('on');
      else setTimeout(() => $('slice').classList.remove('on'), 750);
    }
    if (beat.giveSlice) {
      const slice = $('slice');
      slice.classList.remove('taken', 'on');
      slice.classList.add('for-habbi');
      void slice.offsetWidth;
      slice.classList.add('on');
    }

    if (beat.enter) { hideText(); await habbiEnter(instant); }
    if (beat.exit) { hideText(); await habbiExit(instant); }
    if (beat.pounce) { hideText(); await habbiPounce(instant); }

    if (beat.finale && !instant) el.fade.classList.remove('on');
    if (instant) return;

    if (beat.hop) hop(beat.hop);
    if (beat.say) showText(beat.say[0], beat.say[1], false);
    else if (beat.narr) showText('', beat.narr, true);
  }

  const isTimed = (beat) => beat.enter || beat.exit || beat.pounce;

  async function play(i) {
    index = i;
    const beat = STORY[i];
    if (!beat) return;

    mode = 'busy';
    await apply(beat, false);

    if (isTimed(beat)) return play(nextIndex(i));   // Habbi's runs continue on their own

    if (beat.card) {
      mode = 'card';
      el.card.classList.add('clickable');
      el.textbox.classList.add('nohint');
    } else if (beat.choice) {
      mode = 'choice';
      showChoices(beat.choice);
    } else if (beat.end) {
      mode = 'end';
      hideText();
      el.endHint.classList.remove('hidden');
    } else {
      mode = 'play';
    }
  }

  function advance() {
    if (mode === 'title') {
      el.title.classList.add('gone');
      play(0);
      return;
    }
    if (mode === 'cardOpen') { closeCard(); return; }
    if (mode !== 'play') return;
    if (typer) { typer.finish(); return; }          // first press completes the line
    play(nextIndex(index));
  }

  /* ---------- card ---------- */
  let cardOpenedAt = 0;
  function openCard() {
    if (mode !== 'card') return;
    mode = 'cardOpen';
    cardOpenedAt = Date.now();
    el.card.classList.remove('clickable', 'on');
    hideText();
    $('card-greeting').textContent = CARD.greeting;
    $('card-body').textContent = CARD.body;
    $('card-sign').textContent = CARD.sign;
    el.overlay.classList.remove('hidden');
    void el.overlay.offsetWidth;                    // paint the closed card first
    setTimeout(() => el.overlay.classList.add('open'), 350);
  }

  function closeCard() {
    if (Date.now() - cardOpenedAt < 1300) return;   // let the opening animation finish
    el.overlay.classList.add('hidden');
    el.overlay.classList.remove('open');
    play(nextIndex(index));
  }

  /* ---------- choices ---------- */
  function showChoices(options) {
    hideText();
    el.choices.innerHTML = '';
    options.forEach(([label, target], n) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const key = document.createElement('kbd');
      key.textContent = String(n + 1);
      btn.append(key, label);
      btn.addEventListener('click', (e) => { e.stopPropagation(); choose(target); });
      el.choices.appendChild(btn);
    });
    el.choices.classList.remove('hidden');
  }

  function choose(target) {
    if (mode !== 'choice') return;
    el.choices.classList.add('hidden');
    play(findLabel(target));
  }

  /* ---------- input ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (!e.repeat) advance();
    } else if (mode === 'choice' && (e.key === '1' || e.key === '2')) {
      const options = STORY[index].choice;
      choose(options[Number(e.key) - 1][1]);
    } else if (mode === 'end' && e.key.toLowerCase() === 'r') {
      location.href = location.pathname;
    }
  });

  el.card.addEventListener('click', (e) => { e.stopPropagation(); openCard(); });
  el.overlay.addEventListener('click', (e) => { e.stopPropagation(); if (mode === 'cardOpen') closeCard(); });
  stage.addEventListener('click', advance);         // click/tap also advances, for touch screens

  /* ---------- start ---------- */
  preload().then(async () => {
    setPose('parky', 'sleep');

    // Testing shortcut: index.html?beat=40 (optionally &pick=B) jumps straight to a beat.
    const params = new URLSearchParams(location.search);
    const jump = parseInt(params.get('beat'), 10);
    if (jump > 0 && jump < STORY.length) {
      const pick = (params.get('pick') || 'A').toUpperCase();
      let i = 0;
      while (i < jump) {
        await apply(STORY[i], true);
        if (STORY[i].card) el.card.classList.remove('on');
        i = STORY[i].choice ? findLabel(pick) : nextIndex(i);
      }
      el.title.classList.add('hidden');
      play(jump);
      return;
    }

    el.startHint.textContent = 'press SPACE to begin';
    mode = 'title';
  });
})();
