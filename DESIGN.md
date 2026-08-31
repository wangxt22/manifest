# Reverie · 灵思絮语 · 设计与实现文档

> 一款融合 洛可可 + 宇宙 + 玄学灵性 的显化 app。为个人使用打造。
> 元素：蝴蝶、宇宙、天使 · 视觉基调：Apple 毛玻璃 + 玫瑰玄粉 + 衬线优雅
> 线上：https://wangxt22.github.io/manifest/
> 更新时间：2026-08-31

---

## 产品定位

**名字：** Reverie · 灵思絮语
**核心目的：** 帮助用户每日显化（Manifestation）—— 通过肯定语念诵、感恩练习、7 日剧本（显化练习序列）触达潜意识。
**用户：** 相信"想什么就来什么"、"心念创造现实"的女性用户为主，追求视觉美感、仪式感、玄学感。
**参考：** 宇宙订单 · Manifest Market · 番茄 ToDo · Flower Folder · Nocturne 视觉

---

## 视觉与设计语言（Design System）

### 色彩

```
--bg              #FFF3F7    奶油粉底
--surface         rgba(255,253,254,.88)  玻璃卡片表面（配 backdrop-filter）
--pearl           #F1E3E8    分割线珠光粉
--rose            #D4A5B0    主玫瑰色（勾选圈、首页凸起球）
--rose-deep       #A87682    深玫瑰（按钮渐变尾、强调文字）
--rose-soft       #E9C4CD    浅玫瑰
--gold            #C9A87A    金色装饰（金线分割等）
--t1              #5A3D4A    主文字
--t2              #8B6B7A    次文字
--t3              #B89AAA    辅助文字（占位/时间戳）
```

### 字体

```
--serif-en    Cormorant Garamond    英文衬线 · 大标题 / 数字 / 装饰
--sans-en     Inter                 英文正文
--serif-cn    Noto Serif SC         中文衬线 · 标题 / 肯定语
--sans-cn     苹方                   中文正文
```

规则：
- **英文标题**用 Cormorant italic（Daily Affirmation, Today's Ritual, Rose Whisper）
- **数字**用 Cormorant Garamond 600（钟表 "开始"、时间 "25:00"、日期）
- **中文标题**用 Noto Serif SC
- **中文正文/肯定语句子**用 Noto Serif SC
- **UI 交互文字（按钮/tag/胶囊）**用苹方

### 视觉核心：Apple Liquid Glass

所有卡片、tab、tabbar 都是玻璃质感：
```css
background:rgba(255,253,254,.88);
backdrop-filter:blur(24px) saturate(180%);
border:1px solid rgba(255,255,255,.85);
box-shadow:0 6px 24px rgba(180,120,130,.14),
           inset 0 1px 0 rgba(255,255,255,.9);
```

- `blur` 20~40px · `saturate` 180% 让背景色更饱和
- 内高光 `inset 0 1px 0` 是玻璃感的灵魂
- 外阴影用 玫瑰灰（rgba(180,120,130,.x)）不是黑，避免脏

### 圆角

```
--r-card    20px   卡片
--r-pill   999px   胶囊按钮 / tab / tabbar
--r-input   14px   输入框
```

### 明确禁止

- **任何 emoji**（全站零 emoji）
- **AI 图片生成**做进产品（成本太高给用户），仅允许 demo 阶段本地占位
- **纯色描边图标不加彩色渐变**（会显廉价）
- **元素溢出的 PNG 装饰**（想过但成本太高，被否）

---

## 全局导航结构（底 tabbar）

5 个一级 tab（左右各 2，中间凸起首页）：

```
[肯定语 Affirmation]  [感恩 Gratitude]  [首页 Home 凸起]  [剧本 Script]  [我的 Me]
```

- 首页凸起球是玫瑰实心 `--rose` · 无白圈 · 只有极细内高光
- 图标线粗 1.65 无衬线
- 高度紧凑（padding 6px），宽度 396px 靠中

**五个页面的 tabbar 五格必须全部能点**（`location.href` 跳过去），当前页那格只是高亮，其余四格都是真链接。上线后才发现 affirm 和 gratitude 两页一个 `onclick` 都没绑，详见坑 #24。

**tabbar 是 fixed 的，所以每页 body 要留白：**
```css
html{height:100%}                                        /* 不要 html,body{height:100%} */
body{min-height:100%;                                    /* 不要 min-height:100vh */
     padding-bottom:calc(118px + env(safe-area-inset-bottom));}
```
118px 是**按首页那个上凸 22px 的球**算的（实测整条占位 87px + 余量），不能只按 tabbar 自己的 62px 算，否则底部内容还是会被球压住。为什么不能用 `100vh` / 锁 body 高度 —— 见坑 #26。

---

## 阶段进度

### ✅ 已完成

#### Phase 1 · 视觉与设计系统
- Design Tokens 定稿（颜色/字体/圆角/阴影）
- 玻璃卡片规范
- 底 tabbar 规范
- 拒绝了 emoji · 拒绝了元素溢出装饰

#### Phase 2 · Home 首页（tryon/home.html · v4）
- 顶部裸奔（无 Reverie 品牌名 / 日期）
- Daily Affirmation 卡（英文标签 + 中文肯定语 + 英文签名 + 金线上下装饰）
- **Begin the Ritual「开始今日仪式」入口卡**（一行小字 + 右侧玫瑰渐变箭头球）→ 跳 affirm.html
- Today's Ritual Todo 卡
  - 头部左侧："3 things 今日 3 项"
  - 头部右侧：**释放胶囊按钮**（玫瑰渐变 + 羽毛 SVG 图标 + "释放"）—— 用户表达"这个愿望我不再执念、交给宇宙"
  - Todo 行：圆勾选框（勾选后玫瑰色实心 + 白勾）
  - 底部："+ 添加新的今日事"虚线分割行
