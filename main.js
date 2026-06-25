import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

kaplay({
  background: [180, 230, 150],
});


const WORLD_W = 2000;
const WORLD_H = 1500;

// chargement des assets
loadSprite("fondRuche", "fondRuche.png");
loadSprite("abeille", "abeille.png");
loadSprite("fleur1",  "fleur1.png");
loadSprite("fleur2", "fleur2.png");
loadSprite("fleur3", "fleur3.png");
loadSprite("arbre", "arbre.png");
loadSprite("haie", "haie.png");
loadSprite("haie2", "haie2.png");
loadSprite("ruche", "ruche1.png");
loadSprite("frelon", "frelon.png");
loadSprite("abeille2", "abeille2.png");
loadSprite("eau", "eau.png");
loadSprite("alveole", "alveole.png");
loadSprite("alveole2", "alveole2.png");
loadSprite("miel", "miel.png");
loadSprite("fondPrairie", "prairie.png");

scene("intro", () => {
  setGravity(0);

  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.72),
    z(0),
  ]);

  const introBoxW = 660;
  const introBoxH = 390;

  add([
    rect(introBoxW, introBoxH, { radius: 18 }),
    pos(width() / 2 - introBoxW / 2, height() / 2 - introBoxH / 2),
    color(245, 222, 130),
    outline(4, color(170, 120, 40)),
    z(1),
  ]);

  add([
    text("Bienvenue dans le jeu des abeilles", { size: 30 }),
    anchor("center"),
    pos(width() / 2, height() / 2 - 150),
    color(95, 60, 20),
    z(2),
  ]);

  add([
    rect(520, 4, { radius: 2 }),
    anchor("center"),
    pos(width() / 2, height() / 2 - 125),
    color(170, 120, 40),
    z(2),
  ]);

  add([
    text(
      "Dans ce jeu, tu vas suivre le trajet du nectar\n" +
      "jusqu'à sa transformation en miel.\n\n" +
      "À chaque niveau, aide l'abeille à accomplir\n" +
      "une étape importante : récolter, transporter,\n" +
      "transmettre, ventiler puis sceller le miel.\n\n" +
      "Utilise les flèches du clavier et la touche ESPACE pour progresser dans l'aventure.",
      {
        size: 18,
        width: 540,
        lineSpacing: 5,
        align: "center",
      }
    ),
    anchor("center"),
    pos(width() / 2, height() / 2 + 20),
    color(90, 70, 35),
    z(2),
  ]);

  add([
    text("Appuie sur ESPACE pour commencer", { size: 20 }),
    anchor("center"),
    pos(width() / 2, height() / 2 + 170),
    color(150, 90, 20),
    z(2),
  ]);

  onKeyPress("space", () => {
    go("level1");
  });
});



//  NIVEAU 1 — Récolter le pollen
//  Vue de dessus, explorer la prairie

