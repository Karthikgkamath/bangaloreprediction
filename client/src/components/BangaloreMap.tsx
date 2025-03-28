import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Button } from './ui/button';
import { Plus, Minus, Cloud } from 'lucide-react';

// Define Bangalore regions
interface Region {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  color: string;
}

const regions: Region[] = [
  { id: 'indiranagar', name: 'Indiranagar', position: { x: 1.5, y: 0.1, z: 0.5 }, color: '#a78bfa' },
  { id: 'koramangala', name: 'Koramangala', position: { x: 0.5, y: 0.1, z: 0.5 }, color: '#a78bfa' },
  { id: 'jayanagar', name: 'Jayanagar', position: { x: -0.5, y: 0.1, z: 1.0 }, color: '#a78bfa' },
  { id: 'whitefield', name: 'Whitefield', position: { x: 2.0, y: 0.1, z: -0.5 }, color: '#a78bfa' },
  { id: 'electronic-city', name: 'Electronic City', position: { x: 0.0, y: 0.1, z: 2.0 }, color: '#a78bfa' },
  { id: 'rajajinagar', name: 'Rajajinagar', position: { x: -1.0, y: 0.1, z: -0.5 }, color: '#a78bfa' },
  { id: 'hebbal', name: 'Hebbal', position: { x: 0.0, y: 0.1, z: -1.5 }, color: '#a78bfa' },
];

interface BangaloreMapProps {
  onSelectRegion: (region: string) => void;
}

export default function BangaloreMap({ onSelectRegion }: BangaloreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [controls, setControls] = useState<OrbitControls | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Create scene
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x111827); // Dark background

    // Create camera
    const newCamera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    newCamera.position.set(3, 4, 3);

    // Create renderer
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    newRenderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(newRenderer.domElement);

    // Create controls
    const newControls = new OrbitControls(newCamera, newRenderer.domElement);
    newControls.enableDamping = true;
    newControls.dampingFactor = 0.05;
    newControls.minDistance = 3;
    newControls.maxDistance = 10;
    newControls.maxPolarAngle = Math.PI / 2;

    setScene(newScene);
    setCamera(newCamera);
    setRenderer(newRenderer);
    setControls(newControls);

    // Create base plane (Bangalore map base)
    const planeGeometry = new THREE.CircleGeometry(3, 64);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1e293b,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    newScene.add(plane);

    // Add grid for reference
    const grid = new THREE.GridHelper(6, 20, 0x6b7280, 0x4b5563);
    newScene.add(grid);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    newScene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    newScene.add(directionalLight);

    // Add point markers for regions
    regions.forEach(region => {
      const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: region.color });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(region.position.x, region.position.y, region.position.z);
      marker.userData = { id: region.id, name: region.name };
      newScene.add(marker);

      // Add text label
      const textDiv = document.createElement('div');
      textDiv.className = 'absolute bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none opacity-0 transition-opacity';
      textDiv.textContent = region.name;
      textDiv.style.transition = 'opacity 0.2s';
      textDiv.dataset.regionId = region.id;
      containerRef.current.appendChild(textDiv);
    });

    // Create raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !newCamera || !newRenderer) return;
      
      newCamera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Handle mouse move for tooltips
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !newCamera || !newScene || !newRenderer) return;

      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, newCamera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(newScene.children);

      // Hide all tooltips first
      document.querySelectorAll('[data-region-id]').forEach(el => {
        (el as HTMLElement).style.opacity = '0';
      });

      // Show tooltip for the hovered region
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData && intersectedObject.userData.id) {
          containerRef.current.style.cursor = 'pointer';
          
          // Get 2D position for the tooltip
          const position = new THREE.Vector3();
          position.copy(intersectedObject.position);
          position.project(newCamera);
          
          const tooltip = document.querySelector(`[data-region-id="${intersectedObject.userData.id}"]`) as HTMLElement;
          if (tooltip) {
            const x = (position.x * 0.5 + 0.5) * containerRef.current.clientWidth;
            const y = (-(position.y * 0.5) + 0.5) * containerRef.current.clientHeight;
            
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y - 30}px`; // Offset above the marker
            tooltip.style.opacity = '1';
          }
        } else {
          containerRef.current.style.cursor = 'auto';
        }
      } else {
        containerRef.current.style.cursor = 'auto';
      }
    };

    // Handle mouse click for region selection
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !newCamera || !newScene) return;

      // Calculate mouse position in normalized device coordinates
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, newCamera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(newScene.children);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData && intersectedObject.userData.id) {
          const regionId = intersectedObject.userData.id;
          setSelectedRegion(regionId);
          onSelectRegion(regionId);
          
          // Highlight selected region
          newScene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.userData && child.userData.id) {
              if (child.userData.id === regionId) {
                (child.material as THREE.MeshBasicMaterial).color.set(0xec4899); // Highlight color
                child.scale.set(1.5, 1.5, 1.5); // Make it bigger
              } else {
                (child.material as THREE.MeshBasicMaterial).color.set(regions.find(r => r.id === child.userData.id)?.color || 0xa78bfa);
                child.scale.set(1, 1, 1); // Reset size
              }
            }
          });
        }
      }
    };

    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (newControls) newControls.update();
      if (newRenderer && newScene && newCamera) newRenderer.render(newScene, newCamera);
      
      // Subtle pulsing effect for markers
      newScene.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData && child.userData.id) {
          if (child.userData.id !== selectedRegion) {
            child.position.y = region.position.y + Math.sin(Date.now() * 0.003) * 0.03;
          }
        }
      });
    };
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('click', handleClick);
      
      if (containerRef.current) {
        while (containerRef.current.firstChild) {
          containerRef.current.removeChild(containerRef.current.firstChild);
        }
      }
      
      if (newRenderer) newRenderer.dispose();
    };
  }, [onSelectRegion]);

  // Zoom controls
  const handleZoomIn = () => {
    if (camera) {
      camera.position.multiplyScalar(0.9);
      if (controls) controls.update();
    }
  };

  const handleZoomOut = () => {
    if (camera) {
      camera.position.multiplyScalar(1.1);
      if (controls) controls.update();
    }
  };

  const handleReset = () => {
    if (camera && controls) {
      camera.position.set(3, 4, 3);
      controls.reset();
    }
  };

  return (
    <div className="relative h-[400px] bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full rounded-lg relative overflow-hidden">
        {/* Three.js container */}
      </div>
      
      {/* Controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-lg p-2 pointer-events-auto">
          <div className="flex space-x-2">
            <Button 
              onClick={handleZoomIn} 
              variant="ghost" 
              size="icon" 
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleZoomOut} 
              variant="ghost" 
              size="icon" 
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            >
              <Minus className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleReset} 
              variant="ghost" 
              size="icon" 
              className="p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded"
            >
              <Cloud className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Selected region display */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded px-3 py-1 text-xs font-mono">
        Selected: <span id="selected-region" className="text-primary-600 dark:text-primary-400 font-medium">
          {selectedRegion ? regions.find(r => r.id === selectedRegion)?.name || 'None' : 'None'}
        </span>
      </div>
    </div>
  );
}
