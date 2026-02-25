// Shaders GLSL custom pour la grille de particules du Dev Mode
// Choix : GLSL natif (pas de abstraction lib) pour la performance et le contrôle total
// Instanced mesh : une seule draw call pour N particules → 60fps constant

export const particleVertexShader = /* glsl */ `
  // Attributs instanciés — chaque particule a sa position de base et sa phase
  attribute vec3 instancePosition;
  attribute float instancePhase;
  attribute float instanceSize;

  // Uniforms : temps et position souris normalisée [-1, 1]
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uIntensity;

  // Varyings pour le fragment shader
  varying float vAlpha;
  varying float vDistance;
  varying vec3 vColor;

  void main() {
    // Position de base de la particule
    vec3 pos = instancePosition;

    // Déformation ondulante au repos — sinusoïde sur X et Z
    float wave = sin(uTime * 0.8 + instancePhase) * 0.15;
    pos.y += wave;

    // Attraction/répulsion souris — rayon d'influence : 2.0 unités
    vec2 mouseWorld = uMouse * 8.0; // scale mouse à l'espace monde
    vec2 diff = pos.xz - mouseWorld;
    float dist = length(diff);
    float influence = 1.0 - smoothstep(0.0, 2.5, dist);

    // Répulsion : les particules fuient la souris
    pos.xz += normalize(diff + vec2(0.001)) * influence * uIntensity * 0.8;
    pos.y += influence * uIntensity * 0.4;

    // Calcul de la position finale en espace clip
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Taille des particules : plus petites au loin, plus grandes près de la souris
    float sizeBase = instanceSize * (1.0 + influence * 2.0);
    gl_PointSize = sizeBase * (300.0 / -mvPosition.z);

    // Alpha : fade sur les bords de la grille + influence souris
    float edgeFade = 1.0 - smoothstep(5.0, 9.0, length(instancePosition.xz));
    vAlpha = edgeFade * (0.3 + influence * 0.7);
    vDistance = dist;

    // Couleur : vert néon (#00FF88) vers cyan (#00D4FF) selon la distance à la souris
    vColor = mix(
      vec3(0.0, 1.0, 0.533),   // #00FF88 — proche souris
      vec3(0.0, 0.831, 1.0),   // #00D4FF — loin souris
      smoothstep(0.0, 3.0, dist)
    );
  }
`;

export const particleFragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vDistance;
  varying vec3 vColor;

  void main() {
    // Forme circulaire douce — discard les coins du gl_Point carré
    vec2 center = gl_PointCoord - vec2(0.5);
    float r = length(center);
    if (r > 0.5) discard;

    // Halo lumineux sur le bord intérieur
    float glow = 1.0 - smoothstep(0.0, 0.5, r);
    float core = 1.0 - smoothstep(0.0, 0.2, r);

    float alpha = vAlpha * (glow * 0.6 + core * 0.4);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Shader pour les lignes de constellation entre particules proches
export const lineVertexShader = /* glsl */ `
  uniform float uTime;
  varying float vAlpha;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vAlpha = 0.15 + sin(uTime * 0.5) * 0.05;
  }
`;

export const lineFragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.533, vAlpha); // #00FF88
  }
`;
