/** Original glyphs, shared by SVG labels and Canvas markers; no quantity encoding. */
export const entityGlyphs:Record<string,string>={
 companies:'M5 12V4h5v8M4 12h8M7 6h1m-1 2h1m-1 2h1',
 foundations:'M8 3l4 2v3c0 2-2 4-4 5-2-1-4-3-4-5V5Z',
 research:'M3 6l5-3 5 3-5 3ZM5 8v3l3 2 3-2V8',
 benchmark:'M6 3L2 8l4 5m4-10 4 5-4 5',
 emerging:'M8 3v10M3 8h10M5 5l6 6m0-6-6 6',
 llm:'M8 3l5 5-5 5-5-5ZM8 6v4M6 8h4',
 energy:'M9 2L4 9h4l-1 5 5-7H8Z',
 compute:'M4 4h8v8H4ZM6 2v2m4-2v2M6 12v2m4-2v2M2 6h2m-2 4h2m8-4h2m-2 4h2M7 7h2v2H7Z',
 news:'M4 4h8v9H4ZM6 6h4M6 8h4m-4 2h2',
 meetings:'M4 5h8v8H4ZM6 3v3m4-3v3M4 8h8M7 10h2',
 community:'M6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4M3 13v-1a3 3 0 0 1 6 0v1m1-8a2 2 0 0 1 0 4m1 1a3 3 0 0 1 2 3',
};
export function entityIcon(id:string,color='var(--accent)'){
 return `<svg class="symbol geometry-icon geometry-point entity-symbol" data-entity-symbol="${id}" style="--color:${color}" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="currentColor" fill-opacity=".1" stroke-opacity=".65"/><path d="${entityGlyphs[id]??entityGlyphs.meetings}" transform="translate(2 2)"/></svg>`;
}