- Today's Theater 卡（7 日显化剧本）
  - 头部："Rose Whisper 爱情丨粘人小狗" + "DAY 3 / 7" 玫瑰胶囊
  - 横向 7 圆点时间轴（已完成的浅玫瑰 + 当前深玫瑰实心大 + 未来空心）
  - Scene 场景块（早/晚）· 左侧渐变竖条 · 虚线分场景
- **已删除**：Daily Affirmation 右侧的 EDIT · Today's Theater 右侧的 ALL

#### Phase 3 · Affirmation 肯定语页（tryon/affirm.html · v2 · 当前状态）
布局（一屏可见）：
```
顶 tab: 沉浸念 · 财富金钱 · 事业职场 · 爱情关系 · 健康身体 · 自我内在 · + 新建
分类 tab 顶部小字：xx · 累计 xh xm · 本周 xm（数字 contenteditable）
愿景板 3×2 = 6 张（每张可点，用户能上传/替换/删除）
念诵清单卡（右上 "+ 添加句子"）
钟表卡（150px 圆环 + 时长胶囊）
底 tabbar
```

**已实现的交互：**
- 顶 tab 切换（切板块 → 愿景板 + 清单 + 统计行 全部换）
- 沉浸念 tab：清单是当前拼盘（可从多板块混选）
- 分类 tab：清单是该板块所有句子（永久内容）
- **添加句子按钮**（视觉一致，行为分场景）：
  - 沉浸念 → 半屏抽屉 → 勾选板块（一键全选）+ 展开选句（勾具体句子）→ 完成后清单同步
  - 分类 tab → 小对话框 → 输入一句加进该板块永久
- **新建板块**：点 "+ 新建" → 弹对话框 → 输入板块名 → 立刻创建 tab 并跳入（空清单 + 6 张空占位图）
- **愿景板图片**：每格支持上传/替换/删除
  - 空格点击 → 弹图片操作 sheet → 从相册选择
  - 已有图点击 → 弹 sheet（替换 / 移除）
  - 用 FileReader 读为 DataURL 存入 BOARDS[key].images[i]
  - 沉浸念 tab 的愿景板**把当前清单涉及的所有板块的图全收进来去重**（`pics` 数组），按顺序铺 6 格，不够的用**不重样的渐变**补位。最早写的是 `used[i % used.length]` 循环板块 + 永远取 `b.images[0]`，板块少于 6 个时同一张图会同时铺在 i=0/2/4，详见坑 #25
- **分类 tab 顶部统计行**：数字用 contenteditable，可直接点了改（demo 阶段用）
- **钟表模块**（最终版本）：
  - 待机：环中央"开始"衬线粗体 + 小字"正计时"
  - 点击环 → 正计时启动，数字 `mm:ss` 往上加，环外呼吸光晕 3.6s 一循环
  - 再点 → 暂停，小字变"已暂停"
  - 再点 → 继续
  - 长按 700ms → confirm 弹窗 → 确认后结束并 toast 记录时长到当前 tab 分类
  - 点 5m/15m/25m/45m → 切倒计时模式，环显示进度弧（玫瑰渐变，随时间消退）
  - 倒计时数字往下减，走完自动结束 + 记录 + 回到待机

**关键设计决策：**
- **钟表本身就是按钮**（点环 = 开始/暂停），不需要额外的 ▶ 按钮
- **钟表 = 一屏一半以下**，愿景板 + 清单是主视觉
- **番茄钟不切图不切句**，只计时 + 分类统计
- **正计时是默认**，倒计时是快捷选项（跟番茄 ToDo 一致）
- 底 tabbar 五格上线后才补上真实跳转（坑 #24）

---

### 🟡 进行中 / 即将

#### Phase 4 · 感恩日记（tryon/gratitude.html · ✅ 已完成）
- 月历卡：有记录的日子玫瑰渐变实心圆，今天玫瑰细描边环
- 点有记录的日子 → 平滑滚到那条 + 1.4s 高亮；点空日子 → 开编辑器
- **写入口只有一个**：今日卡右侧 52px 玫瑰渐变加号球（曾经有个右下角 FAB，重复，已删）
- 今日卡主问句**固定**「今天你感恩了吗？」，状态只体现在下面那行小字
- 全屏上滑编辑器：文字在上 / 图片在下 / 标签在最下
- **图片无上限**，支持一次多选批量上传（FileReader + pending 计数）
- 流里每条最多铺 4 张，多的在第 4 张上盖 `+N` 蒙层（还是不可点，问过三次没答复，未来接大图浏览）
- 4 个预设标签（感恩/幸运/显化成真/心情）+ 用户自定义标签（自定义在流里显金色）
- 空内容不许保存；月份可前后翻（跨年正常）；只显示当月
- 底 tabbar 五格上线后才补上真实跳转（坑 #24）

#### Phase 5 · 剧本（tryon/script.html · ✅ 已完成）
排版结构参考小红书「宇宙订单」那篇的**逛的骨架**（不是订单玩法本身）：分类胶囊 → 区标带件数 → 双列封面卡（封面 + 名字 + 简介 + 按钮）。深蓝金皮肤翻译成玫瑰玻璃。

页面结构：
```
Now Playing 正在演        n 部     ← 横滑，一次露一部，下面小点指示
  剧本名 / 分类·共 n 天 / DAY x / N
  7 个圆点（当前周窗口，不用手滑）· 第 x 周 · 共 y 周
  第 1 幕 / 第 2 幕（每幕最多 2 行，超了省略号）
  还有 n 幕 →
Scripts 剧本库            n 部
全部 · 爱情 · 财富 · 事业 · 健康 · 外貌 · 自我 · 清理 · 演过的 n · + 新分类
双列卡：封面（图/渐变 + 英文衬线一句）· 名字 · 简介 · n 天 n 幕 已写 n · 详情/开启
第一张是虚线卡「自己写一部」（筛了分类就是「在xx里写一部」）
```

