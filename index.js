const fs = require('fs');
const { resolve, dirname } = require('path');
// Scan the source directory for `toc.js` to
// generate `sidebar` obj
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
        // Seems like this function will be excuted twice in prod mode,
        // one for .md one for .html rednering
        if (_filePath === undefined) return;
        if (!fs.existsSync(resolve(dirname(_filePath), 'toc.js'))) {
            frontmatter.sidebar = 'auto';
        }
    },
    enhanceAppFiles: resolve(__dirname, 'enhanceAppFiles.js'),
    // Since `sidebar` is generated during building time,
    // and we need to inject it during runtime.
    clientDynamicModules() {
        return {
            name: 'constants.js',
            content: `export const sidebar = ${JSON.stringify(sidebar(ctx.sourceDir))}`,
        }
    }
})