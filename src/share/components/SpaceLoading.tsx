"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import LoadingProgress from "./LoadingProgress";

interface Planet {
  mesh: THREE.Mesh;
  speed: number;
  name: string;
  distance?: number;
  angle?: number;
  targetScale?: number;
}

interface ShootingStar {
  line: THREE.Line;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  hitBox: THREE.Mesh;
}

interface SceneRef {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  planets: Planet[];
}

interface Props {
  progress?: number;
}

const planetNames = [
  "수성 (Mercury)",
  "금성 (Venus)",
  "화성 (Mars)",
  "목성 (Jupiter)",
  "토성 (Saturn)",
  "천왕성 (Uranus)",
  "해왕성 (Neptune)",
];

const SpaceLoading = ({ progress = 0 }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoverPlanet, setHoverPlanet] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const sceneRef = useRef<SceneRef | null>(null);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 70;

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    const starGroup = new THREE.Group();
    const starSize = 0.06;

    for (let i = 0; i < 800; i++) {
      const starGeometry = new THREE.CircleGeometry(starSize, 10);

      const colorChoice = Math.random();
      let starColor = 0xffffff;
      if (colorChoice > 0.95) starColor = 0xaaccff;
      else if (colorChoice > 0.9) starColor = 0xffddaa;

      const starMaterial = new THREE.MeshBasicMaterial({
        color: starColor,
        transparent: true,
        opacity: Math.random() * 0.4 + 0.6,
      });

      const star = new THREE.Mesh(starGeometry, starMaterial);
      star.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );

      star.lookAt(camera.position);
      starGroup.add(star);
    }
    scene.add(starGroup);

    // 별똥별
    const shootingStars: ShootingStar[] = [];
    shootingStarsRef.current = shootingStars;

    const createShootingStar = () => {
      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        Math.random() * 40 + 10
      );

      const points = [];
      const trailLength = 50;
      for (let i = 0; i < trailLength; i++) {
        points.push(startPos.clone());
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const colorChoice = Math.random();
      let starColor = 0xffffff;
      if (colorChoice > 0.85) starColor = 0xaaccff;
      else if (colorChoice > 0.7) starColor = 0xffffaa;

      const material = new THREE.LineBasicMaterial({
        color: starColor,
        transparent: true,
        opacity: 0.9,
        linewidth: 10,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);

      const hitBoxGeometry = new THREE.SphereGeometry(4.5, 8, 8);
      const hitBoxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
      });
      const hitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
      hitBox.userData = { isShootingStar: true };
      scene.add(hitBox);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
        .normalize()
        .multiplyScalar(0.1);

      shootingStarsRef.current.push({
        line,
        velocity,
        life: 0,
        maxLife: 200,
        hitBox,
      });
    };

    let shootingStarTimer = 0;
    const shootingStarInterval = 40;

    const planets: Planet[] = [];

    const mainPlanetGeometry = new THREE.SphereGeometry(6, 64, 64);
    const mainPlanetMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x112244,
      specular: 0x333333,
      shininess: 25,
      flatShading: false,
    });

    textureLoader.load("/texture_earth.jpg", (texture) => {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      mainPlanetMaterial.map = texture;
      mainPlanetMaterial.needsUpdate = true;
    });

    const mainPlanet = new THREE.Mesh(mainPlanetGeometry, mainPlanetMaterial);
    mainPlanet.position.set(0, 0, 0);
    scene.add(mainPlanet);

    planets.push({
      mesh: mainPlanet,
      speed: 0.003,
      name: "main",
      targetScale: 1,
    });

    const orbitPlanets = [
      {
        textureUrl: "/texture_mercury.jpg",
        emissive: 0x2a2a2a,
        size: 2,
        distance: 18,
        speed: 0.025,
      },
      {
        textureUrl: "/texture_venus.jpg",
        emissive: 0x4a3a1a,
        size: 5.5,
        distance: 28,
        speed: 0.02,
      },
      {
        textureUrl: "/texture_mars.jpg",
        emissive: 0x331100,
        size: 3,
        distance: 40,
        speed: 0.015,
      },
      {
        textureUrl: "/texture_jupiter.jpg",
        emissive: 0x2a2010,
        size: 10,
        distance: 58,
        speed: 0.01,
      },
      {
        textureUrl: "/texture_saturn.jpg",
        emissive: 0x3a3520,
        size: 9,
        distance: 75,
        speed: 0.008,
      },
      {
        textureUrl: "/texture_uranus.jpg",
        emissive: 0x1a3a4a,
        size: 4.5,
        distance: 90,
        speed: 0.006,
      },
      {
        textureUrl: "/texture_neptune.jpg",
        emissive: 0x1a2a5a,
        size: 4.3,
        distance: 105,
        speed: 0.005,
      },
    ];

    orbitPlanets.forEach((config, index) => {
      const geometry = new THREE.SphereGeometry(config.size, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: config.emissive,
        specular: 0x222222,
        shininess: 15,
        flatShading: false,
      });

      textureLoader.load(config.textureUrl, (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        material.map = texture;
        material.needsUpdate = true;
      });

      const planet = new THREE.Mesh(geometry, material);

      if (config.textureUrl.includes("saturn")) {
        const ringGeometry = new THREE.RingGeometry(
          config.size * 1.5,
          config.size * 2.5,
          64
        );

        const ringMaterial = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
        });

        textureLoader.load("/texture_saturn_ring.png", (ringTexture) => {
          ringMaterial.map = ringTexture;
          ringMaterial.needsUpdate = true;
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planet.add(ring);
      }

      const angle = (index / orbitPlanets.length) * Math.PI * 2;
      planet.position.set(
        Math.cos(angle) * config.distance,
        Math.sin(angle * 0.5) * 3,
        Math.sin(angle) * config.distance
      );

      scene.add(planet);
      planets.push({
        mesh: planet,
        speed: config.speed,
        distance: config.distance,
        angle: angle,
        name: `planet-${index}`,
        targetScale: 1,
      });
    });

    // 우주선 추가
    const spaceshipGroup = new THREE.Group();

    // 우주선 본체
    const bodyGeometry = new THREE.ConeGeometry(0.5, 2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      emissive: 0x3366ff,
      shininess: 100,
    });
    const spaceshipBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    spaceshipBody.rotation.x = Math.PI / 2;
    spaceshipGroup.add(spaceshipBody);

    // 우주선 날개
    const wingGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
    const wingMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x2244aa,
      shininess: 80,
    });
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.z = -0.3;
    spaceshipGroup.add(wing);

    // 우주선 엔진 불꽃
    const flameGeometry = new THREE.ConeGeometry(0.3, 0.8, 8);
    const flameMaterial = new THREE.MeshBasicMaterial({
      color: 0xff6600,
      transparent: true,
      opacity: 0.8,
    });
    const flame = new THREE.Mesh(flameGeometry, flameMaterial);
    flame.rotation.x = -Math.PI / 2;
    flame.position.z = -1.2;
    spaceshipGroup.add(flame);

    spaceshipGroup.position.set(15, 5, 15);
    scene.add(spaceshipGroup);

    const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(30, 20, 30);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x6a89cc, 0.5);
    fillLight.position.set(-30, -20, -30);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0x4a90e2, 0.8, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const mouse = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      targetRotation.x = mouse.y * 1.2;
      targetRotation.y = mouse.x * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);

    const raycaster = new THREE.Raycaster();
    const handleMouseMoveRaycast = (event: MouseEvent) => {
      const mouseVec = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh));

      if (intersects.length > 0) {
        const planet = planets.find((p) => p.mesh === intersects[0].object);
        if (planet && planet.name !== "main") {
          setHoverPlanet(planet.name);
          planet.targetScale = 1.3;
        }
      } else {
        setHoverPlanet(null);
        planets.forEach((p) => {
          if (p.name !== "main") {
            p.targetScale = 1;
          }
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMoveRaycast);
    renderer.domElement.addEventListener("mousemove", handleMouseMoveRaycast);

    // 별똥별 클릭 이벤트
    const handleClick = (event: MouseEvent) => {
      const mouseVec = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );

      raycaster.setFromCamera(mouseVec, camera);
      const hitBoxes = shootingStarsRef.current.map((s) => s.hitBox);
      const intersects = raycaster.intersectObjects(hitBoxes);

      if (intersects.length > 0) {
        const hitIndex = shootingStarsRef.current.findIndex(
          (s) => s.hitBox === intersects[0].object
        );

        if (hitIndex !== -1) {
          const star = shootingStarsRef.current[hitIndex];

          // 점수 증가
          setScore((prev) => prev + 10);
          setShowScoreAnimation(true);
          setTimeout(() => setShowScoreAnimation(false), 300);

          // 파티클 효과
          createClickParticles(star.hitBox.position);

          // 별똥별 제거
          scene.remove(star.line);
          scene.remove(star.hitBox);
          star.line.geometry.dispose();
          (star.line.material as THREE.LineBasicMaterial).dispose();
          star.hitBox.geometry.dispose();
          (star.hitBox.material as THREE.MeshBasicMaterial).dispose();
          shootingStarsRef.current.splice(hitIndex, 1);
        }
      }
    };

    window.addEventListener("click", handleClick);
    renderer.domElement.addEventListener("click", handleClick);

    // 클릭 파티클 효과
    const clickParticles: Array<{
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      life: number;
    }> = [];

    const createClickParticles = (position: THREE.Vector3) => {
      const particleCount = 20;

      for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.15, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xffd700 : 0x00ffff,
          transparent: true,
          opacity: 1,
        });

        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);

        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );

        scene.add(particle);
        clickParticles.push({ mesh: particle, velocity, life: 0 });
      }
    };

    // 마우스 휠 줌
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const zoomSpeed = 0.1;
      const delta = event.deltaY * zoomSpeed;

      camera.position.z += delta * 0.05;

      camera.position.z = Math.max(30, Math.min(100, camera.position.z));
    };

    renderer.domElement.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      camera.rotation.x += (targetRotation.x - camera.rotation.x) * 0.15;
      camera.rotation.y += (targetRotation.y - camera.rotation.y) * 0.15;

      planets[0].mesh.rotation.y += 0.003;

      // Orbit planets
      planets.forEach((planet) => {
        if (
          planet.name !== "main" &&
          planet.angle !== undefined &&
          planet.distance !== undefined
        ) {
          planet.angle += planet.speed;
          planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
          planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
          planet.mesh.position.y = Math.sin(planet.angle * 0.5) * 3;
          planet.mesh.rotation.y += 0.008;
        }

        // Scale 부드럽게 보간
        if (planet.targetScale !== undefined) {
          const currentScale = planet.mesh.scale.x;
          const newScale =
            currentScale + (planet.targetScale - currentScale) * 0.1;
          planet.mesh.scale.set(newScale, newScale, newScale);
        }
      });

      // 우주선 애니메이션
      const shipDistance = 12;
      spaceshipGroup.position.x = Math.cos(time * 0.5) * shipDistance;
      spaceshipGroup.position.z = Math.sin(time * 0.5) * shipDistance;
      spaceshipGroup.position.y = Math.sin(time * 0.3) * 5;

      // 우주선이 진행 방향을 보도록
      const nextX = Math.cos(time * 0.5 + 0.1) * shipDistance;
      const nextZ = Math.sin(time * 0.5 + 0.1) * shipDistance;
      const nextY = Math.sin(time * 0.3 + 0.1) * 5;
      spaceshipGroup.lookAt(nextX, nextY, nextZ);

      // 엔진 불꽃 애니메이션
      flame.scale.z = 1 + Math.sin(time * 10) * 0.3;
      flameMaterial.opacity = 0.6 + Math.sin(time * 10) * 0.2;

      starGroup.children.forEach((star) => {
        if (star instanceof THREE.Mesh) {
          star.lookAt(camera.position);
        }
      });

      starGroup.rotation.y += 0.0001;

      shootingStarTimer++;
      if (shootingStarTimer >= shootingStarInterval) {
        createShootingStar();
        shootingStarTimer = 0;
      }

      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const star = shootingStarsRef.current[i];
        star.life++;

        const positions = star.line.geometry.attributes.position
          .array as Float32Array;
        const numPoints = positions.length / 3;

        for (let j = numPoints - 1; j > 0; j--) {
          positions[j * 3] = positions[(j - 1) * 3];
          positions[j * 3 + 1] = positions[(j - 1) * 3 + 1];
          positions[j * 3 + 2] = positions[(j - 1) * 3 + 2];
        }

        positions[0] += star.velocity.x;
        positions[1] += star.velocity.y;
        positions[2] += star.velocity.z;

        // 히트박스 위치도 업데이트
        star.hitBox.position.set(positions[0], positions[1], positions[2]);

        star.line.geometry.attributes.position.needsUpdate = true;

        const material = star.line.material as THREE.LineBasicMaterial;
        material.opacity = 0.8 * (1 - star.life / star.maxLife);

        if (star.life >= star.maxLife) {
          scene.remove(star.line);
          scene.remove(star.hitBox);
          star.line.geometry.dispose();
          material.dispose();
          star.hitBox.geometry.dispose();
          (star.hitBox.material as THREE.MeshBasicMaterial).dispose();
          shootingStarsRef.current.splice(i, 1);
        }
      }

      // 클릭 파티클 애니메이션
      for (let i = clickParticles.length - 1; i >= 0; i--) {
        const p = clickParticles[i];
        p.life++;
        p.mesh.position.add(p.velocity);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - p.life / 30;

        if (p.life >= 30) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          (p.mesh.material as THREE.MeshBasicMaterial).dispose();
          clickParticles.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    sceneRef.current = { scene, camera, renderer, planets };

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleMouseMoveRaycast);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      <div ref={mountRef} className="absolute inset-0" />

      {/* 행성 툴팁 */}
      {hoverPlanet && hoverPlanet !== "main" && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 transition-opacity duration-300">
          <p className="text-white text-lg font-medium">
            {planetNames[parseInt(hoverPlanet.split("-")[1])]}
          </p>
        </div>
      )}

      {/* 점수 표시 */}
      <div
        className={`absolute top-10 right-10 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 transition-all duration-300 ${
          showScoreAnimation ? "scale-125" : "scale-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <p className="text-white text-xl font-bold">{score}</p>
        </div>
      </div>

      {/* 게임 설명 */}
      <div className="absolute top-10 left-10 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 max-w-xs">
        <div className="flex items-start gap-3">
          <span className="text-3xl">💫</span>
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              별똥별 게임
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              별똥별을 클릭해서 점수를 획득하세요!
            </p>
            <p className="text-yellow-300 text-xs mt-2">별똥별 하나당 +10점</p>
          </div>
        </div>
      </div>
      <LoadingProgress progress={progress} />
    </div>
  );
};

export default SpaceLoading;
