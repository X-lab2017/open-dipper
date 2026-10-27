import {caseSources} from './inference-case.ts';
export type Evidence={id:string;title:string;excerpt:string;url:string;date:string;captured:string;dateBasis:string};
export function caseEvidence(english=false):Evidence[]{return caseSources.map(s=>({id:s.id,title:s.title[english?1:0],excerpt:s.summary[english?1:0],url:s.url,date:s.date,captured:s.captured,dateBasis:s.dateBasis||'published'}));}
export function exampleReport(en=false):string{return en?`# vLLM / SGLang: inference framework selection

Editorial demonstration · sources checked 2026-10-27 · not a DSH execution · no performance benchmark performed.

## Decision brief
Keep both frameworks on the shortlist. Choose against the team's actual model, hardware, service targets and operating cost; the selected evidence cannot establish a universal winner. Proceed with a bounded dual-framework trial before committing to migration. [1][2]

## What the evidence establishes
vLLM documents batching, prefix caching, structured output and compatible APIs. SGLang documents language, multimodal and diffusion inference with deployment and hardware guidance. Feature descriptions require verification against the exact target model and platform. [1][2]

## Comparison
| Dimension | vLLM | SGLang | Decision implication |
| --- | --- | --- | --- |
| Evidence entry | Pinned official README [1] | Pinned official README [2] | Verify exact model/hardware support |
| Historical mechanism | PagedAttention, KV-cache memory management [3] | RadixAttention, KV reuse in structured programs [4] | Mechanisms do not establish current superiority |
| Version record | v0.32.0, 2026-10-18 [5] | v0.5.22, 2026-10-19 [6] | Freeze versions for the trial; not an always-latest claim |
| Latency / throughput / cost | Unmeasured | Unmeasured | Use the same request set and equipment |
| Integration / operations | To evaluate | To evaluate | Record deployment, monitoring and rollback effort |

## Evidence boundaries
The papers use different dates, baselines and workloads; do not compare their reported speedup ratios. Repository activity is not inference performance. This corpus contains excerpts and metadata, not a full independent evaluation. [3][4]

## Trial plan
1. Fix one mutually supported model, precision, GPU configuration, driver and framework version. [1][2][5][6]
2. Prepare representative requests with fixed input/output-length distributions.
3. Test cold cache and shared prefixes at low and target concurrency.
4. Measure TTFT, inter-token latency, request/token throughput, peak memory and errors; repeat runs.
5. Check output correctness, streaming, cancellation, timeouts, deployment and rollback.
6. Agree service targets and a cost ceiling before measuring. All result cells remain unmeasured.

## Recommendation and open questions
Start a small trial with both candidates. Retain the current service until compatibility, quality, latency and cost targets are met. Missing inputs: target model, GPU budget, real workload and operational constraints.

## Delivery checklist
- Confirm the cited sources and the selected versions.
- Fill the trial conditions and acceptance thresholds.
- Record measured results separately from this editorial example.
- Accept or revise the recommendation, then save it to the knowledge notebook.
`: `# vLLM / SGLang：推理框架选型报告

编辑演示 · 来源核对于 2026-10-27 · 非 DSH 执行结果 · 未开展性能实测。

## 决策摘要
建议将两个框架同时纳入候选，围绕团队实际模型、硬件、服务目标和运维成本开展小范围验证。现有资料不足以支持“某个框架全面胜出”的结论。在完成同口径试验前，不作全面迁移决定。[1][2]

## 已知事实
vLLM 官方说明列出连续批处理、前缀缓存、结构化输出和兼容 API；SGLang 官方说明覆盖语言、多模态与扩散模型推理，提供部署与硬件指南。具体能力仍需对照目标模型和平台核查。[1][2]

## 选型比较
| 维度 | vLLM | SGLang | 对决策的意义 |
| --- | --- | --- | --- |
| 能力入口 | 固定提交的官方 README [1] | 固定提交的官方 README [2] | 核查目标模型与硬件组合 |
| 历史技术机制 | PagedAttention：KV cache 内存管理 [3] | RadixAttention：结构化程序中的缓存复用 [4] | 机制差异不能直接推出当前性能胜负 |
| 案例版本记录 | v0.32.0，2026-10-18 [5] | v0.5.22，2026-10-19 [6] | 试验需锁定版本，不代表永远最新 |
| 延迟、吞吐、成本 | 待测 | 待测 | 同一请求集、硬件和测量口径 |
| 集成与运维 | 待评估 | 待评估 | 记录部署、监控、升级与回滚工时 |

## 证据边界
两篇论文的时间、基线和工作负载不同，不将加速倍数拼接成当前版本排名。项目活跃度也不等于推理性能。本报告使用来源摘录与元数据，尚非完整独立评测。[3][4]

## 验证计划
1. 固定双方支持的同一模型、精度、GPU 配置、驱动与框架版本。[1][2][5][6]
2. 构建具有代表性的请求集，固定输入输出长度分布。
3. 分别测试冷缓存与共享前缀、低并发与目标并发。
4. 记录 TTFT、后续 token 延迟、请求与 token 吞吐、峰值显存和错误率；重复试验记录波动。
5. 核对正确性、流式接口、取消、超时、部署和回滚行为。
6. 先约定服务目标与成本上限，再测量。所有结果目前均为“待测”。

## 采用建议与待补问题
先进行双框架小范围试用。在兼容性、质量、延迟与成本目标达标前保留现有服务。待补充：目标模型、GPU 预算、真实业务负载和运维约束。

## 交付检查
- 核对引用来源与试验版本。
- 补齐测试条件和通过阈值。
- 将实际测量结果与本编辑示例分开记录。
- 审阅、修改建议后保存到知识库。
`;}
export function withEvidence(body:string,sources:Evidence[],en=false){return body+'\n\n## '+(en?'Sources':'来源资料')+'\n\n'+sources.map((s,i)=>`[${i+1}] ${s.title}\n${s.url}\n${s.dateBasis}: ${s.date}; ${en?'captured':'收录'}: ${s.captured}\n`).join('\n');}
export function escapeReport(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
export function reportHtml(body:string,sources:Evidence[],en=false){const esc=escapeReport;const inline=(s:string)=>esc(s).replace(/\[(\d+)\]/g,(m,n)=>Number(n)>0&&Number(n)<=sources.length?`<a href="#source-${n}">[${n}]</a>`:m);let table=false;const html=body.split('\n').map(line=>{if(line.startsWith('|')){if(/^\|[\s:|\-]+\|$/.test(line))return '';const cells=line.split('|').slice(1,-1);const prefix=table?'':'<div class="report-table-wrap"><table>';table=true;return prefix+'<tr>'+cells.map(c=>'<td>'+inline(c.trim())+'</td>').join('')+'</tr>';}const close=table?'</table></div>':'';table=false;if(/^#{1,3} /.test(line)){const n=line.indexOf(' ');return close+`<h${n}>${inline(line.slice(n+1))}</h${n}>`;}return close+(line.trim()?'<p>'+inline(line)+'</p>':'');}).join('')+(table?'</table></div>':'');return html+`<h2>${en?'Sources':'来源资料'}</h2><ol class="report-sources">`+sources.map((s,i)=>`<li id="source-${i+1}"><a href="${esc(/^https?:\/\//.test(s.url)?s.url:'#')}" target="_blank" rel="noopener">${esc(s.title)}</a><small>${esc(s.dateBasis)} · ${esc(s.date)} / ${en?'captured':'收录'} ${esc(s.captured)}</small></li>`).join('')+'</ol>';}
export function printableReport(body:string,sources:Evidence[],en=false){return '<!doctype html><html lang="'+(en?'en':'zh-CN')+'"><meta charset="utf-8"><title>OpenDipper · vLLM / SGLang</title><style>body{max-width:900px;margin:40px auto;padding:24px;font:16px/1.8 system-ui;color:#142b3c}h1{font-size:30px}h2{margin-top:32px;font-size:21px}table{border-collapse:collapse;width:100%;font-size:13px}td{border:1px solid #bccbd4;padding:10px}a{color:#087e95}small{display:block;color:#526675}li{margin:12px 0}@media print{body{margin:0;padding:0}h2{break-after:avoid}tr{break-inside:avoid}}</style><body>'+reportHtml(body,sources,en)+'</body></html>';}
