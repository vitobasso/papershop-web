
function init() {
    ChartRenderer.init(); //FIXME glitchy size causing scrollbars to appear
    Categories.init();
    FilterBuilder.init();
    Config.init();
    ChartManager.init(); //FIXME depends on ChartRenderer & Categories.
    RequestLog.init();
    RequestLogUI.init();
    Items.init();
    ItemGroomer.init();
    MessageUI.init();
    Filters.init();
    HandlerAssigner.init();
    $.publish('init');
}

$(init);