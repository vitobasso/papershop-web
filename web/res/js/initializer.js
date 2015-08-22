/**
 * Created by Victor on 21/08/2015.
 */
function init() {
    Main.init();
    ChartRenderer.init(); //FIXME glitchy size causing scrollbars to appear
    Categories.init();
    Config.init();
    ChartManager.init(); //FIXME depends on ChartRenderer & Categories.
    ItemFinder.init();
    RequestLog.init();
    RequestLogUI.init();
    AspectsFinder.init();
    Items.init();
}

$(init);