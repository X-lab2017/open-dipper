# OpenDipper Visual Baseline 1.2

维护入口：`design/tokens.json`。完整中文使用规范：`docs/VISUAL_SYSTEM.md`。

网站：https://www.x-lab.info/open-dipper/design-system.html

## 在当前仓库使用

```ts
import '../design/tokens.css';
import '../design/components.css';
import {canvasPalette, chartColor} from '../design/palette';
import {icon} from '../design/icons';
```

使用语义变量 `var(--od-text)`、`var(--od-surface-panel)` 等。将 `data-theme="light"` 设置在 HTML 根元素上切换主题。保持 `aria-label`、`aria-pressed`、表单 label 和焦点状态。

```sh
npm run design:build  # 同步生成资源
npm run design:check  # 同步性、标志完整性、核心色彩对比度
npm run build        # 包含可下载视觉基线包
```

## 使用下载包

解压后先加载 `tokens.css`，再加载 `components.css`。`palette.ts`、`icons.ts` 是可选 TypeScript 入口；无 TypeScript 工具链的页面可只使用 CSS 和官方 SVG。`brand.ts` 是 Vite 适配器示例，跨框架接入请替换 `import.meta.env.BASE_URL` 为自己的静态资源路径。

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components.css">
<section class="od-panel">
  <div class="od-panel-head"><h2>我的观测面板</h2></div>
  <div class="od-panel-body">
    <span class="od-badge demo">模拟数据</span>
  </div>
</section>
```

`brand/` 中的 SVG 保持官方原样。读取 `brand/UPSTREAM_NOTICE.md` 与 `brand/NOTICE.md` 了解使用条件；本包不授予额外品牌或商标权利。下载包中的 `VISUAL_SYSTEM.md` 包含所有约定与源代码路径。
