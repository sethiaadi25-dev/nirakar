/* =============================================================================
   NIRAKAR — SITE CONTENT
   Everything the website says lives in this one file. Edit text here, save,
   and refresh the browser. No build step.

   ADDING A PROJECT
   1. Put its web-ready media in  media/<slug>/  (or add it to _tools/build-media.mjs
      and run  node build-media.mjs  — it compresses images and videos for you).
   2. Copy one of the project blocks below, change the slug, text and file names.
   3. Order in this list = order on the site.

   MEDIA PATHS are relative to the project's folder: 'street' means
   media/<slug>/street.webp (the -sm.webp version is used automatically for thumbnails).
   Videos end in .mp4: 'bankai.mp4' means media/<slug>/bankai.mp4.

   BLOCK TYPES for a project page (the "story" list):
     { type: 'text',    title: '…', body: ['paragraph', 'paragraph'] }
     { type: 'image',   src: 'name', caption: '…', size: 'full' | 'wide' | 'inset' }
     { type: 'gallery', items: ['a','b','c'], cols: 2 | 3 | 4, caption: '…' }
     { type: 'video',   src: 'name.mp4', poster: 'name-poster', caption: '…', vertical: true|false }
     { type: 'reels',   items: [{ src, poster, label }] }      (row of vertical videos)
     { type: 'facts',   items: [['label','value'], …] }
     { type: 'quote',   text: '…' }
   ========================================================================== */

