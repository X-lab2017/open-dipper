import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const raw=JSON.parse(fs.readFileSync(path.join(root,'data/reference/radar/source-extract.json'),'utf8'));
const copy=(zh,en)=>({zh,en});
const groups={applications:0,frameworks:1,runtime:2,engineering:3,language:0,multimodal:1,retrieval:2,data:3};
const labels={openrank:copy('OpenRank','OpenRank'),participants:copy('参与者','Participants'),stars:copy('Stars','Stars'),downloads:copy('下载记录','Downloads'),modelrank:copy('ModelRank','ModelRank'),testExamples:copy('测试样本','Test examples'),likes:copy('Likes','Likes')};
const units={OpenRank:copy('分','score'),participants:copy('人','people'),stars:copy('个','stars'),downloads:copy('次','downloads'),ModelRank:copy('分','score'),examples:copy('条','examples'),likes:copy('个','likes')};
const descriptions={
 'Codex':copy('终端中的编码 Agent，从可回滚的小任务开始。','A terminal coding agent. Start with a small, reversible task.'),
 'Gemini CLI':copy('把终端编码、工具调用与现有工作流连接起来。','Connect terminal coding and tool use to your existing workflow.'),
 'Dify':copy('用可视化工作流组织 AI 应用、检索与工具。','Organize AI applications, retrieval and tools in visual workflows.'),
 'LangChain':copy('把模型、检索与工具组合为应用流程。','Compose models, retrieval and tools into application workflows.'),
 'Pydantic AI':copy('围绕类型、结构化输出和可测试接口构建 Agent。','Build agents around types, structured output and testable interfaces.'),
 'Google ADK':copy('围绕 Python 工具与 Agent 编排建立原型。','Prototype Python tools and agent orchestration.'),
 'MCP Servers':copy('探索工具和数据连接，先核验权限与来源。','Explore tool and data connections, starting with permissions and provenance.'),
 'Browser Use':copy('将网页操作变成可检查、可重放的任务。','Turn browser interaction into tasks you can inspect and replay.'),
 'Daytona':copy('为代码执行与开发任务探索隔离运行环境。','Explore isolated execution environments for coding and development tasks.'),
 'vLLM':copy('面向模型推理与服务，核对硬件、模型和负载。','Explore model inference and serving across hardware and workloads.'),
 'LlamaFactory':copy('组织模型微调实验，固定数据、参数与验证集。','Organize fine-tuning experiments with pinned data and validation sets.'),
 'Langfuse':copy('从调用轨迹与评测记录观察 LLM 应用。','Inspect LLM applications through traces and evaluation records.')
};
const sourceScope=s=>s.id==='landscape'?copy('固定 Landscape CSV；OpenRank 2026-08、参与者 2026-07。仅摘录身份、分类与数值，未复制选择理由或图件。','Pinned Landscape CSV: OpenRank 2026-08 and participants 2026-07. Factual identifiers, taxonomy and numbers only; no selection prose or artwork copied.'):s.id==='gosd-models'?copy('X-lab2017 / GOSD 报告模型全景摘录；2026-10-02 近30天下载快照，不是用户数或能力评分。','X-lab2017 / GOSD model-landscape extract: trailing-30-day downloads at 2026-10-02, not users or capability scores.'):s.id==='gosd-modelrank'?copy('X-lab2017 / GOSD 模型影响力摘录；CSV 未携带统计期，保留未知。','X-lab2017 / GOSD model-influence extract. The CSV does not specify its statistical period.'):copy('Hugging Face 公开元数据；revision 与声明许可保留。下载窗口未在响应中声明；未复制模型权重或数据内容。','Public Hugging Face metadata with revision and declared license. The response does not state a download window. No weights or dataset contents copied.');
const sources=raw.sources.map(s=>({...s,observedAt:s.id==='gosd-models'?'2026-10-02':null,scope:sourceScope(s)}));
const entities=raw.entities.map(e=>({
 id:e.id,kind:e.type,name:e.name,short:e.name.replace('OpenAssistant OASST1','OASST1').replace('SWE-bench Verified','SWE-bench').replace('Qwen3 Coder · GGUF','Qwen3 Coder'),owner:e.slug.split('/')[0],category:groups[e.category],scenarios:e.tasks,
 description:descriptions[e.name]??e.purpose,url:e.url,version:e.revision,license:e.license,
 tags:[e.purpose],sourceIds:e.sourceIds,
 metrics:e.metrics.map(m=>({...m,label:m.id==='downloads'&&m.period?.includes('30 days')?copy('近30天下载','30-day downloads'):labels[m.id]??copy(m.id,m.id),unit:units[m.unit]??copy(m.unit,m.unit),period:m.period?.includes('30 days')?'2026-10-02 · 30d':m.period,...(e.trend?.metric===m.id?{series:e.trend.points}:{} )})),
 upstream:{platform:e.platform,id:e.upstreamId,slug:e.slug,sourceClassification:e.sourceClassification??null,pinnedCardUrl:e.pinnedCardUrl??null,versionNote:e.versionNote,descriptionStatus:'ai-assisted organization, not tested performance'}
}));
const detail={
 Codex:['trial','把一个真实缺陷拆成可验证的小任务，比较补丁质量与人工接管次数。','Break a real defect into a verifiable task; compare patches and manual interventions.','小范围修复、测试补充与代码审查','Small fixes, tests and code review','仓库权限、可执行命令和变更回滚','Repository permissions, executable commands and rollback'],
 'Gemini CLI':['trial','复用同一组编码任务，观察工具协作方式与上下文管理。','Reuse the same coding tasks to examine tool interaction and context management.','终端工作流与代码辅助','Terminal workflows and coding assistance','凭据范围、模型配置和操作确认','Credential scope, model configuration and action confirmation'],
 Dify:['adopt','用一条可视化流程把检索、模型和人工检查连接起来。','Connect retrieval, models and human checks in a visual workflow.','知识问答原型与流程验证','Knowledge QA prototypes and workflow trials','插件权限、数据外发和实际许可','Plugin permissions, data egress and actual license terms'],
 LangChain:['adopt','从单一检索任务开始，逐步加入工具，并保留每步输入与输出。','Start with one retrieval task, then add tools while recording each input and output.','检索增强与工具编排','Retrieval augmentation and tool orchestration','版本兼容、失败恢复和可观测性','Version compatibility, failure recovery and observability'],
 'Pydantic AI':['trial','先固定结构化结果与错误样例，比较接口约束是否让验证更容易。','Pin structured outputs and error cases to test whether interface constraints simplify validation.','结构化输出与类型约束任务','Structured-output and typed-interface tasks','模型支持范围、验证失败与重试成本','Model support, validation failures and retry costs'],
 'Google ADK':['assess','用一个明确角色的 Agent 原型，验证工具边界与调用链路。','Prototype an agent with a defined role and test its tool boundaries and call chain.','Python Agent 原型','Python agent prototypes','框架接口变化与所需服务依赖','Interface changes and required service dependencies'],
 'MCP Servers':['trial','选择一个只读数据连接，先验证授权、结果格式与错误处理。','Try a read-only data connection first, checking authorization, output format and errors.','Agent 工具与资料连接','Agent tools and information connections','服务来源、最小权限与提示注入','Server provenance, least privilege and prompt injection'],
 'Browser Use':['assess','从一个不涉及支付或提交的网页任务开始，记录页面变化与失败条件。','Start with a web task without purchases or submissions; record page changes and failure conditions.','网页资料收集与流程演练','Web research and workflow rehearsals','网站规则、账号边界与误操作','Site rules, account boundaries and unintended actions'],
 Daytona:['trial','把执行环境与宿主数据隔离，用同一任务核对启动成本和清理过程。','Isolate execution from host data and examine startup costs and cleanup with the same task.','代码执行和开发沙箱','Code execution and development sandboxes','网络出口、资源限制与凭据清理','Network egress, resource limits and credential cleanup'],
 vLLM:['adopt','在固定硬件和请求集合上测试吞吐、延迟与显存，记录完整配置。','Measure throughput, latency and memory on fixed hardware and requests; keep the full configuration.','自托管推理服务实验','Self-hosted inference experiments','模型兼容、量化格式与硬件条件','Model compatibility, quantization format and hardware'],
 LlamaFactory:['trial','以小规模、许可明确的数据集建立可重复的微调实验。','Build a reproducible fine-tuning experiment with a small, clearly licensed dataset.','微调与参数实验','Fine-tuning and parameter experiments','数据许可、训练开销与评测泄漏','Data permissions, training cost and evaluation leakage'],
 Langfuse:['trial','从已有应用接入少量脱敏轨迹，检查失败原因能否被复现。','Use a small set of redacted application traces to check whether failures can be reproduced.','调用链路观察与评测记录','Tracing and evaluation records','敏感数据、采样规则与许可条件','Sensitive data, sampling rules and license conditions']
};
const softwareSteps=[copy('固定仓库 commit、运行环境和模型配置，在隔离环境创建试验。','Pin the repository commit, environment and model configuration in an isolated trial.'),copy('准备 5 个熟悉的任务，事先写下成功标准、允许的操作和退出条件。','Prepare five familiar tasks with success criteria, allowed operations and stopping conditions.'),copy('记录结果、人工修正次数、耗时与资源消耗；核对变更后再采用。','Record outcomes, manual corrections, time and resource use; inspect changes before adoption.')];
const modelSteps=[copy('锁定模型 revision 与具体权重格式，核对官方模型卡和许可。','Pin the model revision and weight format, then inspect the official model card and license.'),copy('在你的硬件上先跑最小样例，记录显存、上下文设置和生成参数。','Run a minimal example on your hardware, recording memory, context settings and generation parameters.'),copy('使用固定且不重叠的任务集，与另一候选按同一配置比较结果和成本。','Use a fixed non-overlapping task set and compare outcomes and cost with another candidate under the same configuration.')];
const dataSteps=[copy('固定数据 revision、配置与 split，确认样本单位、许可和用途限制。','Pin the data revision, configuration and split; confirm units, license and use restrictions.'),copy('抽查样本、去重与质量，保留训练集和测试集的边界。','Inspect samples, duplication and quality while preserving train/test boundaries.'),copy('记录清洗、筛选和评测步骤；提交可复现的记录与发现的缺口。','Record cleaning, filtering and evaluation steps; contribute reproducible records and identified gaps.')];
const assessments=entities.map((e,i)=>{
 const d=detail[e.name];
 if(d)return {entityId:e.id,ring:d[0],why:copy(d[1],d[2]),fit:copy(d[3],d[4]),caution:copy(d[5],d[6]),steps:softwareSteps,change:copy(`${e.short}：试用清单等待验证`,`${e.short}: trial checklist ready to verify`)};
 if(e.kind==='software')return {entityId:e.id,ring:['trial','adopt','assess','trial','adopt'][i%5],why:copy(`围绕“${e.description.zh}”设置一个可复现的小任务，与现有工具对照验证。`,`Set up a reproducible task for ${e.description.en.toLowerCase()} and compare it with your existing tools.`),fit:e.description,caution:copy('固定版本、接口兼容、数据权限与资源成本','Pinned version, interface compatibility, data permissions and resource cost'),steps:softwareSteps,change:copy(`${e.short}：场景试用与证据待共建`,`${e.short}: contribute task trials and evidence`)};
 const isData=e.kind==='dataset';
 return {entityId:e.id,ring:isData?['trial','assess','adopt','trial','assess','trial'][i%6]:['trial','adopt','trial','assess','trial','adopt'][i%6],
 why:isData?copy('把数据用途与验证目标对应起来，先检查样本和复用条件，再纳入实验。','Match the dataset to a verification goal. Inspect samples and reuse conditions before adding it to an experiment.'):copy('将这个具体发布版本加入候选，用你的任务、硬件和评分规则验证适配性。','Add this published version to a shortlist and verify its fit using your own tasks, hardware and evaluation rules.'),
 fit:e.description,
 caution:isData?copy('版本与 split、许可范围、重复数据和评测污染','Version and split, license scope, duplication and evaluation contamination'):copy('权重格式、显存需求、任务能力与实际许可','Weight format, memory needs, task performance and actual license terms'),
 steps:isData?dataSteps:modelSteps,
 change:isData?copy(`${e.short}：样本与复现任务待共建`,`${e.short}: contribute sample checks and reproductions`):copy(`${e.short}：场景对比任务待验证`,`${e.short}: scenario comparison awaits verification`)};
});
const files={'public/data/radar-catalog.json':{schemaVersion:1,assembledAt:raw.preparedAt,sources,entities},'public/data/radar-demo.json':{schemaVersion:1,fixtureDate:'2026-10-26T00:00:00Z',provenance:'demo',assessments}};
for(const [name,value] of Object.entries(files)){const out=JSON.stringify(value,null,2)+'\n',target=path.join(root,name);if(process.argv.includes('--check')){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==out)throw new Error(`Radar output drift: ${name}`);}else fs.writeFileSync(target,out);}
console.log(`Radar ${process.argv.includes('--check')?'verified':'generated'}: ${entities.length} observed entities, ${assessments.length} separately labelled demo assessments`);
