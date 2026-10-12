"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

/** Solo desktop: brillo suave (umbral alto: letreros, ampolletas, neón) y viñeta leve. */
export default function Effects() {
  return <EffectComposer multisampling={4}>
    <Bloom intensity={0.9} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
    <Vignette offset={0.25} darkness={0.55} />
  </EffectComposer>;
}
