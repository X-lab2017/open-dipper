import {canvasPalette} from './palette';
/** Original path-only assets; color and geometry remain exactly as provided by X-lab. */
export function xlabLogo(variant:'compact'|'horizontal'|'favicon'='compact'){
 const name={compact:'WordmarkCompact',horizontal:'Horizontal',favicon:'Favicon'}[variant];
 return (['Dark','Light'] as const).map(theme=>`<img class="xlab-logo xlab-logo-${theme.toLowerCase()}" src="${import.meta.env.BASE_URL}brand/XlabAI_${name}_Color${theme}.svg" alt="X-lab AI" ${variant==='favicon'?'width="32" height="32"':variant==='compact'?'width="160" height="63"':'width="360" height="156"'}>`).join('');
}
export function applyAppearance(light:boolean,density='comfortable'){
 const root=document.documentElement;root.dataset.theme=light?'light':'dark';root.dataset.density=density;
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',canvasPalette(light)['surface-panel']);
 document.querySelector<HTMLLinkElement>('link[rel="icon"]')?.setAttribute('href',`${import.meta.env.BASE_URL}brand/opendipper/opendipper-small-${light?'light':'dark'}.svg`);
}

/** OpenDipper product identity; separate from the immutable X-lab parent mark. */
export function openDipperLogo(variant:'horizontal'|'english'|'icon'='horizontal'){
 const dimensions=variant==='icon'?'width="400" height="320"':'width="1040" height="320"';
 return (['dark','light'] as const).map(theme=>`<img class="opendipper-logo opendipper-logo-${theme}" src="${import.meta.env.BASE_URL}brand/opendipper/opendipper-${variant}-${theme}.svg" alt="开源北斗 OpenDipper" ${dimensions}>`).join('');
}
