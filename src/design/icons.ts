/** Original 16px stroke icons; shared by the product and specimen. */
const paths:Record<string,string>={
 map:'<path d="m2 3 4-1 4 2 4-1v10l-4 1-4-2-4 1Z"/><path d="M6 2v10m4-8v10"/>',
 globe:'<circle cx="8" cy="8" r="6"/><ellipse cx="8" cy="8" rx="2.7" ry="6"/><path d="M2 8h12"/>',
 wire:'<path d="M2 4h12M2 8h8M2 12h10"/><circle cx="13" cy="8" r="1"/>',
 layers:'<path d="m8 2 6 3-6 3-6-3 6-3Zm-6 7 6 3 6-3M2 12l6 3 6-3"/>',
 density:'<path d="M2 3h12M2 6h12M2 10h12M2 13h12"/>',
 palette:'<circle cx="8" cy="8" r="6"/><circle cx="5" cy="5" r=".7"/><circle cx="10" cy="4.5" r=".7"/><circle cx="12" cy="8" r=".7"/><path d="M3 11h4l2 3"/>',
 release:'<path d="m8 2 6 6-6 6-6-6 6-6Z"/><path d="M5 8h6M8 5v6"/>',
 security:'<path d="m8 2 6 11H2L8 2Z"/><path d="M8 6v3m0 2h.01"/>',
 foundation:'<path d="m2 5 6-3 6 3H2Zm1 2v5m5-5v5m5-5v5M2 14h12"/>',
 policy:'<path d="M4 2h6l3 3v9H4Z"/><path d="M9 2v4h4M6 8h5m-5 3h5"/>',
 community:'<circle cx="6" cy="5" r="2"/><path d="M2 13v-2a4 4 0 0 1 8 0v2m1-10a2 2 0 0 1 0 4m1 2a3 3 0 0 1 2 3v1"/>',
 research:'<path d="M6 2h4M7 2v5l-4 6a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1L9 7V2M5 10h6"/>'
};
export const icon=(name:string)=>`<svg class="od-icon" viewBox="0 0 16 16" aria-hidden="true">${paths[name]??paths.layers}</svg>`;
