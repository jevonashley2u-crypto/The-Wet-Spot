import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Glasses, Pause, Play, Smartphone, Volume2, VolumeX, X } from 'lucide-react';

interface VRViewerProps {
  url: string;
  kind: 'image' | 'video';
  title?: string;
  onClose: () => void;
}

type XRNavigator = Navigator & {
  xr?: {
    isSessionSupported: (mode: string) => Promise<boolean>;
    requestSession: (mode: string, init?: Record<string, unknown>) => Promise<XRSession>;
  };
};

/**
 * 360° / VR viewer. Drag (or swipe) to look around, pinch or scroll to zoom,
 * turn on phone motion, or step inside with a WebXR headset (Meta Quest browser, etc.).
 * Expects equirectangular (2:1) 360° photos or videos.
 */
const VRViewer: React.FC<VRViewerProps> = ({ url, kind, title, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const motionRef = useRef<{ enabled: boolean; alpha: number; beta: number; gamma: number; orient: number }>({
    enabled: false, alpha: 0, beta: 0, gamma: 0, orient: 0,
  });
  const [vrSupported, setVrSupported] = useState(false);
  const [inVR, setInVR] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [motionOn, setMotionOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasMotion = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window && 'ontouchstart' in window;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.xr.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1100);

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // view the sphere from the inside
    const material = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    let texture: THREE.Texture | null = null;
    let disposed = false;

    if (kind === 'video') {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = url;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      videoRef.current = video;
      texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      video.addEventListener('loadeddata', () => {
        if (disposed) return;
        material.map = texture;
        material.color.set(0xffffff);
        material.needsUpdate = true;
        setLoading(false);
      });
      video.addEventListener('error', () => !disposed && setError("This video couldn't be loaded."));
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin('anonymous');
      loader.load(
        url,
        (t) => {
          if (disposed) { t.dispose(); return; }
          t.colorSpace = THREE.SRGBColorSpace;
          texture = t;
          material.map = t;
          material.color.set(0xffffff);
          material.needsUpdate = true;
          setLoading(false);
        },
        undefined,
        () => !disposed && setError("This image couldn't be loaded."),
      );
    }

    // --- Look controls -------------------------------------------------------
    let lon = 0, lat = 0, dragging = false, startX = 0, startY = 0, startLon = 0, startLat = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchStart = 0, pinchFov = camera.fov;

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      renderer.domElement.setPointerCapture(e.pointerId);
      if (pointers.size === 1) {
        dragging = true; startX = e.clientX; startY = e.clientY; startLon = lon; startLat = lat;
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchStart = Math.hypot(a.x - b.x, a.y - b.y); pinchFov = camera.fov; dragging = false;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStart > 0) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        camera.fov = THREE.MathUtils.clamp(pinchFov * (pinchStart / d), 30, 100);
        camera.updateProjectionMatrix();
      } else if (dragging && !motionRef.current.enabled) {
        const factor = camera.fov / renderer.domElement.clientHeight;
        lon = startLon - (e.clientX - startX) * factor;
        lat = startLat + (e.clientY - startY) * factor;
      }
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchStart = 0;
      if (pointers.size === 0) dragging = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.05, 30, 100);
      camera.updateProjectionMatrix();
    };
    const el = renderer.domElement;
    el.style.touchAction = 'none';
    el.style.cursor = 'grab';
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Phone motion → camera orientation (standard device-orientation math).
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    const applyMotion = () => {
      const m = motionRef.current;
      euler.set(THREE.MathUtils.degToRad(m.beta), THREE.MathUtils.degToRad(m.alpha), -THREE.MathUtils.degToRad(m.gamma), 'YXZ');
      camera.quaternion.setFromEuler(euler);
      camera.quaternion.multiply(q1);
      camera.quaternion.multiply(q0.setFromAxisAngle(zee, -THREE.MathUtils.degToRad(m.orient)));
    };

    const target = new THREE.Vector3();
    renderer.setAnimationLoop(() => {
      if (!renderer.xr.isPresenting) {
        if (motionRef.current.enabled) {
          applyMotion();
        } else {
          lat = Math.max(-85, Math.min(85, lat));
          const phi = THREE.MathUtils.degToRad(90 - lat);
          const theta = THREE.MathUtils.degToRad(lon);
          target.set(500 * Math.sin(phi) * Math.cos(theta), 500 * Math.cos(phi), 500 * Math.sin(phi) * Math.sin(theta));
          camera.lookAt(target);
        }
      }
      renderer.render(scene, camera);
    });

    const nav = navigator as XRNavigator;
    nav.xr?.isSessionSupported('immersive-vr').then((ok) => !disposed && setVrSupported(ok)).catch(() => {});

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      renderer.xr.getSession()?.end().catch(() => {});
      window.removeEventListener('resize', onResize);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('wheel', onWheel);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
        videoRef.current = null;
      }
      texture?.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      rendererRef.current = null;
    };
  }, [url, kind]);

  // Motion listener lives outside the scene effect so it can be toggled.
  useEffect(() => {
    if (!motionOn) {
      motionRef.current.enabled = false;
      return;
    }
    const onOrient = (e: DeviceOrientationEvent) => {
      const m = motionRef.current;
      m.alpha = e.alpha ?? 0; m.beta = e.beta ?? 0; m.gamma = e.gamma ?? 0;
      m.orient = (screen.orientation?.angle as number) ?? 0;
      m.enabled = true;
    };
    window.addEventListener('deviceorientation', onOrient);
    return () => window.removeEventListener('deviceorientation', onOrient);
  }, [motionOn]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleMotion = async () => {
    if (motionOn) { setMotionOn(false); return; }
    const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE?.requestPermission === 'function') {
      try {
        if ((await DOE.requestPermission()) !== 'granted') return;
      } catch { return; }
    }
    setMotionOn(true);
  };

  const enterVR = async () => {
    const renderer = rendererRef.current;
    const nav = navigator as XRNavigator;
    if (!renderer || !nav.xr) return;
    try {
      const session = await nav.xr.requestSession('immersive-vr', {
        optionalFeatures: ['local-floor', 'bounded-floor'],
      });
      await renderer.xr.setSession(session);
      setInVR(true);
      videoRef.current?.play().then(() => setPlaying(true)).catch(() => {});
      session.addEventListener('end', () => setInVR(false));
    } catch {
      setError("Couldn't start VR on this device.");
    }
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
  };

  const btn = 'flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white text-sm font-bold backdrop-blur-md';

  return (
    <div className="fixed inset-0 z-[200] bg-black" role="dialog" aria-modal="true" aria-label={title || '360° viewer'}>
      <div ref={mountRef} className="absolute inset-0" />

      <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 text-white font-bold min-w-0 pointer-events-auto">
          <Compass className="w-5 h-5 text-teal-300 shrink-0" />
          <span className="truncate">{title || '360° view'}</span>
        </div>
        <button onClick={onClose} aria-label="Close" className="pointer-events-auto w-11 h-11 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center text-zinc-300 pointer-events-none">Loading 360° view…</div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-200 text-sm">{error}</div>
        </div>
      )}

      {!inVR && (
        <div className="absolute bottom-0 inset-x-0 p-4 pb-8 flex flex-wrap justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent">
          {kind === 'video' && (
            <>
              <button onClick={togglePlay} className={btn}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} {playing ? 'Pause' : 'Play'}
              </button>
              <button onClick={toggleMute} className={btn} aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} {muted ? 'Sound off' : 'Sound on'}
              </button>
            </>
          )}
          {hasMotion && (
            <button onClick={toggleMotion} className={`${btn} ${motionOn ? 'border-teal-400 text-teal-200' : ''}`}>
              <Smartphone className="w-4 h-4" /> {motionOn ? 'Motion on' : 'Move phone to look'}
            </button>
          )}
          {vrSupported && (
            <button onClick={enterVR} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-black text-sm font-bold">
              <Glasses className="w-4 h-4" /> Enter VR
            </button>
          )}
          {!vrSupported && !hasMotion && (
            <span className="px-4 py-2.5 text-zinc-300 text-sm">Drag to look around · scroll to zoom</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VRViewer;
