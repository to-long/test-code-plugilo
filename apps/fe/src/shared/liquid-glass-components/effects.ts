export const liquidGlassBase = `
transition-all duration-300 
border border-white/50
bg-white/2.5 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.55),0_0_9px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.1)] 

before:absolute before:inset-0 before:bg-gradient-to-br before:from-white before:via-transparent before:to-transparent before:opacity-50 before:pointer-events-none before:transition-all

after:absolute after:inset-0 after:bg-gradient-to-tl after:from-white/60 after:via-transparent after:to-transparent after:opacity-30 after:pointer-events-none after:transition-all
`;

export const liquidGlass = `${liquidGlassBase} 
hover:before:opacity-90 hover:after:opacity-60`;