scene("level1", () => {
    setGravity(0);
    let pollen = 0;
    let started = false;
    const POLLEN_GOAL = 10;
  
    // UI
    const pollenText = add([
      text("Pollen : 0 / " + POLLEN_GOAL, { size: 20 }),
      pos(20, 20),
      fixed(),
      z(100),
    ]);
  
    const msgText = add([
      text("Explore la prairie et récolte du pollen !", { size: 14 }),
      pos(20, 50),
      fixed(),
      z(100),
      color(60, 90, 40),
    ]);
  
    // bordures invisibles du monde
    const walls = [
      { x: -10,     y: 0,       w: 10,      h: WORLD_H },
      { x: WORLD_W, y: 0,       w: 10,      h: WORLD_H },
      { x: 0,       y: -10,     w: WORLD_W, h: 10      },
      { x: 0,       y: WORLD_H, w: WORLD_W, h: 10      },
    ];
    walls.forEach(w => {
      add([
        rect(w.w, w.h),
        pos(w.x, w.y),
        area(),
        body({ isStatic: true }),
        opacity(0),
      ]);
    });
  
    // arbres
    const trees = [
      { x: 300,  y: 80   },
      { x: 700,  y: 150  },
      { x: 1100, y: 90   },
      { x: 1500, y: 200  },
      { x: 1800, y: 80   },
      { x: 200,  y: 400  },
      { x: 600,  y: 600  },
      { x: 950,  y: 450  },
      { x: 1300, y: 500  },
      { x: 1700, y: 600  },
      { x: 100,  y: 800  },
      { x: 450,  y: 950  },
      { x: 850,  y: 800  },
      { x: 1200, y: 900  },
      { x: 1600, y: 850  },
      { x: 300,  y: 1200 },
      { x: 750,  y: 1300 },
      { x: 1100, y: 1200 },
      { x: 1500, y: 1350 },
      { x: 1850, y: 1100 },
    ];
  
    trees.forEach(t => {
      add([
        sprite("arbre"),
        pos(t.x, t.y),
        scale(8),
        area({
          scale: 0.5,
        }),
        body({ isStatic: true }),
        z(1),
      ]);
    });
  
    // haie horizontale
    for (let x = 400; x < 900; x += 30) {
      add([
        sprite("haie"),
        pos(x, 320),
        scale(3.5),
        area(),
        body({ isStatic: true }),
      ]);
    }
  
    // haie verticale
    for (let y = 600; y < 1100; y += 30) {
      add([
        sprite("haie2"),
        pos(1100, y),
        scale(3.5),
        area(),
        body({ isStatic: true }),
      ]);
    }
  
    // fleurs
    const flowerPositions = [
      { x: 180,  y: 200  },
      { x: 250,  y: 300  },
      { x: 150,  y: 600  },
      { x: 350,  y: 700  },
      { x: 500,  y: 500  },
      { x: 200,  y: 500  },
      { x: 700,  y: 450  },
      { x: 900,  y: 380  },
      { x: 800,  y: 700  },
      { x: 1000, y: 750  },
      { x: 750,  y: 1000 },
      { x: 1300, y: 350  },
      { x: 1400, y: 700  },
      { x: 1250, y: 1100 },
      { x: 400,  y: 1100 },
      { x: 600,  y: 1200 },
      { x: 900,  y: 1350 },
      { x: 1400, y: 1200 },
      { x: 1700, y: 1000 },
      { x: 1850, y: 400  },
    ];
  
    flowerPositions.forEach(f => {
      const type = choose(["fleur1", "fleur2", "fleur3"]);

      add([
        sprite(type),
        pos(f.x, f.y),
        scale(2.5),
        area(),
        "flower",
        { value: 1 },
      ]);
    });
  
    // frelons
    function addFrelon(x, y) {
      const frelon = add([
        sprite("frelon"),
        pos(x, y),
        scale(1.5),
        area({
          scale: 0.6,
        }),
        z(5),
        "frelon",
        {
          direction: vec2(rand(-1, 1), rand(-1, 1)).unit(),
          timer: 0,
          speed: rand(80, 140),
          invincible: false,
        },
      ]);
  
      frelon.onUpdate(() => {
        frelon.timer -= dt();
        if (frelon.timer <= 0) {
          frelon.direction = vec2(rand(-1, 1), rand(-1, 1)).unit();
          frelon.timer = rand(1, 3);
        }
        frelon.move(frelon.direction.scale(frelon.speed));
        if (frelon.pos.x < 0 || frelon.pos.x > WORLD_W) {
          frelon.direction = vec2(-frelon.direction.x, frelon.direction.y);
        }
        if (frelon.pos.y < 0 || frelon.pos.y > WORLD_H) {
          frelon.direction = vec2(frelon.direction.x, -frelon.direction.y);
        }
      });
  
      return frelon;
    }
  
    addFrelon(600,  400);
    addFrelon(1000, 300);
    addFrelon(800,  900);
    addFrelon(1400, 600);
    addFrelon(400,  1100);
    addFrelon(300,  800);

    // écran d'intro
const introBg = add([
  rect(width(), height()),
  pos(0, 0),
  fixed(),
  color(0, 0, 0),
  opacity(0.75),
  z(200),
]);

const introBox = add([
  rect(700, 430, { radius: 18 }),
  pos(width() / 2 - 350, height() / 2 - 215),
  fixed(),
  color(220, 240, 160),
  z(201),
]);

const introTitle = add([
  text("Niveau 1 - La récolte du pollen", { size: 26 }),
  pos(width() / 2 - 245, height() / 2 - 180),
  fixed(),
  color(60, 90, 40),
  z(202),
]);

const introText = add([
  text(
    "Bienvenue dans la prairie !\n\n" +
    "Déplace l'abeille avec les flèches du clavier.\n" +
    "Approche-toi des fleurs et appuie sur ESPACE\n" +
    "pour récolter du pollen.\n\n" +
    "Attention aux frelons : ils te font perdre du pollen !\n\n" +
    "Objectif : récolter 10 pollens.\n\n" +
    "Appuie sur ESPACE pour commencer.",
    {
      size: 17,
      width: 520,
      lineSpacing: 8,
    }
  ),
  pos(width() / 2 - 260, height() / 2 - 120),
  fixed(),
  color(60, 70, 40),
  z(202),
]);

onKeyPress("space", () => {
  if (started) return;

  started = true;

  destroy(introBg);
  destroy(introBox);
  destroy(introTitle);
  destroy(introText);
});
  
    // joueur
    const player = add([
      sprite("abeille"),
      pos(100, 200),
      area({
        shape: new Rect(vec2(8, 8), 16, 14),
      }),
      body(),
      scale(3),
      z(10),
      "player",
    ]);
  
    // caméra
    player.onUpdate(() => {
      setCamPos(
        clamp(player.pos.x, width() / 2,  WORLD_W - width() / 2),
        clamp(player.pos.y, height() / 2, WORLD_H - height() / 2)
      );
    });
  
    // déplacement
    const SPEED = 220;
    onKeyDown("left",  () => { if (started) player.move(-SPEED, 0); });
    onKeyDown("right", () => { if (started) player.move(SPEED,  0); });
    onKeyDown("up",    () => { if (started) player.move(0, -SPEED); });
    onKeyDown("down",  () => { if (started) player.move(0,  SPEED); });
  
    // collision frelon
    onCollide("player", "frelon", (p, f) => {
      if (f.invincible) return;
      if (pollen > 0) {
        pollen = Math.max(0, pollen - 2);
        pollenText.text = "Pollen : " + pollen + " / " + POLLEN_GOAL;
        msgText.text = "Un frelon ! Tu as perdu du pollen !";
        msgText.color = color(200, 50, 0);
      }
      f.invincible = true;
      wait(2, () => { if (f.exists()) f.invincible = false; });
      player.color = color(255, 80, 80);
      wait(0.3, () => { player.color = color(255, 255, 255); });
    });
  
    // récolte
    let currentFlower = null;
  
    onCollide("player", "flower", (p, f) => {
      currentFlower = f;
      msgText.text = "Appuie sur ESPACE pour récolter !";
      msgText.color = color(200, 100, 0);
    });
  
    onCollideEnd("player", "flower", () => {
      currentFlower = null;
      msgText.text = "Explore la prairie et récolte du pollen !";
      msgText.color = color(60, 90, 40);
    });
  
    onKeyPress("space", () => {
      if(!started) return;

      if (currentFlower && currentFlower.exists()) {
        pollen++;
        destroy(currentFlower);
        currentFlower = null;
        pollenText.text = "Pollen : " + pollen + " / " + POLLEN_GOAL;
  
        if (pollen >= POLLEN_GOAL) {
          msgText.text = "Bravo ! Tu as récolté assez de pollen !";
          msgText.color = color(0, 150, 60);
          wait(2, () => go("card", {
            label: "Niveau 1 terminé !",
            text:
              "L'abeille aspire le nectar des fleurs avec sa langue,\n" +
              "puis le stocke dans son jabot : une petite poche\n" +
              "située dans son ventre.\n\n" +
              "Une seule abeille peut visiter jusqu'a 1000 fleurs en un seul voyage !",
            next: "level2",
            nextData: { pollen },
          }));
        } else {
          msgText.text = "Super ! Plus que " + (POLLEN_GOAL - pollen) + " a récolter.";
          msgText.color = color(60, 90, 40);
        }
      }
    });
  });



