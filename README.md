# Markdown to HTML Converter

这是一个简单的 Node.js 命令行脚本，用于将 Markdown 文件或包含 Markdown 文件的整个目录转换为独立的 HTML 文件。它使用 [Showdown](https://github.com/showdownjs/showdown) 进行 Markdown 解析，并集成 [Highlight.js](https://highlightjs.org/) 实现代码块的语法高亮。

该脚本旨在提供一种灵活的方式来生成样式化的 HTML 文档，适用于项目文档、笔记、报告等的快速发布。

## ✨ 功能特性

* 支持转换单个 Markdown 文件 (`.md`)。
* 支持递归处理指定目录下的所有 Markdown 文件。
* 使用 Showdown，支持 GitHub Flavored Markdown (GFM)，包括表格、任务列表、删除线等。
* 使用 Highlight.js 对代码块进行自动语言检测和语法高亮。
* 灵活的输出选项：
    * 可以指定一个输出目录来存放所有生成的 HTML 文件。
    * **如果未指定输出目录，HTML 文件将默认生成在与源 Markdown 文件相同的目录中。**
* 可自定义生成的 HTML 页面的 `<title>` 标签内容。
* 可选集成 [Plausible Analytics](https://plausible.io/) 统计脚本。
* 支持应用自定义的基础 CSS 样式文件。
* 支持选择不同的 Highlight.js 主题样式文件。
* 通过命令行界面 (CLI) 提供易于使用的参数选项。
* 提供 `md_html.cmd` 包装器，方便在 Windows 下直接调用。

## ⚙️ 先决条件

* [Node.js](https://nodejs.org/) (建议使用 LTS 版本或更高版本)
* npm (通常随 Node.js 一起安装)

## 🚀 安装

1.  **获取脚本:** 克隆此仓库或直接下载 `convert.js` (核心脚本), `md_html.cmd` (Windows 包装器) 以及默认的 `style.css` 文件。
    ```bash
    # 如果你使用的是 Git
    # git clone https://github.com/nie11kun/md-to-html-github-style.git
    # cd md-to-html-github-style

    # 或者直接下载 convert.js, md_html.cmd 和 style.css 到你的项目目录
    ```
2.  **安装依赖:** 在包含 `convert.js` 的目录下打开终端，运行以下命令来安装所需的 npm 包：
    ```bash
    npm install showdown highlight.js yargs
    ```
    这将下载并安装 `showdown`, `highlight.js`, 和 `yargs` 到 `node_modules` 目录。

## 💡 使用方法

有两种主要方式运行此脚本：

**1. 通过 `node` 命令 (适用于所有系统):**

这是最基本的方式，直接调用 Node.js 来执行脚本。

```bash
node convert.js -i <输入文件或目录> [-o <输出目录>] [其他选项...]
```

**示例:**

* 转换单个文件 (输出到同目录):
    ```bash
    node convert.js -i README.md
    ```
* 转换整个目录 (指定输出目录):
    ```bash
    node convert.js -i ./project_docs -o ./generated_html
    ```
* 使用自定义样式和高亮主题:
    ```bash
    node convert.js -i report.md -s ./assets/custom-style.css -hs ./node_modules/highlight.js/styles/github-dark.css
    ```
    *(更多示例请参考下方其他示例部分)*

**2. 直接调用 (需要设置 PATH, 推荐):**

通过一些额外设置，你可以像运行系统命令一样直接调用 `md_html`，无需输入 `node convert.js`。这对于频繁使用特别方便。

* **Windows:** 使用提供的 `md_html.cmd` 包装器。
* **Linux/macOS:** 需要给 `convert.js` 添加执行权限并建议重命名（例如为 `md_html`）。

**前提:** 你需要将包含脚本文件（`convert.js` 和 `md_html.cmd`）的目录添加到系统的 PATH 环境变量中。（具体方法请参见下面的 **"设置为全局命令"** 部分）。

**设置好 PATH 后的调用示例:**

* **Windows:**
    ```cmd
    md_html -i README.md
    md_html -i ./project_docs -o ./generated_html
    ```
* **Linux/macOS (假设已重命名并设置权限):**
    ```bash
    md_html -i README.md
    md_html -i ./project_docs -o ./generated_html
    ```

---

**其他调用示例 (适用于两种方式):**

* **转换单个文件 (指定输出目录和标题):**
    ```bash
    # node convert.js -i ./docs/guide.md -o ./public/html -t "用户指南"
    # 或 (设置 PATH 后)
    # md_html -i ./docs/guide.md -o ./public/html -t "用户指南"
    ```

* **转换整个目录 (输出到源目录):**
    ```bash
    # node convert.js -i ./source_notes
    # 或 (设置 PATH 后)
    # md_html -i ./source_notes
    ```

* **使用 Plausible Analytics:**
    ```bash
    # node convert.js -i release_notes.md -d myanalytics.example.com
    # 或 (设置 PATH 后)
    # md_html -i release_notes.md -d myanalytics.example.com
    ```

## 🛠️ 设置为全局命令 (可选)

如果你希望在系统的任何目录下都能直接输入 `md_html` 来运行此脚本，你需要进行以下设置：

1.  **选择一个目录:** 将 `convert.js`, `md_html.cmd`, 和 `style.css` (以及 `node_modules` 文件夹，如果 `npm install` 在这里运行) 放在一个稳定、永久的位置。例如：`C:\custom-scripts\` (Windows) 或 `/opt/custom-scripts/` (Linux/macOS)。
2.  **配置系统:**

    * **Windows:**
        1.  将你选择的目录 (例如 `C:\custom-scripts\`) 添加到系统的 **PATH 环境变量**中。（可以通过“编辑系统环境变量” -> “环境变量...” -> 编辑 Path 变量来完成）。
        2.  **关闭并重新打开**所有命令提示符 (cmd) 或 PowerShell 窗口，使更改生效。
        3.  现在你应该可以在任何目录下运行 `md_html [选项...]` 了。`md_html.cmd` 文件使得 Windows 可以直接执行它。

    * **Linux/macOS:**
        1.  **添加执行权限:** 在终端中，进入脚本所在目录，运行 `chmod +x convert.js`。
        2.  **(推荐) 重命名:** 为了方便输入，可以将 `convert.js` 重命名为 `md_html` (或其他你喜欢的名字): `mv convert.js md_html`。
        3.  **添加到 PATH:** 将脚本所在目录添加到你的 shell 配置文件 (`~/.bashrc`, `~/.zshrc`, `~/.profile` 等) 中。例如，在文件末尾添加 `export PATH="/opt/custom-scripts:$PATH"` (将路径替换为你的实际路径)。
        4.  **应用更改:** 运行 `source ~/.your_profile_file` (例如 `source ~/.zshrc`) 或**重新打开一个新的终端窗口**。
        5.  现在你应该可以在任何目录下运行 `md_html [选项...]` 了。

## 命令行选项

| 选项                 | 别名 | 描述                                                                 | 类型    | 是否必需 | 默认值                                                                  |
| :------------------- | :--- | :------------------------------------------------------------------- | :------ | :------- | :---------------------------------------------------------------------- |
| `--input`            | `-i` | 输入的 Markdown 文件或包含 Markdown 文件的目录路径                   | string  | **是** | -                                                                       |
| `--output`           | `-o` | 输出 HTML 文件的目录路径。**如果未提供，则输出到源文件所在目录** | string  | 否       | `null` (行为依赖于输入类型)                                             |
| `--title`            | `-t` | 生成的 HTML 页面的 `<title>` 内容。如果未提供，则默认为输入文件名    | string  | 否       | `''` (脚本内部会使用文件名)                                               |
| `--domain`           | `-d` | 用于 Plausible Analytics 的域名                                       | string  | 否       | `''`                                                                    |
| `--style`            | `-s` | 自定义基础 CSS 文件的路径                                            | string  | 否       | `./style.css` (相对于脚本运行目录或使用绝对路径)                          |
| `--highlight-style`  | `-hs`| highlight.js 的 CSS 主题文件路径                                     | string  | 否       | `./node_modules/highlight.js/styles/atom-one-dark.css` (相对于脚本目录) |
| `--help`             | `-h` | 显示帮助信息                                                         | boolean | 否       | -                                                                       |

## 🎨 样式

* **基础样式:** 脚本会读取由 `--style` (或默认的 `style.css`) 指定的文件内容，并将其嵌入到生成的 HTML 文件的 `<head>` 内的 `<style>` 标签中。你可以编辑 `style.css` 或提供自己的文件来控制页面布局、字体、颜色等。
* **代码高亮:** 脚本会读取由 `--highlight-style` (或默认的 `atom-one-dark.css`) 指定的文件内容，并将其嵌入到 `<head>` 内。这决定了代码块的外观。你可以从 `node_modules/highlight.js/styles/` 目录中选择其他预定义的 Highlight.js 主题，或创建自己的主题。

## 📄 许可证

本项目采用 MIT 许可证。
