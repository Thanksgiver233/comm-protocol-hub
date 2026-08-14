# comm-protocol-hub

**3GPP 通信协议知识库插件** — DeepSeek Harness (DSH) 生态中的专业通信协议查询工具，覆盖地面网络(TN)、非地面网络(NTN)、全息通信、近场/远场通信、混合通信及安全通信等全维度 3GPP 标准。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![3GPP](https://img.shields.io/badge/3GPP-Rel--15~18-blue.svg)](https://www.3gpp.org/)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-orange.svg)](https://github.com/NanmiCoder/dsh-agent-teams)

---

## 项目简介

将分散在 3GPP Release 15~18 的 70+ 条通信协议规范，按 TN/NTN/全息/近远场/混合/安全等 8 个维度结构化整理，为通信工程师和 AI 助手提供一键式协议查询能力。通过三个 DSH 工具（关键词搜索、分类浏览、单条详情），取代人工翻阅数百页 PDF 的繁琐过程，让大模型在通信领域回答更准确、有据可查。本项目填补了通信工程专业知识在 AI 助手中的空白，是首个面向通信领域的 DSH 协议知识库插件。

---

## 解决了什么问题

| 痛点 | 解决方案 |
|------|----------|
| 3GPP 协议分散在数十个 TS 文档中，跨版本查找耗时 | 内置 70+ 条结构化协议索引，一键检索 |
| 非地面网络(NTN)、全息通信等前沿领域资料零散 | 专设 NTN / 全息 / 近远场 / 混合通信独立分类 |
| 大模型在通信协议问题上容易"幻觉" | 基于官方规范整理的知识库，提供可追溯的 3GPP 链接 |
| 协议版本演进快，信息滞后 | 数据覆盖 Rel-15 至 Rel-18，易于持续更新 |

---

## 快速上手

### 安装

```bash
# 从本地路径安装（推荐开发阶段）
npx -p @deepseek-ai/dsh dsh plugin --profile web add <path-to-comm-protocol-hub>

# 从 GitHub 安装（正式发布）
npx -p @deepseek-ai/dsh dsh plugin --profile web add github:<owner>/comm-protocol-hub
```

安装后重启 DSH profile。

### 三个核心工具

| 工具名 | 用途 | 示例 |
|--------|------|------|
| `comm_protocol_query` | 关键词/编号搜索 | "搜索 NTN 协议" → 返回 10 条卫星通信规范 |
| `comm_protocol_browse` | 分类浏览 | "查看全息通信所有协议" → 按类展开 |
| `comm_protocol_detail` | 单条详情 | "查 3gpp-ts38.300" → 完整技术参数 |

### 典型对话场景

```
用户：帮我查一下 TS 38.300 讲了什么
AI：[调用 comm_protocol_detail] → 返回 NR 物理层概述、numerology、frame structure 等
```

```
用户：NTN 有哪些相关协议？
AI：[调用 comm_protocol_query, category=NTN] → 列出 10 条卫星通信规范，含 Direct-to-Cell、HARQ 适配等
```

---

## 功能一览

| 分类 | 说明 | 协议数 | 覆盖关键标准 |
|------|------|--------|--------------|
| 📡 地面网络 (TN) | 5G SA/NSA 核心网、NR 物理层、RRC/NAS 协议 | 20 | TS 23.501, TS 38.300, TS 38.331... |
| 🛰️ 非地面网络 (NTN) | 卫星通信架构、LEO/MEO/GEO 适配 | 10 | TS 37.820, TS 38.821, TS 22.175... |
| 🔮 全息通信 | 3D 全息建模、XR 视频传输 | 6 | TS 38.342, TS 26.345, TS 26.246... |
| 📶 近场通信 | NFC、UWB、ProSe 设备直连 | 6 | TS 36.521, TS 31.111, TS 23.082... |
| 📻 远场通信 | Massive MIMO、广域覆盖增强 | 6 | TS 38.104, TS 38.215, TS 38.508... |
| 🔀 近远场混合 | 双连接(MR-DC/EN-DC) | 6 | TS 37.215, TS 38.300-MRDC... |
| 🛡️ 安全通信 | MCPTT/MCX、公共安全 | 8 | TS 22.268, TS 23.278, TS 33.501... |
| 📋 通用协议 | 网络架构、编号寻址、GTP | 8 | TS 23.002, TS 23.003, TS 38.823... |
| **合计** | | **70+** | |

---

## 项目亮点

1. **首个面向通信领域的 DSH 协议知识库插件** — 填补通信工程专业知识的 AI 查询空白
2. **8 维分类体系** — 从传统 TN 到前沿的 NTN/全息/ISAC 全覆盖，贴合 3GPP Rel-15~18 演进路线
3. **3 个精准工具** — 搜索、浏览、详情三模式，适配不同使用场景
4. **即装即用** — 协议数据内嵌，无需联网即可查询；每条记录附官方 3GPP 链接便于溯源
5. **可扩展架构** — 新增协议只需在 src/data/ 添加 JSON 条目，无需修改代码

---

## 技术架构

```
Host: CommProtocolService → 3 个 DSH 工具（query / browse / detail）
Client: ProtocolPanel（交互式面板）+ ProtocolNode（对话内联卡片）
Data: 8 个 JSON 文件，70 条结构化协议记录
```

---

## 开发指南

```bash
cd comm-protocol-hub
pnpm install
pnpm typecheck
pnpm build
```

添加新协议：编辑 src/data/<category>_protocols.json，可用分类：
TN / NTN / HOLOGRAPHIC / NEAR_FIELD / FAR_FIELD / HYBRID / SAFETY / MISC

---

## 协议数据来源

基于 [3GPP 官方规范](https://www.3gpp.org/)整理，覆盖 Release 15 至 Release 18。
实际文档请通过 [3GPP Portal](https://portal.3gpp.org/) 获取。

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

---

## 许可

本项目采用 [MIT License](./LICENSE)。