//  NIVEAU 2 — Transporter vers la ruche
//  Plateforme horizontal, abeille qui vole


scene("level2", (data) => {
  setGravity(0);

  add([
    sprite("fondPrairie"),
    pos(0, 0),
    scale(1.1),
    fixed(),
    z(-100),
  ]);

  const pollenPorte = data?.pollen ?? 5;
  let dead = false;
  let started = false;
  let hiveTime = false;
  let score = 0;

  const GOAL = 10;

  // UI
  const scoreText = add([
    text("Obstacles évités : 0 / " + GOAL, { size: 18 }),
    pos(20, 20),
    fixed(),
    z(100),
  ]);

  const msgText = add([
    text("ESPACE = battre des ailes pour éviter les frelons", { size: 14 }),
    pos(20, 50),
    fixed(),
    z(100),
    color(60, 90, 40),
  ]);


// écran d'intro
const introBg = add([
  rect(width(), height()),
  pos(0, 0),
  fixed(),
  color(0, 0, 0),
  opacity(0.72),
  z(200),
]);

const introBoxW = 640;
const introBoxH = 340;

const startBox = add([
  rect(introBoxW, introBoxH, { radius: 18 }),
  pos(width() / 2 - introBoxW / 2, height() / 2 - introBoxH / 2),
  fixed(),
  color(245, 222, 130),
  outline(4, color(170, 120, 40)),
  z(201),
]);

const startTitle = add([
  text("Niveau 2 - Retour à la ruche", { size: 25 }),
  anchor("center"),
  pos(width() / 2, height() / 2 - 130),
  fixed(),
  color(95, 60, 20),
  z(202),
]);

const startText = add([
  text(
    "Tu as recolté assez de pollen !\n\n" +
    "Maintenant, aide l'abeille a rentrer à la ruche.\n" +
    "Appuie sur ESPACE pour battre des ailes\n" +
    "et éviter les frelons sur le chemin.\n" +
    "Objectif : éviter 10 obstacles,\n" +
    "puis rejoindre la ruche.",
    {
      size: 18,
      width: 500,
      lineSpacing: 10,
      align: "center",
    }
  ),
  anchor("center"),
  pos(width() / 2, height() / 2 + 10),
  fixed(),
  color(90, 70, 35),
  z(202),
]);

const startHint = add([
  text("Appuie sur ESPACE pour commencer", { size: 20 }),
  anchor("center"),
  pos(width() / 2, height() / 2 + 140),
  fixed(),
  color(150, 90, 20),
  z(202),
]);


  // plafond invisible
  add([
    rect(3000, 10),
    pos(0, -10),
    area(),
    body({ isStatic: true }),
    opacity(0),
    "danger",
  ]);

  // joueur
  const player = add([
    sprite("abeille"),
    pos(150, 250),
    area({
      shape: new Rect(vec2(8, 8), 16, 14),
    }),
    body(),
    scale(2.2),
    z(10),
    "player",
    {
      vy: 0,
    },
  ]);

  // caméra fixe
  setCamPos(width() / 2, height() / 2);

  // réglages du vol
  const FORWARD_SPEED = 160;
  const FALL_SPEED = 320;
  const FLAP = -220;

  onKeyPress("space", () => {
    if (dead) return;

    if (!started) {
      started = true;
      destroy(introBg);
      destroy(startBox);
      destroy(startTitle);
      destroy(startText);
      destroy(startHint);
    }

    player.vy = FLAP;
  });

  function die() {
    if (dead) return;

    dead = true;
    player.color = color(255, 80, 80);
    msgText.text = "Aie ! On recommence...";
    msgText.color = color(200, 50, 0);

    wait(1.2, () => go("level2", { pollen: pollenPorte }));
  }

  function finishLevel() {
    if (dead) return;

    dead = true;
    msgText.text = "Bravo ! Tu es rentré à la ruche !";
    msgText.color = color(0, 150, 80);

    wait(1.5, () => go("card", {
      label: "Niveau 2 terminé !",
      text:
        "De retour à la ruche, l'abeille transmet le nectar\n" +
        "à une autre abeille.\n\n" +
        "Puis cette abeille le transmet à son tour,\n" +
        "et ainsi de suite.\n\n" +
        "Ce processus s'appelle la trophallaxie.",
      next: "level3",
      nextData: { pollen: pollenPorte },
    }));
  }

  function addHive() {
    add([
      sprite("ruche"), 
      pos(width() + 80, 0),
      scale(5),
      area(),
      z(5),
      "hive",
    ]);
  }

  function addObstacle(x, y) {
    const obs = add([
      sprite("frelon"),
      pos(x, y),
      scale(1.5),
      area({
        scale: 0.45,
      }),
      z(5),
      "danger",
      "obstacle",
      {
        counted: false,
        baseY: y,
        t: rand(0, 100),
      },
    ]);

    obs.onUpdate(() => {
      if (dead || !started) return;

      obs.t += dt();

      // mouvement horizontal
      obs.move(-FORWARD_SPEED, 0);

      // petit mouvement vertical
      obs.pos.y = obs.baseY + Math.sin(obs.t * 2) * 20;

      // obstacle passé
      if (!obs.counted && obs.pos.x + 40 < player.pos.x) {
        obs.counted = true;
        score++;
        scoreText.text = "Obstacles évités : " + score + " / " + GOAL;

        if (score >= GOAL && !hiveTime) {
          hiveTime = true;
          msgText.text = "Continue ! Va jusqu'à la ruche !";
          msgText.color = color(0, 120, 180);

          destroyAll("obstacle");
          addHive();
        }
      }

      if (obs.pos.x < -80) {
        destroy(obs);
      }
    });
  }

  // obstacles
  function spawnObstacleGroup(startX) {
    const pattern = randi(0, 4);

    if (pattern === 0) {
      addObstacle(startX, 120);
    }

    if (pattern === 1) {
      addObstacle(startX, 240);
    }

    if (pattern === 2) {
      addObstacle(startX, 380);
    }

    if (pattern === 3) {
      addObstacle(startX, 160);
      addObstacle(startX + 130, 360);
    }
  }

  let nextX = 700;

  loop(2.2, () => {
    if (dead || !started || hiveTime) return;

    spawnObstacleGroup(nextX);
    nextX += 360;
  });

  // déplacement de la ruche vers l'abeille
  onUpdate("hive", (h) => {
    if (dead || !started) return;
    h.move(-FORWARD_SPEED, 0);
  });

  onUpdate("hiveText", (t) => {
    if (dead || !started) return;
    t.move(-FORWARD_SPEED, 0);
  });

  // mouvement de l'abeille
  player.onUpdate(() => {
    if (dead) return;
    if (!started) return;

    player.vy += FALL_SPEED * dt();
    player.move(10, player.vy);

    if (player.pos.y > 620 || player.pos.y < -20) {
      die();
    }
  });

  onCollide("player", "danger", () => die());

  onCollide("player", "hive", () => {
    if (!hiveTime) return;
    finishLevel();
  });
});

