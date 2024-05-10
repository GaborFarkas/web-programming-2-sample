document.addEventListener('DOMContentLoaded', function () {
    const navBtns = document.querySelectorAll('body .app-container nav button');
    let app;

    for (let navBtn of navBtns) {
        const moduleName = navBtn.getAttribute('data-module');
        const htmlTemplateName = navBtn.getAttribute('data-template');

        if (moduleName) {
            navBtn.addEventListener('click', function () {
                if (app) {
                    app.destroy();
                }
                import(`./app/${moduleName}.js`).then(function (module) {
                    app = new module.default({
                        target: 'app-target',
                        statusBar: 'status',
                        htmlTemplate: htmlTemplateName ? `./app/${htmlTemplateName}.html` : undefined
                    });
                });
            });
        }
    }
});