window.NIRAKAR = {
  site: {
    name: 'Nirakar',
    tagline: 'Out of the formless.',
    intro: 'A studio for ideas that don’t have a shape yet.',
    manifesto: 'Nirakar — निराकार — means formless. Every world, frame and mark we make begins as nothing. We give it a shape.',
    disciplines: ['Game Design', '3D Animation', 'Set Design', 'Motion Graphics', 'Branding', 'Fashion'],
    instagram: 'https://www.instagram.com/nirakar.co/',
    instagramHandle: '@nirakar.co',
    email: 'nirakar.company@gmail.com',   // leave '' to hide the email button
    location: 'India · working worldwide',
    year: 2026,
  },

  projects: [
    // ------------------------------------------------------------------------
    {
      slug: 'kinetic-redline',
      title: 'Kinetic Redline',
      kicker: 'Three lanes, one blade, and a core that dies if you slow down.',
      disciplines: ['Game Design', 'Set Design', 'Branding'],
      status: 'In development',
      year: '2026',
      role: 'Game design, programming, 3D, UI / HUD',
      tools: ['Unity 6', 'C#', 'Blender'],
      cover: 'gp-overdrive',
      coverVideo: 'gameplay-loop.mp4',
      featured: true,
      summary: 'Kinetic Redline is a high-speed cyberpunk runner. You are Ronin-0, a samurai unit whose core only stays alive while it runs hot. Dash, slash and parry your way through neon districts, and don’t slow down.',
      story: [
        { type: 'video', src: 'gameplay-run.mp4', poster: 'gameplay-run-poster', autoplay: true, caption: 'A full run from the current build: Neon Market to Corporate Spire, two augment picks and a gunship, until the core redlines.' },
        { type: 'facts', items: [['Engine', 'Unity 6'], ['Lanes', '3'], ['Districts', '4+'], ['Hazards', '24']] },
        { type: 'text', title: 'How it plays', body: [
          'The road runs in three lanes and the speed keeps climbing. You dash, jump, slide, slash, and parry with the right mouse button. Tricks and kills feed the flow meter and the combo, which tops out at X8.',
          'Your core temperature is your life. Keep it hot by moving and fighting. If it drops to zero, the core stalls and the run is over.',
          'Districts announce themselves as you enter. Events break up the run: Overclock speeds everything up, and when a gunship comes in, you parry its missiles back at it.' ] },
        { type: 'gallery', items: ['gp-overdrive', 'gp-overclock', 'gp-gunship', 'gp-karaoke-gate'], cols: 2, caption: 'In-game: overdrive, Overclock, “Gunship inbound” and a gate breach.' },
        { type: 'text', title: 'Interface', body: [
          'Core temperature sits top left with the dash and parry charges, distance and score sit top right, the combo stamp is on the right, and the flow bar runs along the bottom. Japanese sub-labels run through the whole interface.',
          'The whole UI is built in Unity from one small sprite kit, with each sprite tinted in-engine.' ] },
        { type: 'image', src: 'ui-kit', caption: 'The game’s UI sprite kit: actions, augments, menu icons and Japanese labels.', size: 'wide' },
        { type: 'gallery', items: ['ui-main-menu', 'ui-augments', 'ui-district-title', 'ui-redlined'], cols: 2, caption: 'Main menu with daily contracts, the augment draft, a district title card, and the “Redlined” run report.' },
        { type: 'image', src: 'game-logo', caption: 'Game logo.', size: 'inset' },
        { type: 'text', title: 'The blade', body: [
          'The latest build adds a first-person arm and katana, modelled and animated in Blender. It has nine animations: idle, flourish, draw, a three-hit combo, dash strike, block and block-hit. Every slash, parry and shockwave plays on screen.' ] },
        { type: 'video', src: 'gameplay-blade.mp4', poster: 'gameplay-blade-poster', autoplay: true, caption: 'Latest build: the first-person blade, perfect parries and a shockwave.' },
        { type: 'gallery', items: ['gp-blade-perfect', 'gp-shockwave', 'gp-slash'], cols: 3 },
        { type: 'text', title: 'The city kit', body: [
          'Every district is a modular kit built in Blender: Neon Avenue, Market Gate, the docks, Billboard Plaza, the Undercity, Spire Gate, Tower Canyon and the Kinetic Tower.',
          'There are 24 hazards and enemies: drones, turrets, snipers, laser fences, blast doors, collapsing walkways and the gunship.' ] },
        { type: 'image', src: 'aerial', caption: 'City kit, aerial render (Blender).', size: 'full' },
        { type: 'gallery', items: ['street', 'undercity', 'docks', 'gate'], cols: 2, caption: 'District renders from Blender.' },
        { type: 'video', src: 'gameplay-run-2.mp4', poster: 'gameplay-run-2-poster', autoplay: true, caption: 'Another run, starting from the main menu.' },
        { type: 'image', src: 'seppuku-poster', caption: 'Key art: “Seppuku // Ronin-0”.', size: 'wide' },
      ],
    },

    // ------------------------------------------------------------------------
    {
      slug: 'senbonzakura',
      title: 'Senbonzakura',
      kicker: 'A thousand blades, scattering like petals.',
      disciplines: ['3D Animation'],
      status: 'v2 — compositing',
      year: '2026',
      role: '3D, simulation, lighting, VFX prep',
      tools: ['Blender 5.2', 'EEVEE', 'After Effects'],
      cover: 'petal-walls',
      coverVideo: 'bankai-loop.mp4',
      featured: true,
      summary: 'A 26-second 4K tribute to a famous anime bankai: a field of katanas rises out of black water and breaks into a storm of cherry-blossom blades. Fan work, built from scratch in Blender.',
      story: [
        { type: 'video', src: 'bankai.mp4', poster: 'bankai-poster', caption: 'Bankai — 1080p preview of the 4K render.' },
        { type: 'facts', items: [['Resolution', '3840 × 2160'], ['Length', '26 s · 624 frames'], ['Renderer', 'EEVEE'], ['Shots', '5']] },
        { type: 'text', title: 'Five shots', body: [
          'Drop, Rise, Scatter, Storm and the push-in. The first three cameras are locked off and only the last two move, so the motion comes from the blades, not the lens.',
          'The swords rise from back to front: the farthest blades break the surface first and the wave rolls towards camera.' ] },
        { type: 'gallery', items: ['drop', 'rise', 'scatter', 'storm'], cols: 2 },
        { type: 'text', title: 'v2 — built for compositing', body: [
          'A new katana mesh with a real cross-section: honed edge, ridge line and peaked spine, with a mirror-polished steel shader.',
          '36 tracked locators, stand-in proxies, depth and cryptomatte passes, and petal layers split in front of and behind the character, all ready for VFX.' ] },
        { type: 'image', src: 'petal-walls', caption: 'Petal walls.', size: 'full' },
        { type: 'gallery', items: ['v2-blade', 'v2-field', 'v2-push'], cols: 3, caption: 'v2 frames.' },
      ],
    },

    // ------------------------------------------------------------------------
    {
      slug: 'color-thief',
      title: 'Color Thief',
      kicker: 'A grey town. A thief who steals colour. Every sound made from nothing.',
      disciplines: ['Set Design', '3D Animation'],
      status: 'Animatic',
      year: '2026',
      role: 'Sound design & score, 3D environments',
      tools: ['Python (numpy / scipy)', 'DaVinci Resolve', 'Blender'],
      cover: 'colour-street',
      coverVideo: 'color-thief-loop.mp4',
      featured: true,
      summary: 'A short film about a thief who drains a riverside town of its colour. We built its 3D sets and every second of its sound. No samples or recordings: all of it was synthesised from scratch in code.',
      story: [
        { type: 'video', src: 'color-thief.mp4', poster: 'color-thief-poster', caption: 'Full animatic with the final sound mix. Turn the sound on.' },
        { type: 'quote', text: 'Grey means drained of life. Colour means alive.' },
        { type: 'text', title: 'The sound', body: [
          'The grey world gets only night wind, a distant river and a dying traffic-light buzz: no birds, no insects, no traffic. Colour sounds bubbly, glassy and shimmering, with FM bells on a bright D-lydian scale and a soft choir.',
          'The thief is sneaky and dry: soft footsteps, cloak rustles and a pizzicato theme in D minor. The flower has its own music-box theme, which breaks apart while he hesitates.' ] },
        { type: 'facts', items: [['Length', '100 s'], ['Audio tracks', '21'], ['Samples used', '0'], ['Synthesis', 'Noise, FM, Karplus-Strong, modal']] },
        { type: 'gallery', items: ['grey-town', 'colour-room', 'wallpaper', 'house', 'the-flower', 'colour-street'], cols: 3, caption: 'Sets and boards, from the grey town to the colour room.' },
        { type: 'image', src: 'colour-street', caption: 'The street, after.', size: 'full' },
      ],
    },

    // ------------------------------------------------------------------------
    {
      slug: 'a-stem-lounge',
      title: 'A Stem Lounge',
      kicker: 'Find your root. The full identity, motion and web for a JEE / NEET learning space.',
      disciplines: ['Branding', 'Motion Graphics'],
      status: 'Ongoing — remote',
      year: '2026',
      role: 'Brand identity & guidelines, motion reels, website',
      tools: ['After Effects', 'Astro'],
      cover: 'guide-01',
      coverVideo: 'zones-loop.mp4',
      featured: true,
      client: 'A Stem Lounge',
      summary: 'Ongoing work for A Stem Lounge, a coaching space for JEE and NEET students. We built its whole identity: the root-sign logo and tree icon, a five-colour system, typography, merchandise and a full brand guideline, plus vertical motion reels and the website.',
      story: [
        { type: 'text', title: 'The idea', body: [
          'Getting to the root of every concept. The square-root sign is the first symbol every JEE and NEET student learns to master. Its bar stretches over the name, so the institute sits under the root: the place where concepts are taken back to first principles.',
          'The icon is that root sign grown into a tree: one stroke becomes a trunk, a branch carries five gold leaves, and real roots spread from the base.' ] },
        { type: 'image', src: 'guide-01', caption: 'Brand guidelines 2026: cover.', size: 'full' },
        { type: 'gallery', items: ['guide-02', 'guide-03', 'guide-04', 'guide-05'], cols: 2, caption: 'The idea, the main logo and its everyday versions, three alternate colourways, and the icon in every colourway.' },
        { type: 'gallery', items: ['guide-06', 'guide-07'], cols: 2, caption: 'Colour: crimson and gold with three supporting colours. Typography: DM Serif Display and Poppins.' },
        { type: 'text', title: 'Merchandise', body: [
          'Student polos in red and black, a backpack with an embroidered patch, and A4 notes paper in Cornell, grid and ruled versions, with the tree printed faintly underneath. Every item comes with print-ready files.' ] },
        { type: 'gallery', items: ['guide-08', 'guide-09', 'guide-10', 'guide-11'], cols: 2, caption: 'The polo T-shirt, the backpack, the notes paper, and the usage rules with the file map.' },
        { type: 'reels', items: [
          { src: 'zones-reel.mp4', poster: 'zones-reel-poster', label: 'Four Zones' },
          { src: 'intro-reel.mp4', poster: 'intro-reel-poster', label: 'Intro' },
          { src: 'observation-reel.mp4', poster: 'observation-reel-poster', label: 'Observation' },
          { src: 'perelman-reel.mp4', poster: 'perelman-reel-poster', label: 'Perelman' } ] },
        { type: 'text', title: 'Motion', body: [
          'Short vertical reels for social media that explain how learning works: the four zones (comfort, fear, learning and growth), observation, and the stories behind great minds. Each reel is built in After Effects in the brand’s colours and type.' ] },
        { type: 'image', src: 'zones-sheet', caption: '“Four Zones”: frame sheet.', size: 'wide' },
        { type: 'gallery', items: ['intro-still', 'observation-still', 'perelman-still'], cols: 3 },
      ],
    },

    // ------------------------------------------------------------------------
    {
      slug: 'lampoon',
      title: 'Lampoon',
      kicker: 'One beach. One very tired man. One bird with a plan.',
      disciplines: ['3D Animation', 'Set Design'],
      status: 'In production',
      year: '2026',
      role: 'Character, set, animation',
      tools: ['Blender', 'Python'],
      cover: 'establish',
      coverVideo: 'bird-gag-loop.mp4',
      featured: true,
      summary: 'A stylised comedy short set on a sleepy beach. The character, the set and the gags are built in Blender, and much of it is generated by Python scripts so shots can be rebuilt fast.',
      story: [
        { type: 'video', src: 'bird-gag.mp4', poster: 'bird-gag-poster', caption: 'The bird gag — preview.' },
        { type: 'text', title: 'The set', body: [
          'A toon-shaded cove: soft sand, a painted sea, low-poly palms and one bench where the story happens. Four cameras cover it: the establishing shot, the bench, the bird’s-eye view and the top-down.' ] },
        { type: 'gallery', items: ['bench', 'sky-pov', 'top-down', 'establish'], cols: 2 },
        { type: 'text', title: 'The lead', body: [
          'Tall, tired and wearing bunny slippers. His expression sheet came first, so every gag starts from his face.' ] },
        { type: 'gallery', items: ['char-front', 'char-side', 'char-pose'], cols: 3 },
        { type: 'gallery', items: ['face-neutral', 'face-confused', 'face-shocked', 'face-smug'], cols: 4, caption: 'Expressions: neutral, confused, shocked, smug.' },
      ],
    },

    // ------------------------------------------------------------------------
    {
      slug: 'nirakar-apparel',
      title: 'Nirakar Apparel',
      kicker: 'Garments that look like they crawled out of the void.',
      disciplines: ['Fashion', 'Branding'],
      status: 'In design',
      year: '2026',
      role: 'Design, graphics, illustration',
      tools: ['Illustration', 'Print design'],
      cover: 'tees',
      featured: true,
      summary: 'The studio’s own clothing line: acid-washed oversized tees with metal-type graphics, a strapped and belted hooded bomber, and wide baggy trousers. Designed in-house, now heading towards samples.',
      story: [
        { type: 'image', src: 'tees', caption: 'Drop 01 tees: the back-print “maw” and the poppy wordmark.', size: 'full' },
        { type: 'text', title: 'Silhouettes', body: [
          'Boxy, heavy and dark. Straps, belts and hardware do the talking, and the logo stays small.' ] },
        { type: 'image', src: 'jacket', caption: 'Hooded tactical bomber — illustration.', size: 'wide' },
        { type: 'gallery', items: ['pants-1', 'pants-2'], cols: 2, caption: 'Baggy trousers, two variations.' },
        { type: 'gallery', items: ['clover-tee', 'shoot'], cols: 2 },
      ],
    },
  ],
};
