import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

kaplay({
  background: [180, 230, 150],
});


const WORLD_W = 2000;
const WORLD_H = 1500;

// chargement des assets
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



//  NIVEAU 1 — Récolter le pollen
//  Vue de dessus, explorer la prairie

scene("level1", () => {
    setGravity(0);
    let pollen = 0;
    const POLLEN_GOAL = 10;
  
    // UI
    const pollenText = add([
      text("Pollen : 0 / " + POLLEN_GOAL, { size: 20 }),
      pos(20, 20),
      fixed(),
      z(100),
    ]);
  
    const msgText = add([
      text("Explore la prairie et recolte du pollen !", { size: 14 }),
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
  
    // joueur
    const player = add([
      sprite("abeille"),
      pos(100, 200),
      area({
        scale: 0.6,
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
    onKeyDown("left",  () => player.move(-SPEED, 0));
    onKeyDown("right", () => player.move(SPEED,  0));
    onKeyDown("up",    () => player.move(0, -SPEED));
    onKeyDown("down",  () => player.move(0,  SPEED));
  
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
      msgText.text = "Appuie sur ESPACE pour recolter !";
      msgText.color = color(200, 100, 0);
    });
  
    onCollideEnd("player", "flower", () => {
      currentFlower = null;
      msgText.text = "Explore la prairie et recolte du pollen !";
      msgText.color = color(60, 90, 40);
    });
  
    onKeyPress("space", () => {
      if (currentFlower && currentFlower.exists()) {
        pollen++;
        destroy(currentFlower);
        currentFlower = null;
        pollenText.text = "Pollen : " + pollen + " / " + POLLEN_GOAL;
  
        if (pollen >= POLLEN_GOAL) {
          msgText.text = "Bravo ! Tu as recolte assez de pollen !";
          msgText.color = color(0, 150, 60);
          wait(2, () => go("card", {
            label: "Niveau 1 termine !",
            text: "Le savais-tu ?\nL'abeille aspire le nectar des fleurs\navec sa langue, et le stocke dans\nson jabot — une petite poche\ndans son ventre.\nUne seule abeille visite jusqu'a\n1000 fleurs par voyage !",
            next: "level2",
            nextData: { pollen },
          }));
        } else {
          msgText.text = "Super ! Plus que " + (POLLEN_GOAL - pollen) + " a recolter.";
          msgText.color = color(60, 90, 40);
        }
      }
    });
  });



//  NIVEAU 2 — Transporter vers la ruche
//  Plateforme horizontal, abeille qui vole


scene("level2", (data) => {
  setGravity(0);

  const pollenPorte = data?.pollen ?? 5;
  let dead = false;
  let started = false;
  let hiveTime = false;
  let score = 0;

  const GOAL = 10;

  // UI
  const scoreText = add([
    text("Obstacles evites : 0 / " + GOAL, { size: 18 }),
    pos(20, 20),
    fixed(),
    z(100),
  ]);

  const msgText = add([
    text("ESPACE = battre des ailes pour eviter les frelons", { size: 14 }),
    pos(20, 50),
    fixed(),
    z(100),
    color(60, 90, 40),
  ]);

  // message de départ
  const startBox = add([
    rect(360, 90),
    pos(220, 230),
    color(255, 240, 180),
    outline(3, rgb(180, 120, 0)),
    fixed(),
    z(200),
  ]);

  const startText = add([
    text("Niveau 2\nESPACE = decoller\nEvite les frelons !", {
      size: 18,
      align: "center",
    }),
    pos(250, 245),
    color(100, 70, 10),
    fixed(),
    z(201),
  ]);

  // sol
  add([
    rect(3000, 30),
    pos(0, 570),
    area(),
    body({ isStatic: true }),
    color(120, 80, 40),
    "danger",
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
      scale: 0.45,
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
      destroy(startText);
      destroy(startBox);
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
    msgText.text = "Bravo ! Tu es rentree a la ruche !";
    msgText.color = color(0, 150, 80);

    wait(1.5, () => go("card", {
      label: "Niveau 2 termine !",
      text: "Le savais-tu ?\nDe retour a la ruche, l'abeille\nregurgite le nectar a une autre abeille,\nqui le regurgite a une autre...\nCe processus s'appelle la trophallaxie.",
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
        scoreText.text = "Obstacles evites : " + score + " / " + GOAL;

        if (score >= GOAL && !hiveTime) {
          hiveTime = true;
          msgText.text = "Continue ! Va jusqu'a la ruche !";
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
    player.move(0, player.vy);

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
    const BEE_COUNT = 5;
    let dead = false;
  
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
      color(120, 80, 0),
    ]);
  
    // sol
    add([
      rect(2200, 30),
      pos(0, 550),
      area(),
      body({ isStatic: true }),
      color(101, 67, 33),
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
          f.move(f.dir * f.speed, 0);
          if (f.pos.x > f.startX + f.range) f.dir = -1;
          if (f.pos.x < f.startX - f.range) f.dir = 1;
        });
      });
  
    // joueur
    const player = add([
      sprite("abeille"),
      pos(60, 480),
      area({
        shape: new Rect(vec2(10, 10), 24, 24),
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
    onKeyDown("right", () => { if (!dead) player.move(SPEED, 0); });
    onKeyDown("left",  () => { if (!dead) player.move(-SPEED, 0); });
    onKeyPress("space", () => {
      if (!dead && player.isGrounded()) player.jump(400);
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
        msgText.text = "Bravo ! Le nectar a bien circule !";
        msgText.color = color(0, 150, 60);
  
        wait(1.5, () => go("card", {
          label: "Niveau 3 termine !",
          text: "Le savais-tu ?\nLa trophallaxie est l'echange de nourriture\nentre les abeilles. Cela permet de partager\nle nectar dans toute la ruche.",
          next: "level4",
          nextData: { pollen: pollenPorte },
        }));
      } else {
        msgText.text = "Bien ! Va vers l'abeille suivante.";
        msgText.color = color(0, 120, 180);
      }
    });
  
    add([
      text("Trophallaxie : le nectar passe d'abeille en abeille dans l'ordre.", { size: 12 }),
      pos(20, 555),
      fixed(),
      z(100),
      color(150, 110, 50),
    ]);
  
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

  
    // UI
    const humidText = add([
      text("Humidite : 100%", { size: 20 }),
      pos(20, 20),
      fixed(),
      z(100),
      color(60, 100, 180),
    ]);

    const introBox = add([
      rect(460, 260),
      pos(90, 180),
      fixed(),
      z(200),
      color(245, 220, 160),
      outline(4, color(120, 80, 30)),
    ]);
    
    const introText = add([
      text(
        "NIVEAU 4\n\nLa ruche est trop humide !\n\nActive les zones de ventilation\npour evaporer l'eau du nectar.\n\nEvite les gouttes d'eau !\n\nAppuie sur ESPACE pour commencer.",
        { size: 18, width: 420, align: "center" }
      ),
      pos(110, 210),
      fixed(),
      z(201),
      color(80, 50, 20),
    ]);
    
    onKeyPress("space", () => {
      if (started) return;
    
      started = true;
      destroy(introBox);
      destroy(introText);
    });
  

    const msgText = add([
      text("Active les zones orange pour evaporer l'eau !", { size: 14 }),
      pos(20, 55),
      fixed(),
      z(100),
      color(120, 80, 0),
    ]);
  
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
        color(220, 120, 40),
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
        scale: 0.6,
        offset: vec2(6, 6),
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
      humidText.text = "Humidite : " + pct + "%";
  
      if (activated >= TOTAL_ZONES) {
        exitOpen = true;
      
        humidText.text = "Humidite : 18% OK";
        msgText.text = "Le miel est pret ! Rejoins la cellule doree.";
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
    
      msgText.text = "Bravo ! Le miel est termine.";
      msgText.color = color(0, 150, 60);
    
      wait(1, () => go("card", {
        label: "Niveau 4 termine !",
        text: "Le savais-tu ?\nLes abeilles battent des ailes pour\nfaire evaporer l'eau du nectar.\nPetit a petit, il devient plus epais\njusqu'a se transformer en miel.",
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
    const TOTAL = 8;
  
    // UI
    const scoreText = add([
      text("Scellees : 0 / " + TOTAL, { size: 20 }),
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
      text("Atteins les alveoles pour les sceller !", { size: 14 }),
      pos(20, 55),
      fixed(),
      z(100),
      color(120, 80, 0),
    ]);
  
    // sol
    add([
      rect(2200, 30),
      pos(0, 550),
      area(),
      body({ isStatic: true }),
      color(101, 67, 33),
    ]);
  
    // plateformes + alveoles
    const layout = [
      { px: 0,    py: 520, pw: 180, ax: 60,   ay: 478 },
      { px: 240,  py: 430, pw: 140, ax: 285,  ay: 388 },
      { px: 460,  py: 340, pw: 120, ax: 495,  ay: 298 },
      { px: 680,  py: 430, pw: 140, ax: 720,  ay: 388 },
      { px: 900,  py: 300, pw: 120, ax: 935,  ay: 258 },
      { px: 1120, py: 390, pw: 140, ax: 1160, ay: 348 },
      { px: 1340, py: 260, pw: 120, ax: 1375, ay: 218 },
      { px: 1560, py: 340, pw: 140, ax: 1600, ay: 298 },
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
        rect(44, 44),
        pos(l.ax, l.ay),
        area(),
        color(255, 200, 50),
        z(5),
        "alveole",
        { sealed: false },
      ]);
    });
  
    // 2 ennemis 
    const guards = [
      { x: 520,  y: 290, range: 80 },
      { x: 1180, y: 340, range: 90 },
    ];
  
    guards.forEach(g => {
      const f = add([
        sprite('frelon'),
        pos(g.x, g.y),
        area({
          scale: 0.75,
          offset: vec2(3, 3),
        }),
        color(220, 100, 30),
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
  
    // joueur
    const player = add([
      sprite("abeille"),
      pos(150, 450),
      area({
        scale: 0.6,
        offset: vec2(6, 6),
      }),
      body(),
      scale(2),
      z(10),
      "player",
    ]);
  
    player.onUpdate(() => {
      setCamPos(
        clamp(player.pos.x, width() / 2, 1850 - width() / 2),
        height() / 2,
      );
    });
  
    const SPEED = 200;
    onKeyDown("right", () => { if (!gameOver) player.move(SPEED, 0); });
    onKeyDown("left",  () => { if (!gameOver) player.move(-SPEED, 0); });
    onKeyPress("space", () => {
      if (!gameOver && player.isGrounded()) player.jump(420);
    });
  
    onCollide("player", "alveole", (p, a) => {
      if (a.sealed || gameOver) return;
  
      a.sealed = true;
      a.color = color(180, 140, 80);
      closed++;
      scoreText.text = "Scellees : " + closed + " / " + TOTAL;
  
      add([
        rect(44, 8),
        pos(a.pos.x, a.pos.y + 18),
        color(140, 100, 40),
        z(7),
      ]);
  
      add([
        rect(8, 44),
        pos(a.pos.x + 18, a.pos.y),
        color(140, 100, 40),
        z(7),
      ]);
  
      if (closed >= TOTAL) {
        gameOver = true;
        msgText.text = "Tout est scelle ! Le miel est conserve !";
        msgText.color = color(0, 150, 60);
        wait(2, () => go("end"));
      }
    });
  
    function die() {
      if (gameOver) return;
      gameOver = true;
      player.color = color(255, 80, 80);
      msgText.text = "Touche ! On recommence...";
      msgText.color = color(200, 60, 0);
      wait(1.2, () => go("level5", data));
    }
  
    onCollide("player", "ennemi", () => die());
  
    player.onUpdate(() => {
      if (player.pos.y > 620) die();
    });
  
    onUpdate(() => {
      if (gameOver) return;
  
      timeLeft -= dt();
      timerText.text = "Temps : " + Math.ceil(timeLeft) + "s";
  
      if (timeLeft <= 10) {
        timerText.color = color(220, 60, 0);
      }
  
      if (timeLeft <= 0) {
        gameOver = true;
        msgText.text = "Temps ecoule ! Reessaie !";
        msgText.color = color(200, 60, 0);
        wait(1.5, () => go("level5", data));
      }
    });
  
    add([
      text("L'operculation : les alveoles sont fermees avec de la cire.", { size: 12 }),
      pos(20, 555),
      fixed(),
      z(100),
      color(150, 110, 50),
    ]);
  });


//  CARTE PEDAGOGIQUE entre les niveaux


scene("card", (data) => {
  setGravity(0);

  add([rect(800, 600), pos(0, 0), color(255, 245, 200), z(0)]);

  // titre
  add([
    text(data.label ?? "Le savais-tu ?", { size: 22 }),
    pos(80, 60),
    color(180, 120, 0),
    z(5),
  ]);

  // ligne de séparation
  add([rect(640, 4), pos(80, 100), color(220, 170, 80), z(5)]);

  // texte explicatif
  add([
    text(data.text ?? "", { size: 16, width: 620 }),
    pos(90, 120),
    color(100, 70, 10),
    z(5),
  ]);

  // bouton continuer
  add([
    rect(240, 52),
    pos(280, 500),
    area(),
    color(255, 200, 0),
    z(6),
    "btn_next",
  ]);
  add([
    text("Continuer  ->", { size: 20 }),
    pos(300, 514),
    color(120, 80, 0),
    z(7),
  ]);

  onClick("btn_next", () => go(data.next, data.nextData ?? {}));
  onKeyPress("space",  () => go(data.next, data.nextData ?? {}));
});



//  ECRAN DE FIN


scene("end", () => {
  setGravity(0);

  add([rect(800, 600), pos(0, 0), color(255, 240, 180), z(0)]);

  add([
    text("Bravo !", { size: 52 }),
    pos(280, 80),
    color(180, 120, 0),
    z(5),
  ]);

  add([rect(640, 4), pos(80, 150), color(220, 170, 80), z(5)]);

  add([
    text(
      "Tu as appris toutes les etapes :\n\n" +
      "1. Recolter le nectar des fleurs\n" +
      "2. Le transporter jusqu'a la ruche\n" +
      "3. Le passer d'abeille en abeille (trophallaxie)\n" +
      "4. Evaporer l'eau pour concentrer les sucres\n" +
      "5. Sceller les alveoles avec de la cire",
      { size: 16, width: 620 }
    ),
    pos(90, 170),
    color(100, 70, 10),
    z(5),
  ]);

  // bouton rejouer
  add([
    rect(240, 52),
    pos(280, 510),
    area(),
    color(255, 200, 0),
    z(6),
    "btn_restart",
  ]);
  add([
    text("Rejouer", { size: 22 }),
    pos(320, 523),
    color(120, 80, 0),
    z(7),
  ]);

  onClick("btn_restart", () => go("level1"));
  onKeyPress("space",    () => go("level1"));
});


// démarre le jeu
go("level4");