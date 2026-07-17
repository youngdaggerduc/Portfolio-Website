import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * three.js replacement for the CSS parallax web background (Phase 3 of
 * DESIGN.md). Two elements, one draw call each:
 *
 *   - WebLines:      a radial spider web whose strands bulge *away* from the
 *                    cursor (GPU displacement in the vertex shader) with a
 *                    magenta pulse that travels outward along the strands.
 *   - HalftoneField: a slow drift of round "ben-day" dots for depth.
 *
 * Mounted only under the desktop-FX gate (see SiteBackground). Transparent
 * clear so the navy page background shows through; sits at z-index 0 behind
 * all content and never eats pointer events.
 */

const SPOKES = 14
const RINGS = 8

function buildWebGeometry(radius) {
  const positions = []
  const dist = [] // normalized radius per vertex, for the shader pulse

  const nodes = [] // nodes[ring][spoke] = [x, y]
  for (let r = 0; r <= RINGS; r++) {
    const ringRadius = (r / RINGS) * radius
    const row = []
    for (let s = 0; s < SPOKES; s++) {
      const a = (s / SPOKES) * Math.PI * 2
      // small organic jitter so it doesn't read as a perfect wheel
      const jitter = r === 0 ? 0 : (Math.sin(s * 12.9 + r * 3.1) * 0.5 + 0.5) * radius * 0.02
      const rr = ringRadius + jitter
      row.push([Math.cos(a) * rr, Math.sin(a) * rr])
    }
    nodes.push(row)
  }

  const push = (p) => {
    positions.push(p[0], p[1], 0)
    dist.push(Math.min(1, Math.hypot(p[0], p[1]) / radius))
  }

  // radial spokes (center outward)
  for (let s = 0; s < SPOKES; s++) {
    for (let r = 0; r < RINGS; r++) {
      push(nodes[r][s])
      push(nodes[r + 1][s])
    }
  }
  // concentric rings (skip the degenerate center ring 0)
  for (let r = 1; r <= RINGS; r++) {
    for (let s = 0; s < SPOKES; s++) {
      push(nodes[r][s])
      push(nodes[r][(s + 1) % SPOKES])
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geo.setAttribute('aDist', new THREE.Float32BufferAttribute(dist, 1))
  return geo
}

function WebLines() {
  const { viewport } = useThree()
  const radius = Math.max(viewport.width, viewport.height) * 0.75

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uMouse: { value: new THREE.Vector2(9999, 9999) },
          uForce: { value: radius * 0.05 },
          uSigma: { value: radius * 0.16 },
          uPulse: { value: -0.3 },
          uCyan: { value: new THREE.Color('#00d4ff') },
          uMag: { value: new THREE.Color('#ff00aa') },
        },
        vertexShader: /* glsl */ `
          uniform vec2 uMouse;
          uniform float uForce;
          uniform float uSigma;
          attribute float aDist;
          varying float vDist;
          void main() {
            vDist = aDist;
            vec3 p = position;
            vec2 away = p.xy - uMouse;
            float d = length(away);
            float bulge = uForce * exp(-(d * d) / (2.0 * uSigma * uSigma));
            p.xy += normalize(away + 0.0001) * bulge;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uPulse;
          uniform vec3 uCyan;
          uniform vec3 uMag;
          varying float vDist;
          void main() {
            // magenta band travelling outward along the strands
            float band = smoothstep(0.12, 0.0, abs(vDist - uPulse));
            vec3 col = mix(uCyan, uMag, band);
            float alpha = 0.2 + band * 0.55;
            gl_FragColor = vec4(col, alpha);
          }
        `,
      }),
    [radius]
  )

  const geometry = useMemo(() => buildWebGeometry(radius), [radius])
  const lines = useMemo(() => new THREE.LineSegments(geometry, material), [geometry, material])
  const target = useRef(new THREE.Vector2(9999, 9999))

  useFrame((state) => {
    const t = state.clock.elapsedTime
    material.uniforms.uPulse.value = ((t * 0.24) % 1.5) - 0.25
    // pointer.x/y are -1..1 → world units on the z=0 plane
    if (state.pointer.x !== 0 || state.pointer.y !== 0) {
      target.current.set(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2
      )
    }
    material.uniforms.uMouse.value.lerp(target.current, 0.08)
    // slow idle drift + breathing so the web never reads as a static image
    lines.rotation.z = Math.sin(t * 0.05) * 0.05
    const s = 1 + Math.sin(t * 0.35) * 0.012
    lines.scale.set(s, s, 1)
  })

  return <primitive object={lines} />
}

function HalftoneField() {
  const { viewport } = useThree()

  const { geometry, material } = useMemo(() => {
    const COUNT = 1400
    const w = viewport.width * 1.4
    const h = viewport.height * 1.4
    const positions = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * w
      positions[i * 3 + 1] = (Math.random() - 0.5) * h
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color('#00d4ff') } },
      vertexShader: /* glsl */ `
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          // small "ben-day" dots; clamp so nearby points never balloon
          gl_PointSize = clamp(70.0 / -mv.z, 1.0, 3.2);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(uColor, 0.3 * smoothstep(0.5, 0.1, d));
        }
      `,
    })
    return { geometry: geo, material: mat }
  }, [viewport.width, viewport.height])

  const points = useMemo(() => new THREE.Points(geometry, material), [geometry, material])

  useFrame((state, delta) => {
    const p = points.geometry.attributes.position
    const h = viewport.height * 1.4
    for (let i = 1; i < p.array.length; i += 3) {
      p.array[i] -= delta * 0.25
      if (p.array[i] < -h / 2) p.array[i] = h / 2
    }
    p.needsUpdate = true
    points.rotation.z = state.clock.elapsedTime * 0.01
  })

  return <primitive object={points} />
}

export default function WebGLBackground() {
  return (
    <div className="webgl-bg" aria-hidden="true">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ pointerEvents: 'none' }}
      >
        <WebLines />
        <HalftoneField />
      </Canvas>
    </div>
  )
}
