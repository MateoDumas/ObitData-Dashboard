import { useEffect, useRef } from 'react';
import { ChartData } from '@/utils/dataParser';
import { useResize } from '@/hooks/useResize';
import clsx from 'clsx';

export interface ThreeChartProps {
  data: ChartData[];
  className?: string;
}

/**
 * 3D Chart component using Three.js
 * Note: This requires three.js to be installed: npm install three @types/three
 */
export function ThreeChart({ data, className }: ThreeChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useResize(containerRef);
  const sceneRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import of Three.js to avoid bundle size if not used
    import('three').then((THREE) => {
      if (!containerRef.current) return;

      // Cleanup previous scene
      if (sceneRef.current) {
        const { scene, renderer, camera } = sceneRef.current;
        renderer.dispose();
        // Remove all objects from scene
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      
      renderer.setSize(width, height);
      containerRef.current.appendChild(renderer.domElement);

      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Create 3D bars from data
      if (data.length > 0 && data[0].data.length > 0) {
        const maxValue = Math.max(...data.flatMap((s) => s.data.map((d) => d.y)));
        const barSpacing = 0.5;
        const barWidth = 0.3;

        data.forEach((series, seriesIndex) => {
          const geometry = new THREE.BoxGeometry(barWidth, 1, barWidth);
          const material = new THREE.MeshPhongMaterial({
            color: series.color || 0x0ea5e9,
            transparent: true,
            opacity: 0.8,
          });

          series.data.slice(-20).forEach((point, pointIndex) => {
            const height = (point.y / maxValue) * 3;
            const bar = new THREE.Mesh(geometry, material.clone());
            bar.position.set(
              pointIndex * barSpacing - 5,
              height / 2,
              seriesIndex * barSpacing - 1
            );
            bar.scale.y = height;
            scene.add(bar);
          });
        });
      }

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      sceneRef.current = { scene, renderer, camera };

      return () => {
        if (renderer && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    }).catch((error) => {
      console.warn('Three.js not available:', error);
    });
  }, [data, width, height]);

  return (
    <div
      ref={containerRef}
      className={clsx('w-full h-full bg-transparent', className)}
      style={{ minHeight: '400px' }}
    />
  );
}