**核心规则（用户拍板）：**
- **同时可以演很多部**，不设上限
- **天数按自然日算**（`Math.floor((今天-开启日)/864e5)+1`），**没有暂停**，中间没写那天就空过去
- 只有两个出口：**演完了** / **不演了** —— 都归档
- 幕叫 **第一幕 / 第二幕 / 第三幕**，不叫早晚；**按天各自加减**（DAY 1 两幕、DAY 3 五幕都行）
- **一幕字数不限**
- 天数 **1–30**，详情页步进器加减；**已经演过的天不能删**，减到当前天为止；删有内容的天要二次确认
- **归档 = 书架不是回收站**：胶囊最后一格「演过的 n」，封面去饱和 + 已完成/已停止小标签，卡上给「再演一轮」和「彻底删除」。删只能用户手点。
- **再演一轮**：DAY 归 1，开始日改今天，写过的幕全留着
- **没有「改成我的（复制一份）」**，也没有 preset 保护概念 —— 预设剧本用户想改就直接改
- 封面：能传自己的图（DataURL），不传退回 8 套玫瑰/紫/金/蓝/绿渐变
- **已有的剧本也能换封面**：详情页 hero 右上角玻璃小胶囊「换封面」（传过图的多一个「移除」，移除走 `ask()` 确认退回渐变）。新建抽屉那格和详情页共用同一个 `#cvInput`，靠 `cvTarget`（null = 新建那格 / 有 id = 给这部换）分流
- 写幕的抽屉里会顺手显示**上一幕**（或上一天最后一幕），接得上
- 卡片和详情页那栏叫**简介**，不叫「推荐理由」（这是自己的剧本，不是别人推荐给你的）
- **分类胶囊长按可以拖着挪顺序**（「全部」「演过的」「+ 新分类」钉死不参与），松手 toast 提示
- **界面上不写逻辑说明**：天数下面没字，「自己写一部」没副标题，新建分类没举例
- **确认框自己画**（`.cfm`）不用系统 `confirm`

预设 8 部（每部 7 天 × 2 幕 = 14 幕，第一人称现在时）：
粘人小狗(爱情) 富婆宠爱(爱情) 财富自由(财富) 升职加薪(事业) 理想身材(健康) 素颜发光(外貌) 自我和解(自我) 去晦气(清理)

封面图位：`tryon/covers/` 下 `love-dog.jpg` `love-rich.jpg` `money-free.jpg` `work-raise.jpg` `body-shape.jpg` `face-glow.jpg` `self-peace.jpg` `clean-luck.jpg`，竖版 3:4。缺图自动走渐变。

#### Phase 2 补充 · home.html 今日剧场改横滑
多部在演，一张卡装不下 → `.th-wrap` 横滑一次露一部 + `.th-ind` 小点。每幕 2 行截断，超过 2 幕收成「还有 n 幕 →」。底 tabbar 五个 tab 全接上了真实跳转。顶部那条 `v3 更新…` 开发备注已删。

#### Phase 6 · 我的（tryon/me.html · ✅ 已完成 · 结构跟用户逐条对过）
定位就一句：**轻量**。不做仪表盘，不堆图表。

页面结构：
```
头像（可换） 昵称（可改） / Still becoming.
Traces 卡：近七日念诵小柱状（40px 高）+ 七日总时长 · 分隔 · 5 个板块累计时长
设置四行：个人信息 / 账号 / 导出备份 / 关于 Reverie
```

**砍掉的东西（用户逐条否掉的，别再加回来）：**
- **显化档案 / 「N 件已成真」** —— 用户第一反应是「这咋统计？没懂」。它其实只是自己勾的清单条数，而感恩页的「显化成真」标签已经在干这件事了。这是我自己想多的功能，砍。
- **「显化第 87 天 · 从 2026.06.05 起」** —— 不加
- **提醒 / 背景音乐 / 念诵时屏幕常亮（Wake Lock）** —— 全不要
- **数据同步那一行** —— 同步应该是静默的，不该占一行让用户操心

**核心规则：**
- 头像和昵称**都能改**：头像点了走 `#avaInput`（FileReader → DataURL），设置好之后相机角标消失；昵称是 `contenteditable`，回车收起，空了退回原值并 toast
- 念诵时长和板块累计**都做小**：柱状图从 132px 压到 40px，跟板块行挤在同一张卡里
- 登录用**邮箱 + 密码**（不是 Apple / 微信 / 短信）。一个抽屉两个态（登录 / 注册），`lgMode` 切
  - 为什么不用 magic link：iOS PWA 里邮件链接会在 Safari 里打开，不回到 PWA 容器，session 带不回来
- 账号抽屉两个态：未登录一段说明文字 + 一个登录按钮；已登录 邮箱 / 修改密码 / 退出登录 / **注销账号**
- **注销账号必须有** —— 苹果硬要求，只有退出登录会被拒审。删数据要走服务端
- 导出备份是**真能下载**的（Blob → JSON），不是假按钮
- 现在 `ACC` / `ME` 都是内存假数据，位子先占对，接 Supabase 时换成 `signUp` / `signInWithPassword` / `resetPasswordForEmail` / `signOut`

#### Phase 7 · PWA 装机（✅ 已完成 · 已在本地 HTTP 上验过）
技术路线用户拍板：**GitHub Pages + PWA**（不做原生壳，不用 uniapp）。

新增文件：
- `manifest.webmanifest` —— `display:standalone`，`start_url:./home.html`，主题色 `#FFF3F7`，3 个 icon 条目（192 / 512 / 512-maskable）
- `sw.js` —— cache 名 `reverie-v1`
  - **HTML 走网络优先**（`req.mode === 'navigate'` 或 accept 里有 `text/html`）：改了代码推上去刷新就是新的，不会被缓存卡死；断网了回落缓存，再兜底 `./home.html`
  - 其他静态资源走缓存优先
