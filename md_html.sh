#!/bin/sh

# 获取脚本所在的目录
# "$0" 是脚本本身的路径，`dirname` 获取其目录部分
SCRIPT_DIR=$(dirname "$0")

# 执行 Node.js 转换脚本
# - "$SCRIPT_DIR/convert.js" 确保总能找到与此脚本在同一目录下的 convert.js
# - "$@" 将所有传递给此脚本的参数原封不动地传递给 Node 脚本
node "$SCRIPT_DIR/convert.js" "$@"