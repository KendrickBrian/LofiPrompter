import { useEffect, useRef } from "react";
import * as THREE from "three";

export const CosmicScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    // Dark cosmic background color
    scene.background = new THREE.Color("#050505");
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Stars (Particles)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArray = new Float32Array(starCount * 3);
    
    for(let i = 0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30; // Spread stars wide
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Floating Abstract Objects
    const objects: THREE.Mesh[] = [];
    const geometry = new THREE.IcosahedronGeometry(1, 0); // Low poly look
    
    // Cyberpunk/Cosmic material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x220033,
        emissive: 0x4b0082,
        emissiveIntensity: 0.2,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });

    for (let i = 0; i < 8; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        // Random positions around the center
        mesh.position.x = (Math.random() - 0.5) * 15;
        mesh.position.y = (Math.random() - 0.5) * 15;
        mesh.position.z = (Math.random() - 0.5) * 10 - 2; 
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        const scale = Math.random() * 0.8 + 0.2;
        mesh.scale.set(scale, scale, scale);
        
        scene.add(mesh);
        objects.push(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const purpleLight = new THREE.PointLight(0xa855f7, 2, 20);
    purpleLight.position.set(5, 5, 5);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2, 20);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate starfield slowly
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      // Animate objects
      objects.forEach((obj, i) => {
          obj.rotation.x += 0.002 * (i % 2 === 0 ? 1 : -1);
          obj.rotation.y += 0.003 * (i % 3 === 0 ? 1 : -1);
          
          // Floating wave motion
          const time = Date.now() * 0.001;
          obj.position.y += Math.sin(time + i) * 0.005;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};