//  NIVEAU 3 — Trophallaxie
//  Atteindre les abeilles dans l'ordre


scene("level3", (data) => {
    setGravity(600);
    const pollenPorte = data?.pollen ?? 5;
    let nextBee = 0;
    let started = false; 
    const BEE_COUNT = 5;
    let dead = false;
    
    add([
      sprite("fondRuche"),
      pos(0, 0),
      fixed(),
      z(-100),
    ])
  
    // UI
    const scoreText = add([
      text("Abeille suivante : 1 / " + BEE_COUNT, { size: 18 }),
      pos(20, 20),
      fixed(),
      z(100),
    ]);
  
    const msgText = add([
      text("Atteins les abeilles dans le bon ordre !", { size: 14 }),
      pos(20, 50),
      fixed(),
      z(100),
    ]);
  
  
    // plateformes simples
    const platforms = [
      { x: 0,    y: 520, w: 180 },
      { x: 240,  y: 410, w: 140 },
      { x: 450,  y: 340, w: 120 },
      { x: 650,  y: 430, w: 140 },
      { x: 860,  y: 320, w: 120 },
      { x: 1050, y: 390, w: 140 },
      { x: 1260, y: 290, w: 120 },
    ];
  
    platforms.forEach((p) => {
      add([
        rect(p.w, 18),
        pos(p.x, p.y),
        area(),
        body({ isStatic: true }),
        color(180, 140, 60),
        z(2),
      ]);
    });
  
    // cibles = abeilles (carrés jaunes numérotés)
    const beePositions = [
      { x: 280,  y: 360 },
      { x: 490,  y: 290 },
      { x: 700,  y: 380 },
      { x: 900,  y: 260 },
      { x: 1290, y: 230 },
    ];
  
    const beeObjects = [];
  
    beePositions.forEach((bp, i) => {
      const b = add([
        sprite('abeille2'),
        pos(bp.x, bp.y),
        area(),
        z(5),
        "bee_target",
        { index: i },
      ]);
    
      beeObjects.push(b);
    });
  
    function updateBeeColors() {
    }
  
    //  2 ennemis
    const patrolData = [
        { x: 430, y: 300, range: 80 },   // vers l'abeille 2
        { x: 900, y: 260, range: 80 },   // vers l'abeille 4
        { x: 1380, y: 230, range: 70 },  // avant l'abeille 5
      ];
      
      patrolData.forEach(p => {
        const f = add([
          sprite('frelon'),
          pos(p.x, p.y),
          area({
            shape: new Rect(vec2(14, 14), 14, 14),
          }),
          z(5),
          "ennemi",
          { startX: p.x, range: p.range, dir: 1, speed: 75 },
        ]);
      
        f.onUpdate(() => {
          if (!started || dead) return;

          f.move(f.dir * f.speed, 0);
          if (f.pos.x > f.startX + f.range) f.dir = -1;
          if (f.pos.x < f.startX - f.range) f.dir = 1;
        });
      });


    // écran d'intro
const introBg = add([
  rect(width(), height()),
  pos(0, 0),
  fixed(),
  color(0, 0, 0),
  opacity(0.72),
  z(200),
]);

const introBoxW = 640;
const introBoxH = 340;

const introBox = add([
  rect(introBoxW, introBoxH, { radius: 18 }),
  pos(width() / 2 - introBoxW / 2, height() / 2 - introBoxH / 2),
  fixed(),
  color(245, 222, 130),
  outline(4, color(170, 120, 40)),
  z(201),
]);

const introTitle = add([
  text("Niveau 3 - La trophallaxie", { size: 20 }),
  anchor("center"),
  pos(width() / 2, height() / 2 - 135),
  fixed(),
  color(95, 60, 20),
  z(202),
]);

const introText = add([
  text(
    "Le nectar doit circuler dans la ruche !\n\n" +
    "Saute de plateforme en plateforme\n" +
    "et touche les abeilles dans le bon ordre.\n\n" +
    "Attention aux frelons sur le chemin.\n" +
    "Objectif : atteindre les 5 abeilles\n" +
    "sans te tromper d'ordre.",
    {
      size: 18,
      width: 500,
      lineSpacing: 10,
      align: "center",
    }
  ),
  anchor("center"),
  pos(width() / 2, height() / 2 + 10),
  fixed(),
  color(90, 70, 35),
  z(202),
]);

const introHint = add([
  text("Appuie sur ESPACE pour commencer", { size: 20 }),
  anchor("center"),
  pos(width() / 2, height() / 2 + 135),
  fixed(),
  color(150, 90, 20),
  z(202),
]);

onKeyPress("space", () => {
  if (started) return;

  started = true;

  destroy(introBg);
  destroy(introBox);
  destroy(introTitle);
  destroy(introText);
  destroy(introHint);
});


      // joueur
    const player = add([
      sprite("abeille"),
      pos(60, 480),
      area({
        shape: new Rect(vec2(8, 8), 16, 14),
      }),
      body(),
      scale(2),
      z(10),
      "player",
    ]);
  
    // caméra
    player.onUpdate(() => {
      setCamPos(
        clamp(player.pos.x, width() / 2, 1700 - width() / 2),
        height() / 2,
      );
    });
  
    const SPEED = 200;

onKeyDown("right", () => {
  if (!dead && started) player.move(SPEED, 0);
});

onKeyDown("left", () => {
  if (!dead && started) player.move(-SPEED, 0);
});

onKeyPress("space", () => {
  if (!dead && started && player.isGrounded()) {
    player.jump(400);
  }
});
  
    function die() {
      if (dead) return;
      dead = true;
      player.color = color(255, 80, 80);
      msgText.text = "Aie ! On recommence...";
      msgText.color = color(200, 60, 0);
      wait(1.2, () => go("level3", data));
    }
  
    player.onUpdate(() => {
      if (player.pos.y > 620) die();
    });
  
    onCollide("player", "ennemi", () => die());
  
    onCollide("player", "bee_target", (p, b) => {
      if (dead) return;
  
      if (b.index !== nextBee) {
        msgText.text = "Pas dans le bon ordre !";
        msgText.color = color(200, 60, 0);
        return;
      }
  
      nextBee++;
      scoreText.text = "Abeille suivante : " + Math.min(nextBee + 1, BEE_COUNT) + " / " + BEE_COUNT;
      updateBeeColors();
  
      if (nextBee >= BEE_COUNT) {
        dead = true;
        msgText.text = "Bravo ! Le nectar a bien circulé !";
        msgText.color = color(0, 150, 60);
  
        wait(1.5, () => go("card", {
          label: "Niveau 3 terminé !",
          text:
          "La trophallaxie est un échange de nourriture\n" +
          "entre les abeilles.\n\n" +
          "Elle permet de transmettre le nectar\n" +
          "dans toute la ruche.\n\n" +
          "C'est une étape importante dans\n" +
          "la transformation du nectar en miel.",
          next: "level4",
          nextData: { pollen: pollenPorte },
        }));
      } else {
        msgText.text = "Bien ! Va vers l'abeille suivante.";
        msgText.color = color(0, 120, 180);
      }
    });
  
  
    updateBeeColors();
  });



