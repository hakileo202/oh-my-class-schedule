# <div align="center"><img src="./docs/logo.svg" height="50" align="top">  </div>
<div align="center">
  ✨🌈💫 **跨 平 台 大 学 课 表** 💫🌈✨<br>
  <sub>🔮 Windows · 🍎 macOS · 🐧 Linux · 🤖 Android 🔮</sub>
  <br>
    <a href="https://github.com/2bitbit/oh-my-class-schedule/stargazers">
    <img src="https://img.shields.io/github/stars/2bitbit/oh-my-class-schedule?style=flat-square&color=fbbf24" alt="Stars" />
  </a>
  <a href="https://github.com/2bitbit/oh-my-class-schedule/issues">
    <img src="https://img.shields.io/github/issues/2bitbit/oh-my-class-schedule?style=flat-square&color=ef4444" alt="Issues" />
  </a>
  <img src="https://img.shields.io/badge/Built%20with-Tauri%20v2-blue?style=flat-square&logo=tauri" alt="Tauri" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</div>

## 🤓 送给广大学牲 -- 这是什么
这是一个追求 **极致用户体验** 与 **无感智能适配** 的简洁的跨平台课程表应用。你每天都要查看无数次的工具，值得被我们精心雕琢。

***2026***，<img src="./docs/logo.svg" height="30" align="top"> 震撼来袭！！！：
- 厌倦了校方课表（如HNU微生活）突然把你自定义的课程显示的优先级放在内置课程之后？专为翘课生定制！

- 厌倦了校方课表（如HNU微生活）没法删掉水灵灵的课眼不见心不烦？专为简洁党定制！

- 厌倦了校方课表（如HNU微生活）打开慢吞吞，每次登录还得手动清空缓存才显示课表？专为速通哥定制！

<img src="./public/Android_demo_1.png" width=20%>
<img src="./public/Android_demo_2.png" width=20%>
<img src="./public/Android_demo_3.png" width=20%><br>
<img src="./public/Desktop_demo_1.png" width=30%>
<img src="./public/Desktop_demo_2.png" width=30%>

## ✨ 眼前一亮的细节

### 1. 🧠 懂你的智能网格
- **今日高亮**: 只有在当前查看的周次确实是“今天”所在的周时，当天的列才会亮起。
- **周末自动折叠**: 系统会智能分析当前周的课程。如果您的周六和周日都没有课，它们会自动隐身，将屏幕空间毫无保留地留给工作日。
- **极简表头**: 摒弃了冗余的“星期几”，我们采用了极简的“一、二、...、日”单字表头，清爽干练。

### 2. 🎨 惊艳的视觉呈现
- **多种风格**: 除了默认的玻璃拟态，我们还提供了多种预设主题，满足你的个性化需求和视觉舒适。
- **全屏沉浸**: 无论是在 Windows 桌面还是 Android 手机，应用都会强制占满 `100vh` 高度。每一寸屏幕都被完美利用。

### 3. ⚡ 纯粹的技术架构
- **Rust 后端**: 不再包含任何复杂的业务逻辑，回归最纯粹的高性能文本解析器。稳如磐石，极速响应。占用与耗电极致地小。
- **Web 前端**: Vue 3 + TypeScript + WebView，带来丝滑又高级的交互体验。
- **自动化**: 无论是发布版本还是更新网页工具，我们都构建了全自动化的工作流。

## 如何使用
### 第 1 步：安装
- Windows、Linux、Android、macOS请点击 [这里](https://github.com/2bitbit/oh-my-class-schedule/releases/latest) 下载后安装。（macOS的安装方法请自行必应搜索或者问大模型）
- 不支持 IOS；
  
### 第 2 步：导入
直接按照 [参考格式](docs/参考格式.txt) 写好文件，在软件中点击设置⚙️，选中文件进行导入，即可使用。

对于部分学校，我们提供了 [格式化工具](https://2bitbit.github.io/oh-my-class-schedule/) ：直接在教务系统导出课表，使用该工具即可复制出满足参考格式的文件，直接创建文件，粘贴后使用即可。
（ps: 你也可以对课表本身进行编辑后，再上传至工具，只是记得你编辑的内容要保持和原始课表的格式一致）


## 🤝 如何贡献 (Contributing)
我们非常欢迎您为自己的母校添加适配支持！得益于我们的“文件即插件”适配器架构，这变得异常简单，只需根据模板编写一个文件即可：

1.  **复制模板**: 在 `docs/adapters/` 目录下，找到 `template.js`，将其复制并重命名为 `你的学校.js` (例如 `清华大学.js`)。
2.  **实现逻辑**: 打开新文件，参考 `template.js` 或 `湖南大学.js`，实现 `convert` 方法。你只需要将文件解析为我们定义的文本格式即可。
3.  **自动注册**: 运行自动化脚本更新列表：
    ```bash
    python scripts/update_web_tools.py
    ```
4.  **提交 PR**: 没错，只需编写这一个文件，你的学校就会出现在我们的支持列表中，造福你的所有同学！（你可以自定义你们学校的适配器名字哦，比如：清华大学（谢复盘编写）、五道口技校、不如隔壁的中南，先到先得！）（从此享受崇敬的目光，也许还能迎来一段迷人的恋情！）

---

## 赞赏
<img src="public/求求了给点叭.png" width=46%><img src="public/求求了求求了.png" width=44%>
<!-- 我才不愿意让你看到我这副低声下气的样子呢，哼唧唧。 -->
<!-- 怎么也飞不出，花花的世界，原来我是一只，🦋大的学牲 -->

中国课表，香飘世界！为我的项目点点 star 🌟，让世界看见中国造！
<!-- 不要怼我什么逻辑诡辩了，有什么关系，求求了给点叭，点点星星叭，求求了求求了 -->

<div align="center">
  希望 <img src="./docs/logo.svg" height="20" align="top"> 能成为您大学生活中洋洋得意的小确幸。
</div>

