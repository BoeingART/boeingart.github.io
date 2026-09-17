# 谭臻至 · Zhenzhi Tan

个人学术网站，展示研究经历、论文和简历。

网站地址：[boeingart.github.io](https://boeingart.github.io/)

## 内容维护

| 内容               | 文件                           |
| ------------------ | ------------------------------ |
| 英文主页           | `_pages/about.md`              |
| 中文主页           | `_pages/about_cn.md`           |
| 论文列表           | `_bibliography/papers.bib`     |
| 在线简历           | `_data/cv.yml`                 |
| 中英文简历 PDF     | `assets/pdf/`                  |
| 联系方式与社交链接 | `_data/socials.yml`            |
| 主页照片           | `assets/img/profile-sharp.jpg` |
| 简历照片           | `assets/img/profile.jpg`       |
| 网站设置           | `_config.yml`                  |
| 自定义配色         | `assets/css/site-palette.css`  |

## 本地预览

安装 Ruby 3.3 或更高版本、Bundler、Node.js 和 ImageMagick 后，在项目目录运行：

```sh
bundle install
npm ci
bundle exec jekyll serve
```

打开本地预览地址 `http://127.0.0.1:4000/`。

## 发布

推送至 `main` 或 `master` 分支后，GitHub Actions 构建并发布到 GitHub Pages。
部署配置位于 `.github/workflows/deploy.yml`。

网站使用 Jekyll 和 [al-folio](https://github.com/alshedivat/al-folio)，保留原项目的 [MIT 许可证](LICENSE)。
