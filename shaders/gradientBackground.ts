/**
 * Animated gradient background shader — refined onyx/deep-space aesthetic
 * Subtle time-based color shifting with noise distortion
 */

export const gradientBackgroundVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const gradientBackgroundFragment = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  // Simplex-like noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;

    // Mouse influence on distortion
    float mouseInfluence = length(uv - (uMouse * 0.5 + 0.5)) * 0.25;

    // Animated noise distortion
    float noise1 = snoise(uv * 2.0 + uTime * 0.04) * 0.5;
    float noise2 = snoise(uv * 4.0 - uTime * 0.025) * 0.25;
    float noise = noise1 + noise2 + mouseInfluence;

    // Refined palette — cool slate with subtle indigo/violet hints
    vec3 colorA = vec3(0.035, 0.035, 0.045);  // Slate void
    vec3 colorB = vec3(0.055, 0.050, 0.090);  // Muted indigo
    vec3 colorC = vec3(0.045, 0.055, 0.100);  // Slate blue
    vec3 colorD = vec3(0.070, 0.050, 0.105);  // Soft violet

    // Color mixing based on position + noise
    float t = uv.y + noise * 0.25;
    vec3 color = mix(colorA, colorB, smoothstep(0.0, 0.4, t));
    color = mix(color, colorC, smoothstep(0.3, 0.7, t + sin(uTime * 0.08) * 0.08));
    color = mix(color, colorD, smoothstep(0.6, 1.0, t));

    // Subtle vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.7;
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`;
