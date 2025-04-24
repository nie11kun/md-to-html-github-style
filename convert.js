#!/usr/bin/env node

// 引入所需模块
const showdown = require('showdown');
const fs = require('fs').promises; // 使用 fs 的 promises API
const path = require('path');      // 用于处理文件路径
const hljs = require('highlight.js'); // 用于代码高亮
const yargs = require('yargs/yargs'); // 用于解析命令行参数
const { hideBin } = require('yargs/helpers'); // yargs 的辅助函数

// --- Showdown 代码高亮扩展 ---
// (保持不变，同上一个版本)
showdown.extension('highlight', function () {
  function htmlunencode(text) {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  return [{
    type: 'output',
    filter: function (text, converter, options) {
      const left = '<pre><code\\b[^>]*>';
      const right = '</code></pre>';
      const flags = 'g';
      const replacement = function (wholeMatch, match, left, right) {
        const langMatch = left.match(/class="([^"\s]+)/);
        let lang = langMatch && langMatch[1] ? langMatch[1] : null;
        if (lang && lang.startsWith('language-')) {
            lang = lang.substring('language-'.length);
        } else if (lang && lang.startsWith('lang-')) {
            lang = lang.substring('lang-'.length);
        }
        match = htmlunencode(match);
        const updatedLeft = left.replace(/<code/g, '<code class="hljs"');
        try {
          if (lang && hljs.getLanguage(lang)) {
            const highlighted = hljs.highlight(match, { language: lang, ignoreIllegals: true }).value;
            return updatedLeft + highlighted + right;
          } else {
            const highlighted = hljs.highlightAuto(match).value;
            return updatedLeft + highlighted + right;
          }
        } catch (e) {
            console.warn(`⚠️ 代码块高亮处理出错 (语言: ${lang || '自动检测'}):`, e.message);
            return left + match + right;
        }
      };
      return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
    }
  }];
});

// --- 核心转换逻辑 ---
// (保持不变，同上一个版本)
async function convertMarkdownToHtml(inputFilePath, outputDir, pageTitle, plausibleDomain, styleData, highlightingStyles) {
    try {
        console.log(`⏳ 正在处理: ${inputFilePath}`);
        const markdownContent = await fs.readFile(inputFilePath, 'utf8');

        const converter = new showdown.Converter({
            ghCompatibleHeaderId: true,
            simpleLineBreaks: true,
            ghMentions: true,
            extensions: ['highlight'],
            tables: true,
            strikethrough: true,
            tasklists: true,
            metadata: false
        });
        converter.setFlavor('github');

        let preContent = `<!DOCTYPE html>
<html>
<head>
  <title>${pageTitle || path.basename(inputFilePath, '.md')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta charset="UTF-8">
  <style type='text/css'>${styleData}</style>
  <style type='text/css'>${highlightingStyles}</style>`;

        if (plausibleDomain) {
            preContent += `
  <script defer data-domain="${plausibleDomain}" src="https://plausible.io/js/script.js"></script>`;
        }
        preContent += `
</head>
<body>
  <div id='content'>
`;

        const postContent = `
  </div>
</body>
</html>`;

        const htmlBody = converter.makeHtml(markdownContent);
        const finalHtml = preContent + htmlBody + postContent;

        const baseFilename = path.basename(inputFilePath, '.md');
        const outputFilename = `${baseFilename}.html`;
        // *** 使用传入的 outputDir ***
        const outputFilePath = path.join(outputDir, outputFilename);

        await fs.writeFile(outputFilePath, finalHtml, 'utf8');
        // *** 日志现在也依赖于传入的 outputDir ***
        console.log(`✅ 成功转换 ${path.basename(inputFilePath)} -> ${outputFilePath}`);

    } catch (error) {
        console.error(`❌ 处理文件 ${inputFilePath} 时出错:`, error.message);
    }
}

