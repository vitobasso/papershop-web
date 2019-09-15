
function init() {
    ChartRenderer.init() //FIXME glitchy size causing scrollbars to appear
    Categories.init()
    FilterBuilder.init()
    Sources.init()
    ChartManager.init() //FIXME depends on ChartRenderer & Categories.
    RequestLog.init()
    RequestLogUI.init()
    Items.init()
    MessageUI.init()
    HandlerAssigner.init()
    $.publish('init')
}

$(init);