//  NIVEAU 4 — Evaporation
//  Couloir vertical, activer les zones d'air chaud éviter les gouttes d'eau


scene("level4", (data) => {
    setGravity(0);
    const pollenPorte = data?.pollen ?? 5;
    const TOTAL_ZONES = 6;
    let activated = 0;
    let dead = false;
    let started = false;
    let exitOpen = false;

    add([
      sprite("fondRuche"),
      pos(0, 0),
      fixed(),
      z(-100),
    ])

  
    // UI
    const humidText = add([
      text("Humidité : 100%", { size: 20 }),
      pos(20, 20),
      fixed(),
      z(100),
    ]);
    const msgText = add([
      text("Traverse les zones pour réduire l'humidité !", {
        size: 14,
      }),
      pos(20, 50),
      fixed(),
      z(100),
    ]);

    // écran d'intro
const introBg = add([
  rect(width(), height()),
  pos(0, 0),
  fixed(),
  color(0, 0, 0),
  opacity(0.72),
  z(200),
]);

const introBoxW = 640;
const introBoxH = 340;

const introBox = add([
  rect(introBoxW, introBoxH, { radius: 18 }),
  pos(
    width() / 2 - introBoxW / 2,
    height() / 2 - introBoxH / 2
  ),
  fixed(),
  color(245, 222, 130),
  outline(4, color(170, 120, 40)),
  z(201),
]);

const introTitle = add([
  text("Niveau 4 - Ventilation de la ruche", {size: 20,}),
  anchor("center"),
  pos(width() / 2, height() / 2 - 140),
  fixed(),
  color(95, 60, 20),
  z(202),
]);

const introText = add([
  text(
    "Le nectar contient encore beaucoup d'eau.\n\n" +
    "Les abeilles ventilent la ruche avec leurs ailes\n" +
    "pour faire évaporer l'humidité.\n\n" +
    "Traverse les zones de ventilation\n" +
    "et réduis l'humidité de la ruche.\n" +
    "Attention aux obstacles sur le chemin.",
    {
      size: 18,
      width: 500,
      lineSpacing: 5,
      align: "center",
    }
  ),
  anchor("center"),
  pos(width() / 2, height() / 2 + 10),
  fixed(),
  color(90, 70, 35),
  z(202),
]);

const introHint = add([
  text("Appuie sur ESPACE pour commencer", {
    size: 20,
  }),
  anchor("center"),
  pos(width() / 2, height() / 2 + 145),
  fixed(),
  color(150, 90, 20),
  z(202),
]);

onKeyPress("space", () => {
  if (started) return;

  started = true;

  destroy(introBg);
  destroy(introBox);
  destroy(introTitle);
  destroy(introText);
  destroy(introHint);
});
  
    // murs du couloir
    add([
      rect(30, 1900),
      pos(80, 0),
      area(),
      body({ isStatic: true }),
      color(180, 140, 80),
    ]);
  
    add([
      rect(30, 1900),
      pos(530, 0),
      area(),
      body({ isStatic: true }),
      color(180, 140, 80),
    ]);
  
    add([
      rect(500, 30),
      pos(80, -30),
      area(),
      body({ isStatic: true }),
      color(180, 140, 80),
    ]);
  
    add([
      rect(500, 30),
      pos(80, 1750),
      area(),
      body({ isStatic: true }),
      color(101, 67, 33),
    ]);
  
    // étages
    const ETAGE_H = 250;
  
    for (let i = 0; i < TOTAL_ZONES; i++) {
      const ey = 1600 - i * ETAGE_H;
      const platX = i % 2 === 0 ? 110 : 360;
      const zoneX = i % 2 === 0 ? 360 : 140;
  
      add([
        rect(140, 18),
        pos(platX, ey),
        area(),
        body({ isStatic: true }),
        color(160, 120, 60),
        z(2),
      ]);
  
      add([
        rect(60, 60),
        pos(zoneX, ey - 85),
        area(),
        color(140, 75, 20),
        z(3),
        "hotzone",
        { activated: false },
      ]);
  
    }
  
    // joueur
    const player = add([
      sprite("abeille"),
      pos(300, 1680),
      area({
        shape: new Rect(vec2(8, 8), 16, 14),
      }),
      body(),
      scale(2),
      z(10),
      "player",
    ]);

    const exit = add([
      sprite("alveole"),
      pos(275, 80),
      scale(2.5),
      area(),
      color(240, 190, 50),
      outline(4, color(120, 80, 20)),
      z(5),
      opacity(0),
      "exit",
    ]);
  
    // caméra verticale
    player.onUpdate(() => {
      setCamPos(
        320,
        clamp(player.pos.y, height() / 2, 1750 - height() / 2),
      );
    });
  
    // déplacement
    const SPEED = 180;
    onKeyDown("right", () => {
      if (!dead && started) {
        player.flipX = false;
        player.move(SPEED, 0);
      }
    });
    
    onKeyDown("left", () => {
      if (!dead && started) {
        player.flipX = true;
        player.move(-SPEED, 0);
      }
    });
    onKeyDown("up",    () => { if (!dead && started) player.move(0, -SPEED); });
    onKeyDown("down",  () => { if (!dead && started) player.move(0, SPEED); });
  
    // gouttes
    function spawnDrop() {
      if (dead || !started) return;
  
      const dropX = rand(120, 500);
  
      const drop = add([
        sprite("eau"),
        pos(dropX, camPos().y - height() / 2 - 20),
        scale(2),
        area({
          scale: 0.70,
          offset: vec2(2, 2),
        }),
        z(6),
        "drop",
      ]);
  
      drop.onUpdate(() => {
        if (dead) return;
        drop.move(0, 220);
  
        if (drop.pos.y > camPos().y + height() / 2 + 40) {
          destroy(drop);
        }
      });
    }
  
    loop(1.0, () => {
      if (!dead && started) spawnDrop();
    });
  
    function die() {
      if (dead) return;
      dead = true;
      player.color = color(80, 140, 220);
      msgText.text = "Une goutte ! On recommence...";
      msgText.color = color(80, 100, 200);
  
      wait(1.2, () => go("level4", data));
    }
  
    onCollide("player", "drop", () => die());
  
    onCollide("player", "hotzone", (p, z) => {
      if (z.activated) return;
  
      z.activated = true;
      z.color = color(100, 200, 100);
      activated++;
  
      const pct = Math.round((1 - activated / TOTAL_ZONES) * 100);
      humidText.text = "Humidité : " + pct + "%";
  
      if (activated >= TOTAL_ZONES) {
        exitOpen = true;
      
        humidText.text = "Humidité : 18% OK";
        msgText.text = "Le miel est prêt ! Rejoins la cellule dorée.";
        msgText.color = color(0, 150, 60);
      
        exit.opacity = 1;
      } else {
        msgText.text = "Bien ! Plus que " + (TOTAL_ZONES - activated) + " zones.";
        msgText.color = color(0, 120, 60);
      }
    });

    onCollide("player", "exit", () => {
      if (!exitOpen || dead) return;
    
      dead = true;
    
      msgText.text = "Bravo ! Le miel est terminé.";
      msgText.color = color(0, 150, 60);
    
      wait(1, () => go("card", {
        label: "Niveau 4 terminé !",
        text:
        "Pour devenir du miel, le nectar doit perdre\n" +
        "une grande partie de son eau.\n\n" +
        "Les abeilles ventilent la ruche en battant\n" +
        "des ailes pour faire baisser l'humidité.\n\n" +
        "Le miel peut alors être conservé\n" +
        "pendant très longtemps.",
        next: "level5",
        nextData: { pollen: pollenPorte },
      }));
    });

  });



