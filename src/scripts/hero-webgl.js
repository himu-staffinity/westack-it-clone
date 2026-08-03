/* ------------------------------------------------------------------ */
/*  WeStack WebGL hero — a living "stack" of compute layers.           */
/*  Lazy: three is dynamically imported so it ships as its own chunk.  */
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

  const BG = 0x07090e;

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
  renderer.setClearColor(BG, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(BG, 0.085);

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / Math.max(canvas.clientHeight, 1),
    0.1,
    60,
  );
  camera.position.set(0, 0.4, 10);

  /* --------------------------- The Stack --------------------------- */
  const stack = new THREE.Group();

  const layerMat = new THREE.MeshStandardMaterial({
    color: 0x8fd8e8,
    transparent: true,
    opacity: 0.14,
    roughness: 0.35,
    metalness: 0.6,
    emissive: 0x48e5ff,
    emissiveIntensity: 0.18,
  });

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x48e5ff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  const LAYERS = 7;
  for (let i = 0; i < LAYERS; i++) {
    const t = i / (LAYERS - 1);
    const w = 3.4 - t * 1.1;
    const d = 1.7 - t * 0.55;
    const geo = new THREE.BoxGeometry(w, 0.16, d);
    const mesh = new THREE.Mesh(geo, layerMat);
    mesh.position.y = i * 0.62 - LAYERS * 0.62 * 0.5 + 0.31;
    stack.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo),
      edgeMat,
    );
    edges.position.copy(mesh.position);
    stack.add(edges);
  }
  scene.add(stack);

  /* --------------------------- Particles --------------------------- */
  const COUNT = 1500;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);

  const cyan = new THREE.Color(0x48e5ff);
  const violet = new THREE.Color(0x8b7cff);
  const amber = new THREE.Color(0xffb46b);
  const white = new THREE.Color(0xeef2f8);

  for (let i = 0; i < COUNT; i++) {
    const r = 5.5 + Math.random() * 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const roll = Math.random();
    const c =
      roll < 0.55 ? cyan : roll < 0.75 ? white : roll < 0.9 ? violet : amber;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

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
    blending: THREE.AdditiveBlending,
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
  window.addEventListener("mousemove", onPointer, { passive: true });

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
  const playEntrance = () => {
    const play = () => {
      if (window.__ws && window.__ws.gsap) {
        window.__ws.gsap.fromTo(
          stack.rotation,
          { x: 0.55, y: 0.9, z: -0.12 },
          {
            x: -0.18,
            y: 0,
            z: 0,
            duration: 1.6,
            ease: "power3.out",
          },
        );
        window.__ws.gsap.fromTo(
          stack.position,
          { y: -0.9 },
          { y: 0, duration: 1.6, ease: "power3.out" },
        );
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

  let startTime = performance.now();
  let elapsed = 0;

  const tick = () => {
    if (disposed) return;
    requestAnimationFrame(tick);

    const now = performance.now();
    const dt = Math.min((now - (startTime || now)) / 1000, 0.1);
    startTime = now;
    elapsed = now / 1000;

    if (running) {
      const t = elapsed;

      target.x += (pointer.x - target.x) * 0.04;
      target.y += (pointer.y - target.y) * 0.04;

      stack.rotation.y += dt * 0.12;
      stack.rotation.x = -0.18 + target.y * 0.14;
      stack.rotation.z = target.x * 0.06;

      particles.rotation.y = t * 0.02;
      particles.rotation.x = Math.sin(t * 0.05) * 0.1;

      const sy = window.scrollY / Math.max(window.innerHeight, 1);
      camera.position.z = 10 + sy * 2.2;
      camera.position.y = 0.4 - sy * 0.6;
      camera.position.x = target.x * 0.6;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }
  };
  tick();

  /* ----------------------------- Cleanup --------------------------- */
  return () => {
    if (disposed) return;
    disposed = true;
    if (io) io.disconnect();
    window.removeEventListener("mousemove", onPointer);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    stack.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
    });
    pGeo.dispose();
    spriteTex.dispose();
    pMat.dispose();
    layerMat.dispose();
    edgeMat.dispose();
    renderer.dispose();
  };
}
