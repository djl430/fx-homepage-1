# AI智批页面发布与返回首页设计

## 目标

解决首页“AI智批”入口在线访问 404，并让 AI智批页面左上角“← 首页”可点击返回飞象作业首页。

## 根因

- `fx-homepage-1` 中的 `fx-ai/` 是独立 Git 仓库，不会作为父仓库内容发布。
- 首页已上线相对链接 `fx-ai/homework-exam-unified-demo.html`，但该文件不在 `fx-homepage-1` 的远端提交树中，因此 GitHub Pages 返回 404。
- AI智批独立 HTML 尚未被 `fx-ai` 仓库跟踪，并包含 3 个只在本机有效的 `file:///Users/...` 跳转。
- AI智批首页面包屑当前为静态图标与文字，没有返回主页的交互。

## 发布架构

- AI智批及其相关演示页面由独立仓库 `djl430/fx-ai` 的 GitHub Pages 承载。
- 飞象作业首页继续由 `djl430/fx-homepage-1` 的 GitHub Pages 承载。
- 首页“AI智批”卡片使用绝对地址跳转到 `https://djl430.github.io/fx-ai/homework-exam-unified-demo.html`，避免跨仓库相对路径错误。
- AI智批页面左上角“← 首页”使用语义化链接，固定指向 `https://djl430.github.io/fx-homepage-1/`。

## AI智批页面修复

- 将 `homework-exam-unified-demo.html` 纳入 `fx-ai` 版本控制与 Pages 发布内容。
- 将作业批改入口改为相对地址 `grading-by-question-demo.html?mode=homework&taskId=cluster-homework`。
- 将考试批改入口改为相对地址 `grading-by-question-demo.html?mode=exam&taskId=quiz`。
- 将采集记录入口改为相对地址 `collection-history.html?from=unified`。
- 将左上角箭头和“首页”组合成一个可点击、可键盘聚焦的链接，并保持现有颜色、间距和布局。
- 不修改业务数据、卡片内容或其他交互。

## 发布顺序

1. 在 `fx-ai` 中提交目标 HTML、返回首页交互和部署回归测试。
2. 将 `fx-ai/main` 推送到远端；用户已确认允许同时推送当前领先远端的 3 个既有提交。
3. 等待并验证 `https://djl430.github.io/fx-ai/homework-exam-unified-demo.html` 返回 HTTP 200。
4. 在 `fx-homepage-1` 中将“AI智批”卡片地址切换为上述线上绝对地址，并更新回归测试。
5. 推送 `fx-homepage-1/main`，等待 Pages 更新后验证从首页进入 AI智批及返回首页的完整路径。

## 验收标准

1. 线上首页点击“AI智批”不再出现 404。
2. AI智批线上页面正常加载。
3. 点击 AI智批左上角“← 首页”返回 `https://djl430.github.io/fx-homepage-1/`。
4. AI智批页面中不再包含 `file:///Users/` 地址。
5. 作业批改、考试批改和采集记录入口均使用同仓库相对地址。
6. 两个仓库的相关测试通过，部署文件与页面差异检查无错误。

## 验证

- 使用 Node 文本回归测试检查 AI智批页面的主页链接、相对业务链接及本机路径清除情况。
- 使用首页回归测试检查“AI智批”卡片的绝对线上地址与当前页跳转方式。
- 使用 HTTP HEAD 请求轮询两个 GitHub Pages 地址，确认最终响应为 200。
- 在浏览器中验证“首页 → AI智批 → 首页”往返路径。
