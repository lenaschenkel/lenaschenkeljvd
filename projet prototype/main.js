import kaplay from "https://unpkg.com/kaplay@3001.0.19/dist/kaplay.mjs";

kaplay({
  background: [180, 230, 150],
});

const WORLD_W = 2000;
const WORLD_H = 1500;

// chargement des assets
loadSprite("abeille", "abeille.png");
loadSprite("fleur1",  "fleur1.png");



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
        circle(28),
        pos(t.x, t.y),
        area(),
        body({ isStatic: true }),
        color(34, 139, 34),
        z(1),
      ]);
      add([
        rect(14, 20),
        pos(t.x - 7, t.y + 20),
        color(101, 67, 33),
        z(0),
      ]);
    });
  
    // haie horizontale
    for (let x = 400; x < 900; x += 30) {
      add([
        rect(28, 18),
        pos(x, 320),
        area(),
        body({ isStatic: true }),
        color(60, 140, 60),
      ]);
    }
  
    // haie verticale
    for (let y = 600; y < 1100; y += 30) {
      add([
        rect(18, 28),
        pos(1100, y),
        area(),
        body({ isStatic: true }),
        color(60, 140, 60),
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
      add([
        sprite("fleur1"),
        pos(f.x, f.y),
        scale(2),
        area(),
        "flower",
        { value: 1 },
      ]);
    });
  
    // frelons
    function addFrelon(x, y) {
      const frelon = add([
        rect(20, 20),
        pos(x, y),
        area(),
        color(220, 100, 30),
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
      area(),
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
      text("ESPACE = battre des ailes pour eviter les obstacles", { size: 14 }),
      pos(20, 50),
      fixed(),
      z(100),
      color(60, 90, 40),
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
      pos(120, 250),
      area(),
      scale(2.2),
      z(10),
      "player",
      {
        vy: 0,
      },
    ]);
  
    // caméra
    player.onUpdate(() => {
      setCamPos(
        clamp(player.pos.x, width() / 2, 2600 - width() / 2),
        height() / 2,
      );
    });
  
    // réglages du vol
    const FORWARD_SPEED = 120;
    const FALL_SPEED = 320;
    const FLAP = -220;
  
    onKeyPress("space", () => {
      if (dead) return;
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
  
    function addObstacle(x, y) {
      const size = 22;
  
      const obs = add([
        rect(size, size),
        pos(x, y),
        area(),
        color(220, 80, 80),
        z(5),
        "danger",
        "obstacle",
        { counted: false },
      ]);
  
      obs.onUpdate(() => {
        if (dead) return;
  
        obs.move(-FORWARD_SPEED, 0);
  
        if (!obs.counted && obs.pos.x + size < player.pos.x) {
          obs.counted = true;
          score++;
          scoreText.text = "Obstacles evites : " + score + " / " + GOAL;
  
          if (score >= GOAL) {
            dead = true;
            msgText.text = "Bravo ! Le pollen est livre !";
            msgText.color = color(0, 150, 80);
  
            wait(1.5, () => go("card", {
              label: "Niveau 2 termine !",
              text: "Le savais-tu ?\nDe retour a la ruche, l'abeille\nregurgite le nectar a une autre abeille,\nqui le regurgite a une autre...\nCe processus s'appelle la trophallaxie.",
              next: "level3",
              nextData: { pollen: pollenPorte },
            }));
          }
        }
  
        if (obs.pos.x < -50) {
          destroy(obs);
        }
      });
    }
  
    // obstacles beaucoup plus simples
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
      if (dead) return;
      spawnObstacleGroup(nextX);
      nextX += 360;
    });
  
    player.onUpdate(() => {
      if (dead) return;
  
      player.vy += FALL_SPEED * dt();
      player.move(FORWARD_SPEED, player.vy);
  
      if (player.pos.y > 620 || player.pos.y < -20) {
        die();
      }
    });
  
    onCollide("player", "danger", () => die());
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
      { x: 240,  y: 430, w: 140 },
      { x: 450,  y: 340, w: 120 },
      { x: 650,  y: 430, w: 140 },
      { x: 860,  y: 300, w: 120 },
      { x: 1050, y: 390, w: 140 },
      { x: 1260, y: 260, w: 120 },
      { x: 1450, y: 360, w: 140 },
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
      { x: 280,  y: 390 },
      { x: 490,  y: 300 },
      { x: 700,  y: 390 },
      { x: 900,  y: 260 },
      { x: 1290, y: 220 },
    ];
  
    const beeObjects = [];
    const beeLabels = [];
  
    beePositions.forEach((bp, i) => {
      const b = add([
        rect(34, 34),
        pos(bp.x, bp.y),
        area(),
        color(200, 200, 200),
        z(5),
        "bee_target",
        { index: i },
      ]);
  
      const label = add([
        text("" + (i + 1), { size: 16 }),
        pos(bp.x + 10, bp.y + 7),
        color(60, 40, 0),
        z(6),
      ]);
  
      beeObjects.push(b);
      beeLabels.push(label);
    });
  
    function updateBeeColors() {
      beeObjects.forEach((b, i) => {
        if (i < nextBee) {
          b.color = color(100, 200, 100);
        } else if (i === nextBee) {
          b.color = color(255, 220, 0);
        } else {
          b.color = color(200, 200, 200);
        }
      });
    }
  
    // seulement 2 ennemis, plus simple
    const patrolData = [
        { x: 430, y: 300, range: 80 },   // vers l'abeille 2
        { x: 830, y: 250, range: 80 },   // vers l'abeille 4
        { x: 1210, y: 210, range: 70 },  // avant l'abeille 5
      ];
      
      patrolData.forEach(p => {
        const f = add([
          rect(24, 24),
          pos(p.x, p.y),
          area(),
          color(220, 100, 30),
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
      area(),
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
  
    // UI
    const humidText = add([
      text("Humidite : 100%", { size: 20 }),
      pos(20, 20),
      fixed(),
      z(100),
      color(60, 100, 180),
    ]);
  
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
  
      add([
        text("AIR", { size: 11 }),
        pos(zoneX + 10, ey - 68),
        color(255, 220, 120),
        z(4),
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
      scale(2),
      z(10),
      "player",
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
    onKeyDown("right", () => { if (!dead) player.move(SPEED, 0); });
    onKeyDown("left",  () => { if (!dead) player.move(-SPEED, 0); });
    onKeyDown("up",    () => { if (!dead) player.move(0, -SPEED); });
    onKeyDown("down",  () => { if (!dead) player.move(0, SPEED); });
  
    // gouttes
    function spawnDrop() {
      if (dead) return;
  
      const dropX = rand(120, 500);
  
      const drop = add([
        rect(12, 18),
        pos(dropX, camPos().y - height() / 2 - 20),
        area({
          scale: 0.75,
          offset: vec2(2, 2),
        }),
        color(80, 140, 220),
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
  
    loop(1.6, () => {
      if (!dead) spawnDrop();
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
        dead = true;
        humidText.text = "Humidite : 18% OK";
        msgText.text = "L'eau est evaporee ! Le miel est pret !";
        msgText.color = color(0, 150, 60);
  
        wait(1.5, () => go("card", {
          label: "Niveau 4 termine !",
          text: "Le savais-tu ?\nLes abeilles battent des ailes pour\nfaire evaporer l'eau du nectar.\nPetit a petit, il devient plus epais\njusqu'a se transformer en miel.",
          next: "level5",
          nextData: { pollen: pollenPorte },
        }));
      } else {
        msgText.text = "Bien ! Plus que " + (TOTAL_ZONES - activated) + " zones.";
        msgText.color = color(0, 120, 60);
      }
    });
  
    add([
      text("Le nectar perd de l'eau grace a l'air en mouvement.", { size: 12 }),
      pos(20, 555),
      fixed(),
      z(100),
      color(150, 110, 50),
    ]);
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
  
    // 2 ennemis seulement
    const guards = [
      { x: 520,  y: 290, range: 80 },
      { x: 1180, y: 340, range: 90 },
    ];
  
    guards.forEach(g => {
      const f = add([
        rect(24, 24),
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