/* ------------------------------------------------------------------ */
/*  WeStack WebGL hero — a living "stack" of compute layers.           */
/*  Lazy: three is dynamically imported so it ships as its own chunk.  */
/*  Theme-aware: the whole scene swaps palettes with the site's        */
/*  dark/light toggle (a MutationObserver watches `.light` on <html>). */
/* ------------------------------------------------------------------ */

export async function initHeroWebGL(canvas) {
  if (!canvas) return null;
  if (
    typeof WebGLRenderingContext === "undefined" ||
    (window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    return null;
  }

  let THREE;
  try {
    THREE = await import("three");
  } catch {
    return null;
  }

  const isLightTheme = () =>
    document.documentElement.classList.contains("light");

  /* --------------------------- Theme palettes ----------------------- */
  const darkTheme = {
    bg: 0x06060b,
    layerTints: [
      0x8b7cff, 0xc084fc, 0xa78bfa, 0x8b5cf6, 0x60a5fa, 0x3b82f6, 0xec4899,
    ],
    layerOpacity: 0.16,
    layerEmissive: 0.14,
    edgeFrom: 0xc084fc,
    edgeTo: 0xec4899,
    edgeAdditive: true,
    ambient: 0x2a2340,
    ambientIntensity: 0.6,
    cursor: 0xc084fc,
    particles: [0xc084fc, 0x8b5cf6, 0xec4899, 0x3b82f6, 0xeeeef4],
    particleAdditive: true,
  };

  const lightTheme = {
    bg: 0xfaf8ff,
    layerTints: [
      0x7c3aed, 0x6d28d9, 0xa78bfa, 0x8b5cf6, 0x60a5fa, 0x2563eb, 0xdb2777,
    ],
    layerOpacity: 0.35,
    layerEmissive: 0.1,
    edgeFrom: 0x6d28d9,
    edgeTo: 0xbe185d,
    edgeAdditive: false,
    ambient: 0xd9d2f5,
    ambientIntensity: 0.95,
    cursor: 0x6d28d9,
    particles: [0x7c3aed, 0x8b5cf6, 0xdb2777, 0x2563eb, 0x1a1528],
    particleAdditive: false,
  };

  let currentTheme = isLightTheme() ? lightTheme : darkTheme;

  const sceneBg = new THREE.Color();
  const scratch = new THREE.Color();

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(sceneBg.copy(new THREE.Color(currentTheme.bg)), 1);

  const scene = new THREE.Scene();
  scene.background = sceneBg.clone();
  scene.fog = new THREE.FogExp2(sceneBg.clone(), 0.085);

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / Math.max(canvas.clientHeight, 1),
    0.1,
    60,
  );
  camera.position.set(0, 0.4, 10);

  /* --------------------------- The Stack --------------------------- */
  const stack = new THREE.Group();
  const layerGroups = [];

  const LAYERS = 7;
  const layerMats = [];
  const edgeMats = [];
  const edgeFrom = new THREE.Color(currentTheme.edgeFrom);
  const edgeTo = new THREE.Color(currentTheme.edgeTo);
  for (let i = 0; i < LAYERS; i++) {
    const t = i / (LAYERS - 1);
    const w = 3.4 - t * 1.1;
    const d = 1.7 - t * 0.55;
    const geo = new THREE.BoxGeometry(w, 0.16, d);

    const tint = new THREE.Color(
      currentTheme.layerTints[i % currentTheme.layerTints.length],
    );
    const layerMat = new THREE.MeshStandardMaterial({
      color: tint,
      transparent: true,
      opacity: currentTheme.layerOpacity,
      roughness: 0.4,
      metalness: 0.55,
      emissive: tint,
      emissiveIntensity: currentTheme.layerEmissive,
    });
    layerMats.push(layerMat);

    const edgeMat = new THREE.LineBasicMaterial({
      color: edgeFrom.clone().lerp(edgeTo, t),
      transparent: true,
      opacity: 0.9,
      blending: currentTheme.edgeAdditive
        ? THREE.AdditiveBlending
        : THREE.NormalBlending,
    });
    edgeMats.push(edgeMat);

    const mesh = new THREE.Mesh(geo, layerMat);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      edgeMat,
    );

    const g = new THREE.Group();
    g.add(mesh, edges);
    g.position.y = i * 0.62 - LAYERS * 0.62 * 0.5 + 0.31;
    layerGroups.push(g);
    stack.add(g);
  }
  scene.add(stack);

  /* --------------------------- Lighting ---------------------------- */
  const ambientLight = new THREE.AmbientLight(
    currentTheme.ambient,
    currentTheme.ambientIntensity,
  );
  scene.add(ambientLight);
  const cursorLight = new THREE.PointLight(currentTheme.cursor, 0, 16, 2);
  cursorLight.position.set(0, 0.6, 4.5);
  scene.add(cursorLight);

  /* --------------------------- Particles --------------------------- */
  const COUNT = 1500;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  // Which palette slot each particle keeps — so a theme switch can
  // recolour the vertex buffer without touching the positions.
  const slots = new Uint8Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const r = 5.5 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const roll = Math.random();
    slots[i] =
      roll < 0.4 ? 0 : roll < 0.6 ? 3 : roll < 0.75 ? 1 : roll < 0.9 ? 2 : 4;
  }

  // Rebuild the per-vertex colour buffer from a palette of THREE.Color
  const fillPalette = (palette, target) => {
    for (let i = 0; i < COUNT; i++) {
      const c = palette[slots[i]];
      target[i * 3] = c.r;
      target[i * 3 + 1] = c.g;
      target[i * 3 + 2] = c.b;
    }
  };

  const basePositions = positions.slice();

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const colorAttr = pGeo.attributes.color;

  fillPalette(
    currentTheme.particles.map((hex) => new THREE.Color(hex)),
    colors,
  );
  colorAttr.needsUpdate = true;

  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 64;
  const ctx = sprite.getContext("2d");
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const spriteTex = new THREE.CanvasTexture(sprite);

  const pMat = new THREE.PointsMaterial({
    size: 0.06,
    map: spriteTex,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: currentTheme.particleAdditive
      ? THREE.AdditiveBlending
      : THREE.NormalBlending,
  });

  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* --------------------------- Interaction ------------------------- */
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  const onPointer = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onTouch = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (touch.clientY / window.innerHeight) * 2 - 1;
  };
  const onLeave = (e) => {
    if (!e.relatedTarget) {
      pointer.x = 0;
      pointer.y = 0;
    }
  };
  window.addEventListener("mousemove", onPointer, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);

  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };
  onResize();
  window.addEventListener("resize", onResize, { passive: true });

  /* ----------------------------- Entrance -------------------------- */
  const entrance = { rx: 0.55, ry: 0.9, rz: -0.14, dy: -1.15, s: 0.96 };
  const playEntrance = () => {
    const play = () => {
      if (window.__ws && window.__ws.gsap) {
        window.__ws.gsap.to(entrance, {
          rx: 0,
          ry: 0,
          rz: 0,
          dy: 0,
          s: 1,
          duration: 1.8,
          ease: "power3.out",
        });
      } else {
        entrance.rx = entrance.ry = entrance.rz = entrance.dy = 0;
        entrance.s = 1;
      }
    };
    if (window.__wsReady) play();
    else document.addEventListener("ws:ready", play, { once: true });
  };
  playEntrance();

  /* ------------------------------ Loop ----------------------------- */
  let running = true;
  let disposed = false;

  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            running = entries[0].isIntersecting;
          },
          { threshold: 0 },
        )
      : null;
  if (io) io.observe(canvas);

  const onVisibility = () => {
    running = !document.hidden;
  };
  document.addEventListener("visibilitychange", onVisibility);

  const posAttr = pGeo.attributes.position;
  const pointer3 = new THREE.Vector3();

  let elapsed = 0;

  const tick = () => {
    if (disposed) return;
    requestAnimationFrame(tick);

    elapsed = performance.now() / 1000;

    if (running) {
      const t = elapsed;

      target.x += (pointer.x - target.x) * 0.06;
      target.y += (pointer.y - target.y) * 0.06;

      // Idle sway that fades as the cursor takes over
      const idle = Math.max(0, 1 - (Math.abs(target.x) + Math.abs(target.y)) * 0.5);

      // Card-like tilt toward the cursor + slow auto-spin + idle drift
      stack.rotation.y =
        t * 0.1 + target.x * 0.6 + Math.sin(t * 0.16) * 0.07 * idle + entrance.ry;
      stack.rotation.x =
        -0.2 - target.y * 0.42 + Math.sin(t * 0.21) * 0.05 * idle + entrance.rx;
      stack.rotation.z = -target.x * 0.12 + target.y * 0.06 + entrance.rz;

      // Layers fan/scatter toward the cursor
      layerGroups.forEach((g, i) => {
        const depth = (i - (LAYERS - 1) / 2) / ((LAYERS - 1) / 2);
        g.position.x = target.x * depth * 0.3;
        g.position.z = -target.x * depth * 0.38;
        g.rotation.y = target.x * depth * 0.24;
      });

      // Breathing scale + float
      const breath = Math.sin(t * 0.8) * 0.024;
      stack.scale.setScalar(entrance.s * (1 + breath));
      stack.position.y = entrance.dy + Math.sin(t * 0.55) * 0.07;

      // Cursor-following accent light
      cursorLight.position.x = target.x * 5;
      cursorLight.position.y = 0.6 + target.y * 3.5;
      cursorLight.intensity = 3 + Math.sin(t * 1.3) * 0.5 + idle * 0.8;

      // Particles: gentle repulsion away from the cursor
      pointer3.set(target.x * 6, target.y * 4, 0);
      const radius = 2.2;
      const strength = 0.55;
      for (let i = 0; i < COUNT; i++) {
        const bx = basePositions[i * 3];
        const by = basePositions[i * 3 + 1];
        const bz = basePositions[i * 3 + 2];
        const dx = bx - pointer3.x;
        const dy = by - pointer3.y;
        const dz = bz - pointer3.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < radius * radius && d2 > 1e-8) {
          const d = Math.sqrt(d2);
          const f = (1 - d / radius) * strength;
          posAttr.array[i * 3] = bx + (dx / d) * f;
          posAttr.array[i * 3 + 1] = by + (dy / d) * f;
          posAttr.array[i * 3 + 2] = bz + (dz / d) * f;
        } else {
          posAttr.array[i * 3] = bx;
          posAttr.array[i * 3 + 1] = by;
          posAttr.array[i * 3 + 2] = bz;
        }
      }
      posAttr.needsUpdate = true;

      particles.rotation.y = t * 0.02;
      particles.rotation.x = Math.sin(t * 0.05) * 0.1;

      const sy = window.scrollY / Math.max(window.innerHeight, 1);
      camera.position.z = 10 + sy * 2.2;
      camera.position.y = 0.4 - sy * 0.6 + target.y * 0.5;
      camera.position.x = target.x * 0.9;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
  };
  tick();

  /* ------------------------- Theme reactivity ---------------------- */
  // Swap the whole scene between the dark and light palettes. Positions
  // never change — only colours, materials, lights and the clear colour.
  const applyTheme = (nextIsLight) => {
    const th = nextIsLight ? lightTheme : darkTheme;
    currentTheme = th;

    // Background / fog / clear colour
    sceneBg.copy(new THREE.Color(th.bg));
    renderer.setClearColor(sceneBg, 1);
    scene.background = sceneBg;
    scene.fog.color.copy(sceneBg);

    // Stack layers — new tint sweep, tuned opacity/emissive for the bg
    const edgeFrom = new THREE.Color(th.edgeFrom);
    const edgeTo = new THREE.Color(th.edgeTo);
    for (let i = 0; i < LAYERS; i++) {
      const tint = new THREE.Color(th.layerTints[i % th.layerTints.length]);
      layerMats[i].color.copy(tint);
      layerMats[i].emissive.copy(tint);
      layerMats[i].opacity = th.layerOpacity;
      layerMats[i].emissiveIntensity = th.layerEmissive;

      const t = i / (LAYERS - 1);
      edgeMats[i].color.copy(scratch.copy(edgeFrom).lerp(edgeTo, t));
      edgeMats[i].blending = th.edgeAdditive
        ? THREE.AdditiveBlending
        : THREE.NormalBlending;
    }

    // Lighting
    ambientLight.color.setHex(th.ambient);
    ambientLight.intensity = th.ambientIntensity;
    cursorLight.color.setHex(th.cursor);

    // Particles — recolour the existing vertex buffer, keep positions
    fillPalette(
      th.particles.map((hex) => new THREE.Color(hex)),
      colors,
    );
    colorAttr.needsUpdate = true;
    pMat.blending = th.particleAdditive
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;
  };

  // Watch the theme toggle (adds/removes `.light` on <html>). Only
  // react when the light-mode membership actually flips (Lenis and
  // others also touch html's class list).
  let wasLight = isLightTheme();
  const themeObserver = new MutationObserver(() => {
    const light = isLightTheme();
    if (light !== wasLight) {
      wasLight = light;
      applyTheme(light);
    }
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  /* ----------------------------- Cleanup --------------------------- */
  return () => {
    if (disposed) return;
    disposed = true;
    if (io) io.disconnect();
    themeObserver.disconnect();
    window.removeEventListener("mousemove", onPointer);
    window.removeEventListener("touchmove", onTouch);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    stack.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
    });
    pGeo.dispose();
    spriteTex.dispose();
    pMat.dispose();
    layerMats.forEach((m) => m.dispose());
    edgeMats.forEach((m) => m.dispose());
    renderer.dispose();
  };
}
