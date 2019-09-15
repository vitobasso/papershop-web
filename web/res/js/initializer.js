
function init() {
    ChartRenderer.init() //FIXME glitchy size causing scrollbars to appear
    Aspects.init()
    FilterBuilder.init()
    Sources.init()
    ChartManager.init() //FIXME depends on ChartRenderer & Aspects.
    RequestLog.init()
    RequestLogUI.init()
    Items.init()
    MessageUI.init()
    HandlerAssigner.init()
    $.publish('init')
}

$(init);