- `icons/` —— `icon-512.png` / `icon-192.png` / `apple-touch-icon.png`(180)：玫瑰渐变底 + 斜体 Cormorant 的 R + 上下两道金色细线。没 emoji 没符号
  - 512 是母版，小尺寸用 `sips -z N N` 缩。**别用 `--force-device-scale-factor`**，它会给出尺寸不对的文件（要过 192 给了 96）

五个页面都注入了：manifest link / theme-color / `apple-mobile-web-app-capable` / `apple-touch-icon`，以及注册脚本。**注册必须判协议**：
```js
if("serviceWorker" in navigator && location.protocol.startsWith("http")){ … }
```
`file://` 注册不了 SW，不判协议本地打开会报错。

iPhone 装机路径：Safari 打开 → 分享 → 添加到主屏幕 → 全屏图标 App。
**iOS PWA 推送不可靠**，这也是「提醒」被砍掉的原因之一。

已验（本地 `python3 -m http.server` + CDP 实测 `home.html`）：manifest 解析 OK / SW scope `/` 且 `active.state=activated` / `navigator.serviceWorker.controller` 有值 / cache `reverie-v1` 里 10 条预缓存（5 个页面 + `/` + manifest + 3 个 icon）。
**没验**：真机 iPhone Safari 添加到主屏幕的实际效果、离线打开。

#### Phase 8 · GitHub Pages 部署（✅ 已上线）

线上地址：**https://wangxt22.github.io/manifest/**
仓库 `git@github.com:wangxt22/manifest.git` · 分支 `main` · Settings → Pages → Source = **Deploy from a branch**，`main` + `/(root)`。

**git 仓库刻意建在 `tryon/` 这一层，不是父目录 `comate-zulu-demo`：**
父目录 542M，而且里面有 `.env` 和 `ai.py`（openai-next 中转 API 的配置和 key）。**永远不要在父目录 `git init`** —— 一旦 add 全量，key 就进了公开仓库的历史里，删都删不干净。

**认证走 SSH，不用 PAT：**
- `~/.ssh/id_ed25519_github`（ed25519，无 passphrase，`chmod 600`）
- `~/.ssh/config` 里加了 `Host github.com` 段指到这把私钥
- 为什么不用 PAT：token 要贴进对话才能用，贴进来就等于泄露了，还得再去 revoke。SSH 私钥从头到尾不出本机。

**为什么仓库是 public：**
Pages 免费档必须公开仓库。私有仓库 + Pages 要 GitHub Pro（$4/月），而**私有 Pages（登录才能看）是 Enterprise 才有的**，Pro 也买不到。
**代码公开 ≠ 日记公开** —— 日记、图片、剧本全在浏览器本地内存/localStorage，从来没上传过，仓库里只有五个 HTML 的壳。
真想连代码也私有：迁 **Cloudflare Pages**（免费、支持私有仓库、还能给站点加密码保护）。

**子路径这个坑：**
Pages 项目站点是从 **`/manifest/` 子路径**提供的，不是域名根。所以所有资源引用必须是**相对路径** —— `./sw.js`、`./manifest.webmanifest`、`./home.html`。写成 `/sw.js` 直接 404。

**新增 `index.html` 做跳转兜底**（Pages 根路径要有 `index.html`），四重保险：
`<link rel=canonical>` + `<meta http-equiv=refresh>` + `location.replace('./home.html')` + 一个可点的 `<a>`（前三样全被拦时用户还能自己点）。

**已验的 content type：**`manifest.webmanifest` 返回 `application/manifest+json`，`sw.js` 返回 `application/javascript` —— 这两个类型不对 PWA 就装不上，Pages 默认给对了。

**顺手统一了五个页面的 `<title>`：**`肯定语 · Reverie` / `感恩 · Reverie` / `剧本 · Reverie` / `我的 · Reverie` / 首页和 `index.html` 是 `Reverie · 灵思絮语`。home 之前还挂着早就废掉的 `Reverie · Sanctum`。title 是添加到主屏幕时的默认图标名，不统一装出来名字是乱的。

**上线后修的三个 bug**（都已推线上验过）：tabbar 没绑（坑 #24）、沉浸念铺图重复（坑 #25）、底部内容被 tabbar 永久盖住（坑 #26）。

#### 上架这条路（用户情况：个人，没有公司主体）
- **中国区 App Store 走不通** —— 工信部 App 备案要企业或个体工商户，个人拿不到
- 微信小程序个人可以注册，但**玄学/显化类目能不能过审没查过**，这个结果决定 uniapp 到底值不值得做
- 所以现在就是 GitHub Pages + PWA：不用审核，不用主体，改完推上去就生效
- **GitHub Pages 免费档要求仓库 public**，所以：仓库里不能有任何 key，不能有日记内容

#### 后端（还没接 · 只定了方向）
- Supabase 免费档：500MB 库 / 1GB 存储 / 5GB 出网 / 5万 MAU。缺点是国内直连不稳，且**闲置 7 天会被暂停**
- Cloudflare D1 + R2：5GB / 10GB、出网免费，但**没有现成的登录**，要自己写
- anon key 是设计上可以公开的，**但前提是开了 RLS（行级安全）**并写好「只能读写自己那行」的策略。不开 RLS = 任何人能读改所有人的日记
- **`service_role` key 永远不许进前端代码、不许进仓库**
- **图片是成本瓶颈**：手机照片 3–5MB，1GB 装不到 300 张。所以第一天就要在前端压到 1080px WebP（100–200KB）


---

### ⏳ 待办

