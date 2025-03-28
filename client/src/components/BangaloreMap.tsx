import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Region {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: string;
}

interface BangaloreMapProps {
  onSelectRegion: (region: string) => void;
}

export default function BangaloreMap({ onSelectRegion }: BangaloreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const regionsRef = useRef<THREE.Mesh[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Define Bangalore regions
  const regions: Region[] = [
    { id: 'indiranagar', name: 'Indiranagar', position: { x: 0.5, y: 0.1, z: 0.2 }, color: '#FF6B6B' },
    { id: 'koramangala', name: 'Koramangala', position: { x: 0.3, y: 0.05, z: -0.2 }, color: '#4ECDC4' },
    { id: 'jayanagar', name: 'Jayanagar', position: { x: -0.2, y: 0, z: -0.3 }, color: '#FFD166' },
    { id: 'whitefield', name: 'Whitefield', position: { x: 1, y: 0.2, z: 0.5 }, color: '#6A0572' },
    { id: 'electronic-city', name: 'Electronic City', position: { x: -0.5, y: 0.1, z: -0.8 }, color: '#1A535C' },
    { id: 'rajajinagar', name: 'Rajajinagar', position: { x: -0.7, y: 0.15, z: 0.3 }, color: '#F5587B' },
    { id: 'hebbal', name: 'Hebbal', position: { x: 0, y: 0.25, z: 0.8 }, color: '#00A8E8' },
  ];
  
  useEffect(() => {
    // Skip if container ref isn't available yet
    if (!containerRef.current) return;
    
    // Get container dimensions
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 2);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 1.5;
    controls.maxDistance = 3;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create a base plane for the city
    const planeGeometry = new THREE.CircleGeometry(1, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222, 
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    scene.add(plane);
    
    // Create connection lines between regions
    const createConnectionLine = (start: THREE.Vector3, end: THREE.Vector3) => {
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x444444, 
        transparent: true, 
        opacity: 0.3 
      });
      const points = [start, end];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    };
    
    // Create region markers
    const regionMeshes: THREE.Mesh[] = [];
    
    regions.forEach((region, index) => {
      // Create marker geometry
      const geometry = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
      
      // Create materials for different states
      const defaultMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color(region.color),
        roughness: 0.7,
        metalness: 0.3,
        transparent: true,
        opacity: 0.85
      });
      
      // Create mesh
      const mesh = new THREE.Mesh(geometry, defaultMaterial);
      mesh.position.set(region.position.x, region.position.y, region.position.z);
      mesh.userData = { id: region.id };
      scene.add(mesh);
      regionMeshes.push(mesh);
      
      // Create text label for the marker
      const labelDiv = document.createElement('div');
      labelDiv.className = 'absolute pointer-events-none py-1 px-2 bg-slate-800/80 text-white text-sm rounded-md hidden';
      labelDiv.textContent = region.name;
      container.appendChild(labelDiv);
      
      // Store label reference in mesh userData
      mesh.userData.label = labelDiv;
      
      // Create connections between regions (not all, just some for visual effect)
      if (index > 0) {
        const prevRegion = regions[index - 1];
        createConnectionLine(
          new THREE.Vector3(region.position.x, region.position.y, region.position.z),
          new THREE.Vector3(prevRegion.position.x, prevRegion.position.y, prevRegion.position.z)
        );
      }
    });
    
    // Store regions for later interaction
    regionsRef.current = regionMeshes;
    
    // Handle mouse move for hover effect
    const handleMouseMove = (event: MouseEvent) => {
      // Calculate normalized device coordinates
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      // Reset all labels to hidden
      regionMeshes.forEach(mesh => {
        if (mesh.userData.label) {
          mesh.userData.label.classList.add('hidden');
        }
      });
      
      // Check for intersections
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(regionMeshes);
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        const regionId = intersectedObject.userData.id as string;
        
        // Show label for hovered region
        if (intersectedObject.userData.label) {
          const labelDiv = intersectedObject.userData.label as HTMLDivElement;
          labelDiv.classList.remove('hidden');
          
          // Position label on screen
          const vector = new THREE.Vector3();
          intersectedObject.updateMatrixWorld();
          vector.setFromMatrixPosition(intersectedObject.matrixWorld);
          vector.project(camera);
          
          const x = (vector.x * 0.5 + 0.5) * width;
          const y = -(vector.y * 0.5 - 0.5) * height;
          
          labelDiv.style.transform = `translate(-50%, -100%) translate(${x}px, ${y - 10}px)`;
        }
        
        // Set hovered region
        setHoveredRegion(regionId);
        
        // Change cursor style
        container.style.cursor = 'pointer';
      } else {
        setHoveredRegion(null);
        container.style.cursor = 'grab';
      }
    };
    
    // Handle click to select region
    const handleClick = (event: MouseEvent) => {
      // Calculate normalized device coordinates
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / height) * 2 + 1;
      
      // Check for intersections
      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(regionMeshes);
      
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object as THREE.Mesh;
        const regionId = intersectedObject.userData.id as string;
        
        // Set selected region and call the callback
        setSelectedRegion(regionId);
        onSelectRegion(regionId);
      }
    };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      // Update materials based on hover/selection state
      regionMeshes.forEach(mesh => {
        const material = mesh.material as THREE.MeshStandardMaterial;
        const regionId = mesh.userData.id as string;
        
        if (selectedRegion === regionId) {
          // Selected state
          material.emissive.set(0xffffff);
          material.emissiveIntensity = 0.5;
          material.opacity = 1;
        } else if (hoveredRegion === regionId) {
          // Hovered state
          material.emissive.set(0xffffff);
          material.emissiveIntensity = 0.3;
          material.opacity = 0.9;
        } else {
          // Default state
          material.emissive.set(0x000000);
          material.emissiveIntensity = 0;
          material.opacity = 0.85;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    // Start animation loop
    animate();
    
    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      if (rendererRef.current && rendererRef.current.domElement && container) {
        container.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      
      // Remove label elements
      regionMeshes.forEach(mesh => {
        if (mesh.userData.label && container.contains(mesh.userData.label)) {
          container.removeChild(mesh.userData.label);
        }
      });
    };
  }, [onSelectRegion, regions]);
  
  // Update the selected region when external prop changes
  useEffect(() => {
    if (selectedRegion) {
      onSelectRegion(selectedRegion);
    }
  }, [selectedRegion, onSelectRegion]);
  
  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden">
      <div 
        ref={containerRef} 
        className="w-full h-full bg-slate-900 rounded-lg"
        style={{ touchAction: 'pan-y' }}
      ></div>
      <div className="absolute bottom-3 left-3 text-xs bg-slate-800/80 text-slate-300 py-1 px-2 rounded">
        {selectedRegion ? (
          <span>Selected: {regions.find(r => r.id === selectedRegion)?.name || 'None'}</span>
        ) : (
          <span>Click on a region to select</span>
        )}
      </div>
    </div>
  );
}