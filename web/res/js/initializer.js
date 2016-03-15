
function init() {
    Main.init();
    ChartRenderer.init(); //FIXME glitchy size causing scrollbars to appear
    Categories.init();
    Config.init();
    ChartManager.init(); //FIXME depends on ChartRenderer & Categories.
    RequestLog.init();
    RequestLogUI.init();
    Items.init();
    MessageUI.init();
    Filters.init();
    HandlerAssigner.init();
    $.publish('init');
}

$(init);