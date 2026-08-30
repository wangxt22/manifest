# 交接说明 · 换账号后从这里开始

> 写于 2026-08-31。这个目录是 **Reverie · 灵思絮语**（显化 App）的全部代码和文档。
> 换新账号 / 换新 AI 之后，**先读这一份**，它告诉你其它文档在哪、当前进度到哪、哪些方案已经被否掉了。

---

## 0. 三十秒摸清现状

| | |
|---|---|
| 产品 | Reverie · 灵思絮语 —— 个人显化 App（肯定语 / 感恩日记 / 剧本 / 番茄计时） |
| 形态 | 五个**独立单文件 HTML**，各自自带全套 CSS+JS，靠 `location.href` 互跳 |
| 线上地址 | **https://wangxt22.github.io/manifest/** （已上线，可直接在 iPhone Safari 打开） |
| 仓库 | `git@github.com:wangxt22/manifest.git`，分支 `main`，public |
| 本地目录 | `/Users/wangxueting/ComateProjects/comate-zulu-demo/tryon/` |
| 装机方式 | PWA。Safari 打开线上地址 → 分享 → 添加到主屏幕 |
| 当前最大缺口 | **只存在本机浏览器里**，换手机 / 清缓存就没了（见第 4 节） |

---

## 1. 这个目录里的四份文档，分别管什么

| 文档 | 内容 | 是否上线 |
|---|---|---|
| **HANDOFF.md** | 本文件。交接入口、当前进度、下一步 | 上线（无敏感信息） |
| **DESIGN.md** | 设计与实现文档。设计系统（色彩/字体/毛玻璃配方）、每个页面的功能决策、**28 条踩过的坑**、数据结构、用户核心规则 | ❌ gitignore，只在本地 |
| **CONVERSATION-LOG.md** | 2026-07-30 ~ 08-30 的全部对话原话（已脱敏），含话题分期索引和关键决策摘录 | 见文件头说明 |
| **README.md** | 尚未写 | — |

**要改这个 App，必读顺序：** 本文件 → `DESIGN.md` 的「用户核心规则」和「踩过的坑」两节 → 再动手。

---

## 2. 代码结构

```
tryon/                          ← git 仓库就在这一层
├── index.html                  Pages 根路径跳转兜底 → ./home.html
├── home.html          20 KB    首页：肯定语 / 今日待办 / 今日剧场（横滑 7 天）
├── affirm.html        44 KB    肯定语：沉浸念 + 分板块 + 钟表计时 + 愿景板 6 格
├── gratitude.html     34 KB    感恩日记：日历 + 写日记 + 加图
├── script.html        63 KB    剧本：分类 / 新建 / 演 / 幕 / 归档
├── me.html            28 KB    我的：头像昵称 / 近七日念诵 / 板块累计 / 账号
├── manifest.webmanifest        PWA 清单
├── sw.js                       service worker
├── icons/                      icon-192 / icon-512 / apple-touch-icon(180)
├── covers/                     ⚠️ 空的，等 8 张剧本封面（竖版 3:4）
└── .gitignore                  屏蔽 *.png / 两个 mockup / DESIGN.md
```

**⚠️ 绝对不要在父目录 `comate-zulu-demo/` 执行 `git init`** —— 父目录 542M，且含 `.env` 和 `ai.py`（中转 API 配置）。git 仓库刻意只建在 `tryon/` 这一层。

---

## 3. 换账号后要注意的环境细节

**推代码到 GitHub：**
- 认证走 SSH，密钥在 `~/.ssh/id_ed25519_github`（ed25519，无 passphrase），`~/.ssh/config` 里有 `Host github.com` 段。**换 Claude/Ducc 账号不影响它**，这是本机文件。换电脑才需要重新生成并上传公钥。
- **git 操作必须绕过沙箱**：在 Claude Code / Ducc 里跑 `git push` / `git ls-remote` 要带 `dangerouslyDisableSandbox: true`，否则报 `Error in the HTTP2 framing layer`。注意 `curl https://api.github.com` 是通的，**不要拿 curl 的成功推断 git 也通**（DESIGN.md 坑 #27）。

**Pages 部署：** push 到 `main` 后大约 40~60 秒生效。Source = Deploy from a branch, `main` + `/ (root)`。

**⚠️ Pages 免费版必须公开仓库**（私有 + Pages 需要 GitHub Pro $4/月）。但**代码公开 ≠ 日记公开**：日记数据只在浏览器本地，从没上传过。真想私有可以迁 Cloudflare Pages（免费、支持私有仓库、还能加密码）。

**线上是子路径 `/manifest/`，不是域名根** —— 所有资源引用必须写相对路径（`./sw.js`、`./home.html`），写绝对路径就 404。

**改完代码怎么验：** `sw.js` 对 HTML 是网络优先，所以手机上**直接下拉刷新**就能拿到新代码，不用删了重装 PWA。

---

## 4. 下一步该做什么（按优先级）

### ① localStorage 持久化 —— ✅ 2026-08-31 已完成
五个页面全部落地，**所有伪数据已删干净**（不是留空字符串兜底，是整段删掉换真实空态）。

| 键 | 谁写 | 谁读 | 存什么 |
|---|---|---|---|
| `reverie.home.v1` | home | home | `{todos, aff}` |
| `reverie.affirm.v1` | affirm | affirm | `{boards, reciteList, currentTab}` |
| `reverie.gratitude.v1` | gratitude | gratitude | `{entries, customTags}` |
| `reverie.script.v1` | script | script + **home 只读** | `{scripts, cats, uid}` |
| `reverie.me.v1` | me | me | `{me, acc}` |
| `reverie.stats.v1` | **affirm 只写** | **me 只读** | `{byBoard:{key:{name,mins}}, byDay:{'YYYY-MM-DD':mins}}` |