// --- 主执行函数 ---
async function run() {
    // --- 配置命令行参数解析器 (yargs) ---
    const argv = yargs(hideBin(process.argv))
        .usage('使用方法: $0 -i <输入文件或目录> [-o <输出目录>] [选项]') // 更新使用说明
        .option('input', {
            alias: 'i',
            describe: '输入的 Markdown 文件或包含 Markdown 文件的目录',
            type: 'string',
            demandOption: true // 输入仍是必需的
        })
        .option('output', { // 定义 'output' 选项
            alias: 'o',
            // *** 更新描述，说明其可选性及默认行为 ***
            describe: '输出目录 (可选, 如果未提供，则输出到源文件所在目录)',
            type: 'string',
            // *** 移除 demandOption: true 使其变为可选 ***
            // demandOption: true,
            default: null // 设置默认值为 null，方便后续检查
        })
        .option('title', {
            alias: 't',
            describe: 'HTML 页面的 <title> (如果未提供，则默认为输入文件名)',
            type: 'string',
            default: ''
        })
        .option('domain', {
            alias: 'd',
            describe: 'Plausible 分析服务的域名',
            type: 'string',
            default: ''
        })
        .option('style', {
            alias: 's',
            describe: '自定义基础 CSS 文件的路径',
            type: 'string',
            default: path.join(__dirname, 'style.css')
        })
        .option('highlight-style', {
            alias: 'hs',
            describe: 'highlight.js 的 CSS 主题文件路径',
            type: 'string',
            default: path.join(__dirname, 'node_modules', 'highlight.js', 'styles', 'atom-one-dark.css')
        })
        .help()
        .alias('help', 'h')
        .strict()
        .argv;

    // --- 解析输入路径 ---
    const inputPath = path.resolve(process.cwd(), argv.input);

    // --- 预加载 CSS 样式 ---
    let styleData = '';
    let highlightingStyles = '';
    try {
        const stylePath = path.resolve(process.cwd(), argv.style);
        styleData = await fs.readFile(stylePath, 'utf8');
        console.log(`🎨 已加载基础样式: ${stylePath}`);
    } catch (err) {
        console.warn(`⚠️ 警告: 无法从 ${argv.style} 加载基础样式文件。将使用空样式。`);
    }
    try {
        const highlightStylePath = path.resolve(process.cwd(), argv.highlightStyle);
        highlightingStyles = await fs.readFile(highlightStylePath, 'utf8');
        console.log(`🎨 已加载高亮样式: ${highlightStylePath}`);
    } catch (err) {
        console.warn(`⚠️ 警告: 无法从 ${argv.highlightStyle} 加载高亮样式文件。将使用空高亮样式。`);
    }

    // --- 处理输入 (文件或目录) ---
    try {
        const inputStats = await fs.stat(inputPath);
        let finalOutputDir; // 用于存储最终确定的输出目录

        // --- 确定并准备输出目录 ---
        if (argv.output) {
            // 如果用户提供了 -o 参数
            finalOutputDir = path.resolve(process.cwd(), argv.output);
            console.log(`ℹ️ 指定输出目录: ${finalOutputDir}`);
            try {
                // 创建指定的输出目录（如果不存在）
                await fs.mkdir(finalOutputDir, { recursive: true });
            } catch (error) {
                console.error(`❌ 致命错误: 无法创建指定的输出目录 ${finalOutputDir}:`, error.message);
                process.exit(1);
            }
        } else {
            // 如果用户没有提供 -o 参数
            console.log(`ℹ️ 未指定输出目录，将输出到源文件所在位置。`);
            // 输出目录将在下面根据输入类型确定，这里不需要创建目录，因为源目录必然存在
        }

        if (inputStats.isDirectory()) {
            // --- 处理目录输入 ---
            // 如果未指定 -o，则输出目录就是输入目录本身
            if (!argv.output) {
                finalOutputDir = inputPath;
            }
            console.log(`📂 正在处理目录: ${inputPath} -> 输出到: ${finalOutputDir}`);

            const files = await fs.readdir(inputPath);
            const markdownFiles = files.filter(file => file.toLowerCase().endsWith('.md'));

            if (markdownFiles.length === 0) {
                console.log(`ℹ️ 在目录 ${inputPath} 中未找到 Markdown 文件。`);
                return;
            }

            const processingPromises = markdownFiles.map(file => {
                const fullInputPath = path.join(inputPath, file);
                // 将最终确定的输出目录传递给转换函数
                return convertMarkdownToHtml(fullInputPath, finalOutputDir, argv.title, argv.domain, styleData, highlightingStyles);
            });
            await Promise.all(processingPromises);
            console.log(`\n🎉 完成处理目录 ${inputPath}。输出已保存到 ${finalOutputDir}。`);

        } else if (inputStats.isFile()) {
            // --- 处理文件输入 ---
            // 如果未指定 -o，则输出目录是输入文件的父目录
            if (!argv.output) {
                finalOutputDir = path.dirname(inputPath);
            }
            console.log(`📄 正在处理单个文件: ${inputPath} -> 输出到: ${finalOutputDir}`);

            if (!inputPath.toLowerCase().endsWith('.md')) {
                 console.warn(`⚠️ 警告: 输入文件 ${inputPath} 的扩展名不是 .md。`);
            }
            // 将最终确定的输出目录传递给转换函数
            await convertMarkdownToHtml(inputPath, finalOutputDir, argv.title, argv.domain, styleData, highlightingStyles);
            console.log(`\n🎉 完成处理文件 ${inputPath}。输出已保存到 ${finalOutputDir}。`);

        } else {
            console.error(`❌ 错误: 输入路径 ${inputPath} 不是有效的文件或目录。`);
            process.exit(1);
        }

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`❌ 致命错误: 输入路径 ${inputPath} 未找到。`);
        } else {
            console.error(`❌ 致命错误: 处理输入路径 ${inputPath} 时发生错误:`, error.message);
        }
        process.exit(1);
    }
}

// --- 运行主函数 ---
run().catch(error => {
    console.error("🆘 发生意外错误:", error);
    process.exit(1);
});