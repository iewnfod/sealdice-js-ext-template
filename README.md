# 海豹js扩展 - 吃了么

### 介绍

一个简单易用的脚本，来随机今天吃什么。


### 如何使用

clone或下载项目，随后:

```
pnpm install
pnpm build
```

好的，现在你的项目被编译成功了，就在dist目录，将其上传至你的海豹骰实例即可。

你可以在这里或使用 `.eat_what help` 来查看如何使用：
```
$ .eat_what
Usage: .eat_what [日期时间] [时区]

Samples:
  .eat_what                       # 当前时间 (默认时区 Asia/Shanghai)
  .eat_what 2026-02-27-12:30      # 指定日期时间 (默认时区)
  .eat_what 2026-02-27-22:30 America/New_York   # 指定日期时间和时区
  .eat_what help                  # 显示帮助
  .eat_what list                  # 列出各时间段的食物选项
```

### 功能

- 随机选择今天吃什么
- 查看所有已添加的菜品