//  NIVEAU 5 — Operculation
//  Sceller toutes les alveoles avant le timer

scene("level5", (data) => {
    setGravity(600);
    let closed = 0;
    let timeLeft = 45;
    let gameOver = false;
    let started = false;
    const TOTAL = 8;

    add([
      sprite("fondRuche"),
      pos(0, 0),
      fixed(),
      z(-100),
    ])
  
    // UI
    const scoreText = add([
      text("Scellées : 0 / " + TOTAL, { size: 20 }),
      pos(20, 20),
      fixed(),
      z(100),
    ]);
  
    const timerText = add([
      text("Temps : 45s", { size: 20 }),
      pos(580, 20),
      fixed(),
      z(100),
      color(150, 60, 0),
    ]);
  
    const msgText = add([
      text("Atteins les alvéoles pour les sceller !", { size: 14 }),
      pos(20, 55),
      fixed(),
      z(100),
      color(120, 80, 0),
    ]);
  
    // sol
    add([
      rect(3200, 30),
      pos(0, 550),
      area(),
      body({ isStatic: true }),
      color(101, 67, 33),
    ]);
  
    // plateformes + alveoles
    const layout = [
      { px: 0,    py: 520, pw: 180, ax: 120,  ay: 478 },
      { px: 340,  py: 430, pw: 140, ax: 385,  ay: 388 },
      { px: 680,  py: 340, pw: 120, ax: 715,  ay: 298 },
      { px: 1020, py: 430, pw: 140, ax: 1060, ay: 388 },
      { px: 1300, py: 300, pw: 120, ax: 1350, ay: 258 },
      { px: 1600, py: 390, pw: 140, ax: 1640, ay: 348 },
      { px: 1850, py: 260, pw: 120, ax: 1880, ay: 218 },
      { px: 2180, py: 340, pw: 140, ax: 2220, ay: 298 },
    ];
  
    layout.forEach((l) => {
      add([
        rect(l.pw, 18),
        pos(l.px, l.py),
        area(),
        body({ isStatic: true }),
        color(180, 140, 60),
        z(2),
      ]);
  
      add([
        sprite("alveole2"),
        pos(l.ax, l.ay),
        scale(0.06),
        area(),
        z(5),
        "alveole",
        { sealed: false },
      ]);
    });
  
    // 2 ennemis 
    const guards = [
      { x: 760,  y: 290, range: 80 },
      { x: 1700, y: 340, range: 90 },
    ];
  
    guards.forEach(g => {
      const f = add([
        sprite('frelon'),
        pos(g.x, g.y),
        area({
          scale: 0.75,
          offset: vec2(3, 3),
        }),
        z(5),
        "ennemi",
        { startX: g.x, range: g.range, dir: 1, speed: 75 },
      ]);
  
      f.onUpdate(() => {
        f.move(f.dir * f.speed, 0);
        if (f.pos.x > f.startX + f.range) f.dir = -1;
        if (f.pos.x < f.startX - f.range) f.dir = 1;
      });
    });

    
// écran d'intro
const introBg = add([
  rect(width(), height()),
  pos(0, 0),
  fixed(),
  color(0, 0, 0),
  opacity(0.72),
  z(200),
]);

const introBoxW = 640;
const introBoxH = 340;

const introBox = add([
  rect(introBoxW, introBoxH, { radius: 18 }),
  pos(width() / 2 - introBoxW / 2, height() / 2 - introBoxH / 2),
  fixed(),
  color(245, 222, 130),
  outline(4, color(170, 120, 40)),
  z(201),
]);

const introTitle = add([
  text("Niveau 5 - L'operculation", { size: 30 }),
  anchor("center"),
  pos(width() / 2, height() / 2 - 115),
  fixed(),
  color(95, 60, 20),
  z(202),
]);

const introText = add([
  text(
    "Scelle les 8 alvéoles pour protéger le miel\n" +
    "avant la fin du temps !\n\n" +
    "Saute de plateforme en plateforme\n" +
    "et évite les frelons.\n\n" +
    "Objectif : fermer toutes les alvéoles.",
    {
      size: 18,
      width: 500,
      lineSpacing: 10,
      align: "center",
    }
  ),
  anchor("center"),
  pos(width() / 2, height() / 2 + 10),
  fixed(),
  color(90, 70, 35),
  z(202),
]);

const introHint = add([
  text("Appuie sur ESPACE pour commencer", { size: 20 }),
  anchor("center"),
  pos(width() / 2, height() / 2 + 125),
  fixed(),
  color(150, 90, 20),
  z(202),
]);

onKeyPress("space", () => {
  if (started) return;

  started = true;

  destroy(introBg);
  destroy(introBox);
  destroy(introTitle);
  destroy(introText);
  destroy(introHint);
});
  
    // joueur
    const player = add([
      sprite("abeille"),
      pos(10, 450),
      area({
        shape: new Rect(vec2(8, 8), 16, 14),
      }),
      body(),
      scale(2),
      z(10),
      "player",
    ]);
  
    player.onUpdate(() => {
      setCamPos(
        clamp(player.pos.x, width() / 2, 2850 - width() / 2),
        height() / 2,
      );
    });
  
    const SPEED = 200;
    onKeyDown("right", () => {
      if (!gameOver && started) player.move(SPEED, 0);
    });
    
    onKeyDown("left", () => {
      if (!gameOver && started) player.move(-SPEED, 0);
    });
    
    onKeyPress("space", () => {
      if (!gameOver && started && player.isGrounded()) {
        player.jump(420);
      }
    });
  
    onCollide("player", "alveole", (p, a) => {
      if (a.sealed || gameOver) return;
  
      a.sealed = true;
      a.color = color(200, 150, 60);
      closed++;
      scoreText.text = "Scellees : " + closed + " / " + TOTAL;
  
  
      if (closed >= TOTAL) {
        gameOver = true;
        msgText.text = "Tout est scellé ! Le miel est conservé !";
        msgText.color = color(0, 150, 60);
        wait(2, () => go("end"));
      }
    });
  
    function die() {
      if (gameOver) return;
      gameOver = true;
      player.color = color(255, 80, 80);
      msgText.text = "Touché ! On recommence...";
      msgText.color = color(200, 60, 0);
      wait(1.2, () => go("level5", data));
    }
  
    onCollide("player", "ennemi", () => die());
  
    player.onUpdate(() => {
      if (player.pos.y > 620) die();
    });
  
    onUpdate(() => {
      if (gameOver || !started) return;
  
      timeLeft -= dt();
      timerText.text = "Temps : " + Math.ceil(timeLeft) + "s";
  
      if (timeLeft <= 10) {
        timerText.color = color(220, 60, 0);
      }
  
      if (timeLeft <= 0) {
        gameOver = true;
        msgText.text = "Temps ecoulé ! Réessaie !";
        msgText.color = color(200, 60, 0);
        wait(1.5, () => go("level5", data));
      }
    });
  
  });