- **持久化（下一个最大的缺口，就做这个）** —— 现在所有页面刷新全丢：新建的剧本、传的封面、写的幕、头像、昵称、chip 顺序、感恩日记。而且**iOS PWA 被系统回收内存之后重开等同于刷新**，装到主屏幕上更需要它。接 localStorage 打底
- **真机验 PWA** —— iPhone Safari 添加到主屏幕、全屏行为、离线打开。本地验过、线上跑通，都不等于真机验过
- **8 张封面截图**（用户要截 · 竖版 3:4 · 放 `tryon/covers/`）—— 缺图不卡住，自动退回渐变
- 感恩流里第 4 张图上的 `+N` 蒙层还是死的，点不动 —— 要不要接大图浏览（**问过三次没答复**）
- **查微信小程序玄学/显化类目能不能过审**（用户要查）—— 结果决定要不要做小程序
- 接 Supabase：建表 + 开 RLS + 邮箱登录 + 把 localStorage 里的数据迁上去；注销账号的真实删除要走服务端
- 前端图片压缩到 1080px WebP —— 不做的话 1GB 存储装不到 300 张
- 分类统计从假数据换成真实累计（当前 contenteditable 是 demo 便利）
- PNG 装饰资产（用户提到会上传"沉浸念左上角超级牛逼的图"—— 蝴蝶）
- 清死代码：script.html 里的 `.sc.new .ss`
- `backdrop-filter` 在安卓微信 WebView 里可能不支持 —— 整套视觉都压在它上面，真要投微信得准备不透明兜底

**这轮划掉的两条：**
- ~~推 GitHub Pages~~ —— 已上线 https://wangxt22.github.io/manifest/ ，仓库 public、没带 key、没带日记
- ~~三个线上 bug~~ —— tabbar 没绑（坑 #24）/ 沉浸念铺图重复（坑 #25）/ 底部被 tabbar 盖住（坑 #26），已修、已推线上、已验


---

## 踩过的坑（避免重犯）

### 1. 元素溢出装饰 · 成本过高
提过在 5 个板块卡片上做蝴蝶/皇冠/天使的 PNG 溢出装饰。**被否**：
> "元素溢出成本太高了，小文件夹都比那个强，我想要苹果毛玻璃感的"

**结论：** 用纯 Liquid Glass + 顶部 tab 类别，不加多余装饰。

### 2. 符号图标（✦ ◆ ♡ ☾ ☆）不能救丑
在毛玻璃文件夹卡片上加了 unicode 符号图标当分类标识。**被否**：
> "符号也太丑了！！还不如顶部有标签类别呢？"

**结论：** 顶部横向 tab 只用文字，不加图标。

### 3. Vision Board 底部重复 = 没看懂
在 Ritual 卡下方再放一个大 Vision Board 卡（3×2 板块封面）。**被否**：
> "我没看懂你下面放的愿景板整那么大的图想干嘛？？？？？？？？？？"

**结论：** 每个 tab 只有一个愿景板，跟着 tab 切内容。

### 4. 番茄钟 ≠ 全屏播放器
最初把"开始念诵"设计成全屏 modal + 大字肯定语 + 自动切换。**被否**：
> "Q4番茄钟只是计时啊大哥。。。"

**结论：** 番茄钟只是计时功能，不切图不切句，用户念自己的。

### 5. 番茄钟不能全屏跳转
后来又把钟表设计成需要跳转的模式。**被否**：
> "点击番茄钟开始以后 用户是可以看到愿景板的图片还有肯定语的，番茄钟直接画成钟表的形式呗 直接就可以在这个页面计时 不需要跳转新页面"

**结论：** 钟表内嵌在 Ritual 卡里，愿景板和清单保持可见。

### 6. 底 tabbar 太高
第一版 padding 10 + icon 22。**被否**：太高、太宽。

**结论：** padding 6px，icon 21px，width 396px。

### 7. 首页凸起球颜色
凸起球用了 rose-deep 深色 + 白圈边。**被否**：
> "首页的球跟勾选今日待办时候那个圈的颜色一样就行"

