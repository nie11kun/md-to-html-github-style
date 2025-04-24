好的，这是一个适用于你这个项目的 README 文件示例，你可以根据需要进行修改和补充。

```markdown
# Markdown 到 HTML 转换器脚本 (Markdown to HTML Converter Script)

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

## ⚙️ 先决条件

* [Node.js](https://nodejs.org/) (建议使用 LTS 版本或更高版本)
* npm (通常随 Node.js 一起安装)

## 🚀 安装

1.  **获取脚本:** 克隆此仓库或直接下载 `convert.js` 文件以及默认的 `style.css` 文件。
    ```bash
    # 如果你使用的是 Git
    # git clone https://github.com/nie11kun/md-to-html-github-style.git
    # cd md-to-html-github-style.git

    # 或者直接下载 convert.js 和 style.css 到你的项目目录
    ```
2.  **安装依赖:** 在包含 `convert.js` 的目录下打开终端，运行以下命令来安装所需的 npm 包：
    ```bash
    npm install showdown highlight.js yargs
    ```
    这将下载并安装 `showdown`, `highlight.js`, 和 `yargs` 到 `node_modules` 目录。

## 💡 使用方法

在终端中通过 `node` 命令运行脚本。

**基本语法:**

```bash
node convert.js -i <输入文件或目录> [-o <输出目录>] [其他选项...]
```

**示例:**

1.  **转换单个文件 (输出到同目录):**
    ```bash
    node convert.js -i README.md
    # 将在当前目录下生成 README.html
    ```

2.  **转换单个文件 (指定输出目录和标题):**
    ```bash
    node convert.js -i ./docs/guide.md -o ./public/html -t "用户指南"
    # 将在 ./public/html/ 目录下生成 guide.html
    ```

3.  **转换整个目录 (输出到源目录):**
    ```bash
    node convert.js -i ./source_notes
    # 将处理 ./source_notes 下的所有 .md 文件
    # 例如，source_notes/note1.md -> source_notes/note1.html
    ```

4.  **转换整个目录 (指定输出目录):**
    ```bash
    node convert.js -i ./project_docs -o ./generated_html
    # 将处理 ./project_docs 下的所有 .md 文件
    # 例如，project_docs/api.md -> generated_html/api.html
    ```

5.  **使用 Plausible Analytics:**
    ```bash
    node convert.js -i release_notes.md -d myanalytics.example.com
    # 生成的 release_notes.html 将包含 Plausible 跟踪代码
    ```

6.  **使用自定义 CSS 和高亮主题:**
    ```bash
    node convert.js -i report.md -s ./assets/custom-style.css -hs ./node_modules/highlight.js/styles/github-dark.css
    # 生成的 report.html 将使用指定的样式文件
    ```

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

本项目采用 MIT 许可证。详情请参阅 `LICENSE` 文件（如果未来添加）。

```
