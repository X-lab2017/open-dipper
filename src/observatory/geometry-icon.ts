/** A shared 16px slot keeps area, bubble and point labels aligned everywhere. */
export function geometryIcon(kind:'area'|'bubble'|'point',color='var(--accent)'){
  const paths={area:'<rect x="2" y="3" width="12" height="10" rx="1.5" fill="currentColor" fill-opacity=".15"/><path d="M8 3v10M2 8h12" opacity=".6"/><path d="M8 3h6v5H8z" fill="currentColor" fill-opacity=".65" stroke="none"/><path d="M2 8h6v5H2z" fill="currentColor" fill-opacity=".4" stroke="none"/>',bubble:'<circle cx="8" cy="8" r="6" fill="currentColor" fill-opacity=".18"/>',point:'<circle cx="8" cy="8" r="4"/><circle cx="8" cy="8" r="1" fill="currentColor" stroke="none"/>'};
  return `<svg class="symbol geometry-icon geometry-${kind}" style="--color:${color}" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">${paths[kind]}</svg>`;
}