//  CARTE PEDAGOGIQUE entre les niveaux


scene("card", (data) => {
  setGravity(0);

  // fond sombre
  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.72),
    z(0),
  ]);

  const cardW = 640;
  const cardH = 360;

  // carte centrale
  add([
    rect(cardW, cardH, { radius: 18 }),
    pos(width() / 2 - cardW / 2, height() / 2 - cardH / 2),
    color(245, 222, 130),
    outline(4, color(170, 120, 40)),
    z(5),
  ]);

  // titre
  add([
    text(data.label ?? "Le savais-tu ?", { size: 30 }),
    anchor("center"),
    pos(width() / 2, height() / 2 - 140),
    color(95, 60, 20),
    z(6),
  ]);

  // ligne séparation
  add([
    rect(500, 4, { radius: 2 }),
    anchor("center"),
    pos(width() / 2, height() / 2 - 100),
    color(170, 120, 40),
    z(6),
  ]);

  // texte explicatif
  add([
    text(data.text ?? "", {
      size: 18,
      width: 500,
      lineSpacing: 10,
      align: "center",
    }),
    anchor("center"),
    pos(width() / 2, height() / 2 + 25),
    color(90, 70, 35),
    z(6),
  ]);

  // indication continuer
  add([
    text("Appuie sur ESPACE pour continuer", { size: 20 }),
    anchor("center"),
    pos(width() / 2, height() / 2 + 155),
    color(150, 90, 20),
    z(6),
  ]);

  onKeyPress("space", () => go(data.next, data.nextData ?? {}));
});



