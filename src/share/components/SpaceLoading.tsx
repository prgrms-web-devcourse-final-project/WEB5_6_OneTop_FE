import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Planet {
  mesh: THREE.Mesh;
  speed: number;
  name: string;
  distance?: number;
  angle?: number;
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

const SpaceLoading = ({ progress = 0 }: Props) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoverPlanet, setHoverPlanet] = useState<string | null>(null);
  const sceneRef = useRef<SceneRef | null>(null);

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

    camera.position.z = 50;

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
    const shootingStars: Array<{
      line: THREE.Line;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
    }> = [];

    const createShootingStar = () => {
      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );

      const points = [];
      const trailLength = 7;
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
        opacity: 0.8,
        linewidth: 2,
      });

      const line = new THREE.Line(geometry, material);
      scene.add(line);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      )
        .normalize()
        .multiplyScalar(1.5);

      shootingStars.push({
        line,
        velocity,
        life: 0,
        maxLife: 60,
      });
    };

    let shootingStarTimer = 0;
    const shootingStarInterval = 90;

    const planets: Planet[] = [];

    const mainPlanetGeometry = new THREE.SphereGeometry(8, 64, 64);
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

    planets.push({ mesh: mainPlanet, speed: 0.003, name: "main" });

    const orbitPlanets = [
      {
        textureUrl: "/texture_mars.jpg",
        emissive: 0x331100,
        size: 3,
        distance: 25,
        speed: 0.015,
      },
      {
        textureUrl: "/texture_jupiter.jpg",
        emissive: 0x111111,
        size: 2.5,
        distance: 38,
        speed: 0.01,
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
      });
    });

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
          planet.mesh.scale.set(1.3, 1.3, 1.3);
        }
      } else {
        setHoverPlanet(null);
        planets.forEach((p) => {
          if (p.name !== "main") {
            p.mesh.scale.set(1, 1, 1);
          }
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMoveRaycast);
    renderer.domElement.addEventListener("mousemove", handleMouseMoveRaycast);

    // 마우스 휠 줌
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const zoomSpeed = 0.1;
      const delta = event.deltaY * zoomSpeed;

      camera.position.z += delta * 0.05;

      camera.position.z = Math.max(20, Math.min(80, camera.position.z));
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
      });

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

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
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

        star.line.geometry.attributes.position.needsUpdate = true;

        const material = star.line.material as THREE.LineBasicMaterial;
        material.opacity = 0.8 * (1 - star.life / star.maxLife);

        if (star.life >= star.maxLife) {
          scene.remove(star.line);
          star.line.geometry.dispose();
          material.dispose();
          shootingStars.splice(i, 1);
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

      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h3 className="text-4xl text-white tracking-wider">
            평행우주 탐색 중
          </h3>

          {/* Progress Bar */}
          <div className="w-80 mx-auto space-y-3">
            <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-blue-400 transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${progress}%`,
                  boxShadow:
                    progress > 0 ? "0 0 20px rgba(96, 165, 250, 0.5)" : "none",
                }}
              />
            </div>
            <div className="text-sm text-gray-300 font-medium">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
          <div className="mt-12 text-base text-gray-400 opacity-60">
            마우스를 움직여보세요
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceLoading;
