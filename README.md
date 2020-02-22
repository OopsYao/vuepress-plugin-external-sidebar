# Vuepress Plugin External Sidebar

In my opinion, config of TOC should be placed along with
the `doc` directory, rather than in `config.js`. e.g.,
assume the directory
```
.
|--- docs
|    |--- .vuepress
|    |
|    |--- guide
|    |    |--- README.md
|    |    |--- next.md
|    |    |--- toc.js
|    |
|    |--- api
|         |--- README.md
|         |--- details.md
|         |--- toc.js
|     
|---- package.json
```
where `toc.js` in each dir contains the content of dir configuration.
e.g.
```js
// docs/guide/toc.js
module.exports = [
  '', 'next'
]
```

Then this plugin will automatically inject the sidebar prop into
`themeConfig`, and if there is no `toc.js` then `auto` field is applied.