//  ECRAN DE FIN


scene("end", () => {
  setGravity(0);

  // fond sombre
  add([
    rect(width(), height()),
    pos(0, 0),
    color(0, 0, 0),
    opacity(0.72),
    z(0),
  ]);

  const cardW = 900;
  const cardH = 620;

  // carte centrale
  add([
    rect(cardW, cardH, { radius: 18 }),
    pos(width() / 2 - cardW / 2, height() / 2 - cardH / 2),
    color(245, 222, 130),
    outline(4, color(170, 120, 40)),
    z(1),
  ]);

  // titre
  add([
    text("Bravo ! Le miel est terminé", {
      size: 32,
    }),
    anchor("center"),
    pos(width() / 2, height() / 2 - 280),
    color(95, 60, 20),
    z(2),
  ]);

  // sprite miel
add([
  sprite("miel"),
  pos(width() / 2, height() / 2 + 150),
  anchor("center"),
  scale(0.1),
  z(2),
]);

  // texte
  add([
    text(
      "Tu as suivi toutes les étapes de fabrication du miel !\n\n" +
      "De la récolte du nectar jusqu'à l'operculation,les abeilles accomplissent un travail incroyable\n" +
      "pour produire et conserver le miel.\n\n" +
      "Merci d'avoir aidé la ruche !",
      {
        size: 20,
        width: 560,
        lineSpacing: 10,
        align: "center",
      }
    ),
    anchor("center"),
    pos(width() / 2, height() / 2 - 50),
    color(90, 70, 35),
    z(2),
  ]);

  // bouton/restart
  add([
    text("Appuie sur ESPACE pour rejouer", {
      size: 20,
    }),
    anchor("center"),
    pos(width() / 2, height() / 2 + 250),
    color(150, 90, 20),
    z(2),
  ]);

  onKeyPress("space", () => {
    go("intro");
  });
});


// démarre le jeu
go("intro");