要点：
- 沉浸念的时长记在 `byBoard.__immerse__`，`name` 是 `沉浸念`。
- **图片一律先过 `shrinkImage(dataURL, cb, maxPx, q)`** 再存 —— iOS localStorage 只有 ~5MB。实测 194KB→28.6KB、99KB→3.3KB，头像 512px/.85 → 37KB→1.6KB。
- `lsLoad()` 必须在第一次 render 之前调用；`JSON.parse` 和 `applyState` 都包 try/catch，存档坏了就当没存过，**不能白屏**。
- `const` 集合不能重新赋值，`applyState` 里只能清空再灌（`arr.length=0` / `delete obj[k]`）。
- `uid` 要一起存，否则重开后新建的剧本 id 会和存档里的撞。
- 跨页派生的视图（me 的图表、home 的今日剧场）要挂 `pageshow(persisted)` + `visibilitychange` 重绘，iOS PWA 回到页面不重跑 JS。
- me 页导出会把所有 `reverie.` 开头的键原样打包成 `reverie-backup-YYYY-MM-DD.json`，换手机靠这个搬。

**遗留：数据只在这台手机的这个浏览器里。** 清缓存、换手机、iOS 主动清理长期不用的 PWA 存储都会丢。真要保住，还是得走下面的「接后端」。

### ② 真机 iPhone 验证 —— 从没做过
本地和线上都用 CDP 验过了，但**这不等于真机验过**。需要人工确认：Safari 添加到主屏幕、全屏（无地址栏）、离线打开、底 tabbar 在真实安全区下的留白。

### ③ 8 张剧本封面截图 —— 等用户提供
放进 `covers/`，文件名固定，`coverStyle()` 会自动认：
`love-dog.jpg` `love-rich.jpg` `money-free.jpg` `work-raise.jpg` `body-shape.jpg` `face-glow.jpg` `self-peace.jpg` `clean-luck.jpg`（竖版 3:4）

### ④ 感恩页的 `+N` 相片角标还是死的 —— 问过三次没答复
需要确认：点它是打开图集，还是别的。

### ⑤ 清死代码
~~`script.html` 里 `.sc.new .ss` 是没有对应 DOM 的死 CSS。~~ 已删（2026-08-31）。

### 更远：接后端
Supabase（免费 500MB / 1GB 存储 / 5GB 出网 / 50k MAU）或 Cloudflare D1+R2。
**接 Supabase 的硬性前提：必须开 Row Level Security 并写好按用户读写的规则**，否则匿名 key 会让任何人读改所有人的日记。`service_role` key **永远不能出现在前端代码或仓库里**。图片是成本瓶颈，上传前客户端压到 1080px WebP。
登录用**邮箱 + 密码**，不要用 magic link —— iOS PWA 里链接会在 Safari 打开，session 带不回来。

---

## 5. 用户核心规则（违反一条就是白做）

1. **零 emoji** —— UI 里绝对不出现
2. **零 unicode 符号图标**（✦ ◆ ♡ ☾ ☆ ❦）—— 原话「符号也太丑了」
3. **慢一点** —— 未确认的方案先用文字讨论，不要直接写代码
4. **不浪费 token** —— 不做用户没要求的东西
5. **要文字回答的时候就只给文字**，不要输出代码
6. **需要点击验证的页面拷一份到 `~/Desktop/`** —— 用户要真机点
7. **不要 AI 生图进产品** —— CSS 渐变兜底就行
8. **不要把逻辑写成界面文案** —— 逻辑对就行，别在 UI 上解释自己
9. **能点的按钮不许长得像灰掉的**
10. **不用系统 `confirm` / `alert`** —— 用 `.cfm` 玻璃弹窗 + `ask(text, onYes)`
11. **不给用户输入设长度上限**
12. **页面顶部不要重复标题**
13. **底 tabbar 保持紧凑**：padding 6px / icon 21px / max-width 396px

**已经被用户逐条否掉的方案，别再提：** 元素溢出 PNG 装饰（成本过高）、番茄钟全屏跳转（它只是计时）、显化档案「N 件已成真」、「显化第 87 天」那行、提醒推送 / 背景音乐 / 屏幕常亮、我的页的数据同步行、剧本页搜索框、「1.2k 人在演」、「改成我的（复制一份）」。

**主体资质：** 个人，没有公司也没有个体工商户 —— **工信部 App 备案过不去，中国区 App Store 上不了**。所以路线是 GitHub Pages + PWA。微信小程序的玄学/显化类目能不能过审，用户还没去查。

---

## 6. 最近一轮改了什么（2026-08-31 已上线）

线上曾经有三个 bug，已修已推已验：

1. **底 tabbar 点不动** —— `affirm.html` 和 `gratitude.html` 一个 `onclick` 都没绑，四个 tab 是纯装饰。
2. **沉浸念同一张图铺三遍** —— 代码是 `used[i % used.length]` 循环板块 + 永远取 `images[0]`。改成把涉及板块的图全收进来去重，不够 6 格用不重样的渐变补位。
3. **开始/正计时被 tabbar 挡住** —— `html,body{height:100%}` + `min-height:100vh` 把 body 高度锁死，`padding-bottom` 撑不开滚动范围。改成 `html{height:100%}` + `min-height:100%` + `padding-bottom:calc(118px + env(safe-area-inset-bottom))`。留白要按首页那个上凸 22px 的球算（实测占位 87px），不能只按 tabbar 自己的 62px。

顺带统一了五个页面的 `<title>`。细节和验证方法见 `DESIGN.md` 坑 #24 / #25 / #26。
