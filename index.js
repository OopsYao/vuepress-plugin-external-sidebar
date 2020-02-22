const fs = require('fs');
const { resolve, dirname } = require('path');
const sidebar = function (srcDir) {
    let sidebar = {};

    fs.readdirSync(srcDir).forEach(ele => {
        let info = fs.statSync(resolve(srcDir, ele));
        if (info.isDirectory()) {
            let tocfile = resolve(srcDir, ele, 'toc.js');
            if (ele != '.vuepress' && fs.existsSync(tocfile)) {
                sidebar['/' + ele + '/'] = require(tocfile);
            }
        }
    });

    return sidebar;
};

module.exports = (_, ctx) => ({
    extendPageData($page) {
        const { _filePath, frontmatter } = $page;
        if (!fs.existsSync(resolve(dirname(_filePath), 'toc.js'))) {
            frontmatter.sidebar = 'auto';
        }
    },
    enhanceAppFiles: resolve(__dirname, 'enhanceAppFiles.js'),
    clientDynamicModules() {
        return {
            name: 'constants.js',
            content: `export const sidebar = ${JSON.stringify(sidebar(ctx.sourceDir))}`,
        }
    }
})