**结论：** 用 `--rose` (#D4A5B0)，无白圈边，只有内高光。

### 8. 静态截图无法交互检查
用户看渲染 PNG 无法点击验证。**结论：** 每次做完都拷贝 HTML 到 `~/Desktop/`，让用户在浏览器打开真实交互。

### 9. 页面标题多余
Affirmation 页顶部加了 "Manifest 肯定语" 页标题。**被否**：直接删。

**结论：** 页面不放冗余顶部标题，顶部就是 tab。

### 10. "无限"时长不对
时长选项做了 无限 / 5 / 15 / 25 / 45。**被否**：
> "无限改成手动计时"

**结论：** 后来钟表变成正计时为默认，手动这个词也不用出现在胶囊上了—— 5m/15m/25m/45m 就够，不选就是正计时。

### 11. 新建板块弹 "稍后开放" toast
第一版 "+ 新建" 按钮点了只是弹 toast。**被否**：
> "新建板块为什么是这样 ，不应该是直接添加文字吗"

**结论：** "+ 新建" 直接弹对话框输入板块名 → 立刻创建 tab，空清单 + 6 张空占位图供上传。

### 12. 剧本 ≠ 订单玩法
参考小红书「宇宙订单」那篇时，把整套 下单 / 物流 / 签收 的玩法搬了过来。**被否**：
> "并不是让你做成订单"

**结论：** 那篇只借**排版骨架**（分类胶囊 → 区标带件数 → 双列封面卡），玩法是自己的。

### 13. 感恩页写入口重复
今日卡上有加号球，右下角又放了个 FAB。**自查删掉**：一个页面一个写入口。

### 14. 横滑不能有两个含义
首页/剧本页想让横滑既换剧本、又翻 7 天窗口 —— 同一个手势同一个位置，必冲突。

**结论：** 横滑只表示**换剧本**；7 个天点**自动跟着今天走**（`wi = Math.floor((n-1)/7)`），不用手滑。

### 15. 「改成我的（复制一份）」是我自己想多了
我担心用户改坏预设剧本，加了个复制按钮。**被否**：
> "改成我的是啥？？为什么要加这个按钮？"

**结论：** 这是给自己一个人用的 app，预设本来就是给她改的。按钮删掉，`preset` 保护逻辑一起删。

### 15b. 「不演了」看着像禁用
`.d-op.warn` 用了 `background:.5` 白 + `color:var(--t3)` 浅字，跟旁边 disabled 态长得一样，用户以为点不了。

**结论：** warn 跟 ghost 用同一个底和字色（`.66` 白 + `--t2`），只靠珠光描边区分。**这个 app 里没有任何按钮该长得像灰掉的。**

### 15c. 「推荐理由」不对
这是用户自己的剧本，不是谁推荐给她的。**改成「简介」**（新建抽屉里的 `Why` 标签也一起改成 `Intro`）。

### 15d. 不用把逻辑写在界面上
天数步进器下面写了行小字「开启前随便改」。**被否**：
> "反正就是逻辑是这个逻辑就行 不用写出来"

改成只在正在演的时候显示「已经演过的删不掉」。**又被否**：
> "说了天数下不要加文字"

**结论：** 天数下面**一个字都不放**。约束不靠文案讲，靠行为讲 —— 减到底了点减号弹 toast 告诉你为什么。

### 15e. 系统 confirm 是真的点不了
「不演了」我确认过代码是好的、hit-test 也命中按钮，但用户点了没反应 —— 因为它走的是原生 `confirm()`。`file://` 下只要在任何一个弹窗上勾过一次"阻止此页面再显示对话框"，之后所有 `confirm()` **直接返回 false**，函数当场 return，看着就像按钮坏了。

**结论：** 全站不用 `confirm` / `alert`。自己画玻璃确认框（`.cfm`，算了 / 确定），四处调用点（不演了、删幕、减天数、彻底删除）全换成 `ask(text, onYes)` 回调式。

### 15f. 卡片副标题多余
「自己写一部」下面还有两行「天数自己定 / 幕可以先空着」，新建分类抽屉标题下面还有「比如「桃花」「考试」「搬家」」。**都删了** —— 同 15d，界面不解释自己。

### 15g. 分类名不限字数
原来 `maxlength="4"` + 占位符写「最多 4 个字」。**被否**：不限制。`maxlength` 去掉，占位符只留「分类名」。

### 19. 拖动的元素身上不能留 transition
`.chip` 上有 `transition:all .2s`（切换选中态用的）。长按拖动时 `transform` 也吃这条过渡，胶囊跟手慢半拍、还会回弹 —— 实测 45 次 mousemove 只换成 2 次位置。

**结论：** `.chip.drag{transition:none}`，让位的那些才 `transition:transform`。换位判定也从"中心压进隔壁矩形"改成"中心越过隔壁中心"，配合 `compareDocumentPosition` 判方向 —— 前者在胶囊宽度不一样时会漏判。

### 16. 归档不是回收站
用户问「类似电脑回收站统一放一个文件夹？」。**没照做**：手写的幕不该进垃圾桶。

**结论：** 做成**书架** —— 分类胶囊最后一格「演过的 n」，封面去饱和 + 已完成/已停止标签，给「再演一轮」和「彻底删除」，删只能用户手点。

### 17. Cormorant 的 "1" 长得像小写 i
Cormorant Garamond 默认走**老式数字**（old-style figures），`DAY 1`、`第 1 幕` 里的 1 会缩到 x-height 以下，看着像 I。静态检查查不出来，只有看截图才发现。

**结论：** 所有出数字的选择器都加
```css
font-variant-numeric:lining-nums;
font-feature-settings:"lnum" 1,"onum" 0;
```

### 18. 一句话说清"多开几个 agent"
被理解成了"把整个 roadmap 并行铺开"，起了三个后台 agent 写不相关的页面。**被否**：
> "啥意思啊 我现在不就是让你跑感恩页面吗"

**结论：** 只做当前那一页。

### 20. 「我的」页没对齐就做完了
me.html 是上一条那次误解留下的孤儿文件，后来我又直接往下改。**被否**：
> "我的这个板块你咋做完了。。我还没跟你对呢"

**结论：** 规则 3 不是只管"大改动"。没聊过的页面，一行代码都别写，先文字过结构。这次是纯文字聊了五轮，聊到用户说「你开始改吧」才动手。

### 21. 系统 confirm 在别的页面还剩两处
15e 修的时候只改了当时手上那个文件。后来全量扫 `(?<![.\w])(confirm|alert)\(`，发现 affirm.html 和 gratitude.html 各还剩一个 —— 也就是说规则 10 在两个页面上一直是破的。

**结论：** 定了全局规则之后，扫**所有**页面，不是只扫正在编辑的那个。每轮改完跑一遍：语法 / id 是否都存在 / `confirm|alert` / emoji 码段 / `maxlength` / 占位符残留。

### 22. lining-nums 的选择器不能靠猜
17 那条的修法是对的，但我第一版写的 `.stat-row` `.dur-pill` `.cal-cell` `.ph-more` `.flow-date` **有几个根本不存在**。CSS 选到不存在的类是**静默失效**的，静态检查也查不出来。

**结论：** 加样式前先 grep 真实类名（`class="…"` 和 `className = '…'` 两种都要搜）。

### 23. 无头 Chrome 的 `--screenshot` 不等于"页面跑完了"
想验 SW 有没有注册，`--virtual-time-budget` 配 `--screenshot` 截出来永远停在同步那一行，异步的 fetch / register 结果都没进 DOM。

**结论：** 要看异步结果就走 CDP：起 Chrome 带 `--remote-debugging-port` **和 `--remote-allow-origins=*`**（不加会 403 拒 WebSocket），navigate 之后 sleep，再 `Runtime.evaluate` 带 `awaitPromise:true` 直接问页面状态。这样能拿到 `controller.scriptURL`、`reg.active.state`、`caches.keys()` 这些真东西。

### 24. tabbar 有两个页面一个 onclick 都没绑
affirm.html 和 gratitude.html 的底部 tabbar，**五格里非当前页的四格全是纯装饰** —— 长得一模一样，点了没任何反应。上线之后才发现。

发现方式是 `grep -c "location.href='"` 扫五个页面：home 7 / affirm **0** / gratitude **0** / script 4 / me 4。0 和 4 一对比立刻就露了。

**结论：** 同 #21，这又是一条全局规则在部分页面上一直是破的。**跳转这种「看不出坏」的东西必须用计数去扫，不能靠肉眼看代码** —— tabbar 五格的 HTML 结构完全对称，缺 onclick 读代码时根本注意不到。

### 25. `i % used.length` 循环取板块 = 同一张图铺三遍
沉浸念的愿景板本来是「取当前清单涉及板块的图」，实现写成了 `used[i % used.length]` 循环板块、且永远取 `b.images[0]`。清单只涉及 2 个板块时，6 个格子就是 `used[0],used[1],used[0],used[1],used[0],used[1]`，**同一张图铺在 i=0,2,4**，看着像 bug 又像故意的。

**结论：** 先把涉及板块的**所有**图收进一个数组并去重（`if(img && !pics.includes(img)) pics.push(img)`），再顺序铺格子，`pics` 不够 6 个的用**不重样的渐变**补位。取图逻辑里出现 `%` 取模就要警惕：格子数和素材数不是一回事，取模只会让素材重复而不是让格子留空。

### 26. `min-height:100vh` + fixed 底栏 = 底部内容永久不可达
`html,body{height:100%}` 配 `body{min-height:100vh}`，等于把 body 高度锁死成一屏。这时 `padding-bottom` **撑不开滚动范围** —— 实测 `scrollHeight - innerHeight === 0`，页面根本滚不动，最后一张卡被 fixed tabbar 盖住，怎么都划不出来。视觉上页面「有」那么高，但滚动区域是 0，特别欺骗人。

**结论：**
```css
html{height:100%}          /* body 不跟着锁 */
body{min-height:100%;      /* 不是 100vh */
     padding-bottom:calc(118px + env(safe-area-inset-bottom));}
```
留白要**按首页那个上凸 22px 的球**算（实测整条 tabbar 占位 87px），不能只按 tabbar 自己的 62px 算。`100vh` 在移动端本来就还有地址栏伸缩的问题，这套布局里没有任何地方该用它。

### 27. 沙箱挡 git 到 github.com，但报错信号极具误导性
`git push` 报 `Error in the HTTP2 framing layer`，降到 HTTP/1.1（`http.version=HTTP/1.1`）换成 `Empty reply from server`，可 `curl https://api.github.com` **照样 200**。看着像 GitHub 侧的协议问题或者代理抽风，实际是沙箱只放行了一部分出网。

用同一条 `git ls-remote` 带和不带 `dangerouslyDisableSandbox: true` 对比跑过：不带必失败，带上立刻通。

**结论：** 所有会连 github.com 的 git 操作（`ls-remote` / `push` / `fetch`）都要带 `dangerouslyDisableSandbox: true`。**不要拿 curl 的成功去推断 git 也能通** —— 走的不是一套路径。以后见到「传输层报错但 curl 正常」，第一反应就是沙箱，别去调 HTTP 版本。

### 28. 全局规则定了就得 grep 全部五个页面
#21（confirm）、#24（tabbar onclick）本质是同一个错：只改手上那个文件。这轮又扫出 **5 处残留的 `maxlength`** —— 规则 11「不给输入设长度上限」早就定了，但只在当时编辑的页面执行了。

**结论：** 每轮收尾固定跑一遍全量 grep，五个页面一个不落：语法 / id 是否都存在 / `confirm|alert` / emoji 码段 / `maxlength` / 占位符残留 / `location.href` 计数 / `<title>`。**用计数对比而不是逐个看** —— 五个文件结构对称，哪个少了一行靠读是读不出来的。


---

## 用户核心规则（永远遵守）

1. **零 emoji** —— UI 里绝对不出现
2. **零 unicode 符号图标**（✦ ◆ ♡ ☾ ☆）
3. **慢一点** —— 未确认的方案不要动手写代码，先文字讨论
4. **不浪费 token** —— 不做用户没要求的东西
5. **不要专业术语堆砌** —— 用大白话沟通
6. **静态图 + 真实交互** —— 需要用户点击验证的都要拷桌面
7. **不要 AI 图生成做进产品** —— 用户成本考虑
8. **不要把逻辑写成界面文案** —— 逻辑对就行，别在 UI 上解释自己
9. **能点的按钮不许长得像灰掉的** —— 浅字 + 浅底会被当成 disabled
10. **不用系统 confirm / alert** —— 丑，而且 file:// 下被屏蔽过一次就永远返回 false
11. **不给用户输入设长度上限** —— 除非有真的技术理由

---

## 文件结构

```
tryon/                          ← git 仓库就在这一层（父目录 542M 且含 .env / ai.py，绝不在父目录 git init）
├── index.html                  Pages 根路径跳转兜底 → ./home.html
├── home.html                   Phase 2 首页 · v4（今日剧场已改横滑）
├── affirm.html                 Phase 3 肯定语 · v2（钟表 + 新建板块 + 图片上传）
├── gratitude.html              Phase 4 感恩日记 · 已完成
├── script.html                 Phase 5 剧本 · 已完成
├── me.html                     Phase 6 我的 · 已完成（结构跟用户对过）
├── manifest.webmanifest        PWA 清单
├── sw.js                       service worker（HTML 网络优先 / 静态资源缓存优先）
├── icons/                      icon-192 / icon-512 / apple-touch-icon(180)
├── covers/                     8 张剧本封面（等用户截图 · 竖版 3:4）
├── .gitignore                  屏蔽 *.png / 两个 mockup / DESIGN.md
├── affirm_mockup.html          交互草图 v1（抽屉方案 · 不上线）
├── affirm_clock_mockup.html    交互草图 v2（钟表 4 状态 · 不上线）
├── *.png                       静态渲染截图（不上线）
└── DESIGN.md                   本文档（gitignore · 只在本地）
```

五个页面都是**独立单文件**，各自带全套 CSS/JS，靠 `location.href` 互相跳。tabbar 五格全接通（affirm / gratitude 上线后才补上，见坑 #24）。
线上从 `/manifest/` 子路径提供，所以**所有资源引用都是相对路径**（`./sw.js`、`./manifest.webmanifest`、`./home.html`）。

---

## 数据结构（localStorage 持久化 · 2026-08-31 落地）

```js
BOARDS = {
  [key]: {
    name: '财富金钱',
    color: 'g1',              // 兜底渐变
    lines: ['句子1','句子2',...],              // 该板块所有肯定语
    images: [dataURL|null, ...6]              // 6 格愿景板图
  }
}
// 注意：BOARDS 里以前有个写死的 stats:{total:'2h 15m'} —— 已删。
// 累计时长不在这里，在跨页面的 reverie.stats.v1 里，且是真实念出来的。

reciteList = [
  { txt: '肯定语', tag: '财富', from: 'wealth' },  // 沉浸念当前清单
  ...
]

// 钟表状态
clockState = 'idle' | 'up' | 'down' | 'paused'
clockMode  = 'up' | 'down'

// 剧本（script.html）
SCRIPTS = [{
  id:'s1', name:'粘人小狗', cat:'爱情',
  grad:'cv1', cover:'covers/love-dog.jpg', coverData:null,  // coverData = 用户上传的 DataURL
  line:'He comes to me.',        // 封面上那句英文衬线
  why:'简介一句话',              // 界面上叫「简介」
  days:7,
  acts:{ 1:['第一幕文字','第二幕文字'], 2:[...] },  // 天 → 幕数组，每天幕数可以不一样
  state:'lib',        // lib 未开启 | playing 正在演 | done 演完了 | stopped 不演了
  startDate:null      // '2026-08-30'，天数靠它和今天相减算
}]

// 我的（me.html）
ME  = { name:'若愿', avatar:null }  // avatar = DataURL，存前过 shrinkImage(…,512,.85)
ACC = { mail:null }                 // 本地假登录，接 Supabase 前先把位子占对
// 近七日柱状图和板块累计不再有写死的数组（WEEK / BOARD_STATS 已删），
// 每次 render 从 reverie.stats.v1 现算，没念过就是空态。
```

### localStorage 键位表

| 键 | 谁写 | 谁读 | 存什么 |
|---|---|---|---|
| `reverie.home.v1` | home | home | `{todos:[{txt,done}], aff:{txt,sub}}` |
| `reverie.affirm.v1` | affirm | affirm | `{boards, reciteList, currentTab}` |
| `reverie.gratitude.v1` | gratitude | gratitude | `{entries, customTags}` |
| `reverie.script.v1` | script | script + **home 只读** | `{scripts, cats, uid}` |
| `reverie.me.v1` | me | me | `{me, acc}` |
| `reverie.stats.v1` | **affirm 只写** | **me 只读** | `{byBoard:{key:{name,mins}}, byDay:{'YYYY-MM-DD':mins}}` |

沉浸念（跨板块混念）记在 `byBoard.__immerse__`，`name` 固定 `沉浸念`。

**公共约定（五个页面都一样，抄的时候整段抄）：**
- `lsSave()` / `lsLoad()` / `dumpState()` / `applyState(d)` 四件套。`lsSave` catch 到 quota 就弹一次 toast 并冷却 3 秒，不许连弹。
- `lsLoad()` 必须在**第一次 render 之前**；`JSON.parse` 和 `applyState` 都包 try/catch，坏存档当没存过，页面不许白屏。
- `const` 集合不能重新赋值 → `applyState` 里清空再灌（`arr.length=0` / `Object.keys(o).forEach(k=>delete o[k])`）。
- 图片一律 `shrinkImage(dataURL, cb, maxPx=1080, q=.82)` 之后再存。iOS 上限 ~5MB，不压必炸。
- `uid` 要跟着存，否则重开后新建 id 撞车。
- 跨页派生的视图挂 `pageshow(persisted)` + `visibilitychange` 重绘 —— iOS PWA 回到页面不重跑 JS。

**遗留：** 只在这台手机的这个浏览器里。清缓存 / 换手机 / iOS 清理长期不用 PWA 的存储都会丢。me 页导出会把所有 `reverie.` 键原样打包成 `reverie-backup-YYYY-MM-DD.json`，搬家先导出。

---

## 下一步

1. ~~**持久化（localStorage）**~~ —— ✅ 2026-08-31 已完成，见上面的键位表
2. **真机验 PWA** —— iPhone Safari 打开 https://wangxt22.github.io/manifest/ → 添加到主屏幕 → 看全屏和离线
3. **等 8 张封面截图**放进 `tryon/covers/`
4. **接后端**（Supabase / Cloudflare D1+R2）—— 只有这一步能让数据跨手机活下来。开 RLS 是硬性前提，`service_role` key 永远不上前端
5. 用户去查微信小程序玄学类目能不能过审

