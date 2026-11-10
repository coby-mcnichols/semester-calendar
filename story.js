/* ============================================================
   STORY SCRIPT — Parky & Habbi's birthday story
   Follows Storyline.txt. Edit lines here; game.js plays them.

   Each entry is one "beat". The player presses SPACE to move to
   the next beat. Beats marked enter / exit / pounce are Habbi's
   run-ons: they play on a timer and continue by themselves.

     p / h     pose for Parky / Habbi (file assets/<cat>-<pose>.png)
     say       [speaker, line]      narr   stage direction (italic)
     hop       'parky' | 'habbi' | 'both'  (little jump for shouting)
   ============================================================ */

/* Mommy's card. Text between the backticks appears exactly as typed,
   line breaks included. */
const CARD = {
  greeting: `To my dearest and brightest Coby,`,
  body: `I love you more than I can express.

I hope this coming year brings you many blessings.
I hope you don't worry for your health.
I hope you get even closer to The Lord.
I hope you're full of joy and everything you set your mind to will be more fruitful than you predict.

I wish all the best for you, my King.`,
  sign: `Yours forever and ever,
Your future wife,
Melka soon-to-be McNichols`,
};

const P = 'Parky', H = 'Habbi', BOTH = 'Parky & Habbi';

const STORY = [
  /* ---------------- ACT 1 — WHERE HAVE YOU BEEN? ---------------- */
  { p: 'sleep', narr: 'Parky is curled into a ball, sleeping peacefully.' },
  { p: 'peek', narr: 'He slowly opens one eye… and notices Daddy.' },
  { say: [P, '...'] },
  { p: 'neutral', narr: 'He sits up.' },
  { p: 'open', say: [P, "Oh. You're here."] },

  { p: 'neutral', narr: 'Parky looks at Daddy.' },
  { p: 'angry', narr: 'His expression suddenly changes.' },
  { p: 'angry-open', hop: 'parky', say: [P, 'WHERE WERE YOU!?'] },
  { p: 'angry-open', say: [P, 'The lunatic has been running all over the place! I wanted to sleep! He kept tackling me! And running into things! And making noise!'] },
  { p: 'angry', say: [P, 'Honestly, Father. I cannot live like this.'] },

  { enter: true },
  { h: 'open', hop: 'habbi', say: [H, 'MOVEMENT?! WHERE?!'] },
  { h: 'shock', narr: 'He notices Daddy.' },
  { h: 'excited', hop: 'habbi', say: [H, "OH! IT'S DADDY!"] },
  { h: 'open', say: [H, "WHAT'S OVER THERE?!"] },
  { exit: true },
  { p: 'angry', narr: 'Parky remains thoroughly unimpressed.' },

  { p: 'neutral', say: [P, 'Anyway.'] },
  { narr: '…' },
  { p: 'open', say: [P, 'I want to cuddle.'] },
  { p: 'tongue', say: [P, 'Give it to me now, Daddy. I want cuddle now.'] },

  /* ---------------- ACT 2 — THE PLAN ---------------- */
  { enter: true },
  { h: 'open', hop: 'habbi', say: [H, 'HEYYYYY!'] },
  { h: 'excited', say: [H, 'Soooo... wanna play?!'] },
  { h: 'neutral', p: 'neutral', narr: '…' },
  { h: 'tilt', say: [H, 'Wait... cuddle?'] },
  { h: 'shock', say: [H, 'Oh no... better run!'] },
  { exit: true },

  { p: 'tilt', say: [P, 'He drives me crazy, Dad.'] },
  { p: 'open', say: [P, "He's so dumb. He doesn't even know what day it is today."] },
  { p: 'neutral', say: [P, "Honestly, I don't know how I put up with him."] },

  { p: 'knife', narr: 'Parky produces a large kitchen knife.' },
  { p: 'knife', say: [P, "I'm hungry, Father."] },
  { p: 'knife', hop: 'parky', narr: 'He holds up the knife.' },
  { p: 'knife', say: [P, 'Do you know what day it is today?'] },
  { narr: '…' },

  { pounce: true },
  { hop: 'habbi', say: [H, 'BROTHER!!!!'] },
  { p: 'angry', narr: 'Parky drops the knife.' },
  { p: 'angry-open', hop: 'parky', say: [P, 'YOU FORGOT THE PLAN!?'] },
  { h: 'shock', narr: 'Habbi freezes.' },
  { h: 'open', say: [H, 'AH! YES! PLAN!'] },
  { h: 'excited', hop: 'habbi', say: [H, 'YES YES YES! THE PLAN!'] },
  { exit: true },

  { p: 'neutral', narr: 'Parky looks back at Daddy.' },
  { p: 'open', say: [P, 'I live with an idiot.'] },
  { p: 'neutral', narr: '…' },
  { p: 'open', say: [P, 'Anyway, Father. Where were we?'] },

  /* ---------------- ACT 3 — THE SURPRISE ---------------- */
  { enter: true, carry: true, p: 'neutral' },
  { h: 'excited', hop: 'habbi', say: [H, 'I GOT IT! I GOT IT! I GOT IT!'] },
  { h: 'neutral', carry: false, show: ['cake'], narr: 'He places the cake in the centre.' },
  { p: 'open', say: [P, 'Finally.'] },

  { p: 'neutral', h: 'neutral', narr: 'Both cats look towards Daddy.' },
  { p: 'open', h: 'excited', hop: 'both', say: [BOTH, 'HAPPY BIRTHDAY, DADDY!!!'] },
  { p: 'knife', h: 'neutral', narr: 'Parky lifts the knife…' },
  { p: 'knife', hop: 'parky', cake: 'cut', show: ['slice'], narr: '…and cuts the cake. A slice appears.' },
  { p: 'neutral', takeSlice: true, narr: 'Daddy takes a slice.' },
  { h: 'reach', narr: 'Habbi immediately reaches towards it.' },
  { h: 'reach', hop: 'habbi', say: [H, 'OOOH! CAKE!'] },
  { p: 'open', h: 'neutral', say: [P, 'Of course you want the cake.'] },

  { p: 'neutral', narr: 'Parky suddenly remembers something.' },
  { p: 'open', hop: 'parky', say: [P, 'Oh! Wait!'] },
  { p: 'open', h: 'excited', say: [P, 'Mommy was here earlier. She left you something!'] },
  { p: 'neutral', show: ['card'], narr: 'A birthday card appears in front of the cats.' },
  { p: 'open', say: [P, "It's for you, Daddy."] },
  { p: 'neutral', card: true, narr: 'Click the card to open it.' },

  /* ---------------- ACT 4 — A LITTLE CELEBRATION ---------------- */
  { p: 'tilt', h: 'excited', say: [P, 'Well?'] },
  { p: 'open', say: [P, 'You should enjoy your birthday.'] },
  { p: 'neutral', h: 'excited', hop: 'habbi', say: [H, "AND CAKE! DON'T FORGET CAKE!"] },

  { h: 'reach', choice: [['Give Habbi some cake', 'A'], ['Do not give Habbi cake', 'B']] },

  { label: 'A', h: 'excited', giveSlice: true, narr: 'Habbi receives his slice.' },
  { h: 'excited', hop: 'habbi', say: [H, 'FOR ME?!'] },
  { h: 'open', say: [H, 'I LOVE YOU, DADDY!'] },
  { h: 'excited', hop: 'habbi', narr: 'Habbi is absolutely delighted.' },
  { p: 'open', say: [P, 'He would eat the entire cake if you let him.'], goto: 'FINALE' },

  { label: 'B', h: 'shock', narr: "Habbi realises he isn't getting any cake." },
  { h: 'shock', hop: 'habbi', say: [H, 'WHAT?! NO CAKE?! BUT I WANT CAKE!'] },
  { h: 'shock', narr: 'He is absolutely devastated.' },
  { p: 'neutral', say: [P, 'Heh...'] },
  { p: 'open', say: [P, "I'd never eat human food."], goto: 'FINALE' },

  { label: 'FINALE', finale: true, p: 'neutral', h: 'neutral', narr: 'Both look towards Daddy.' },
  { p: 'open', h: 'excited', hop: 'both', say: [BOTH, 'WE LOVE YOU!'] },
  { p: 'neutral', h: 'neutral', narr: '…' },
  { p: 'open', say: [P, 'Happy birthday, Daddy.'] },
  { p: 'neutral', h: 'excited', hop: 'habbi', say: [H, 'HAPPY BIRTHDAY!!!'] },
  { p: 'angry', narr: 'Parky gives Habbi an unimpressed expression.' },
  { p: 'angry-open', say: [P, 'Quiet.'] },
  { p: 'angry', h: 'neutral', say: [H, '...'] },
  { p: 'neutral', narr: '…' },
  { h: 'open', say: [H, 'CAKE?'] },
  { end: true, p: 'neutral', h: 'excited' },
];
