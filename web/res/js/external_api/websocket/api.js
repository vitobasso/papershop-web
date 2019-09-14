
function WebSocketApi() {

    this.find = (params) => send('items', params)
    this.requestSourceList = () => send('list-sources')

    $.subscribe('selected-source', (_, source) => {
        var id = source.id
        var prefix = 'scraper-'
        if(id.startsWith(prefix)){
            var params = {
                name: id.replace(prefix, '')
            }
            send('change-source', params)
        }
    })

    function getHandler(subject) {
        var map = {
            'items': {
                parse: parseItems,
                publish: publishItems },
            'list-sources': {
                parse: x => x,
                publish: list => $.publish('found-new-scraper-sources', [list]) }
        }
        return map[subject]
    }

    function publishItems(result, params) {
        ItemFinder.onSuccess(params, result)
    }

    function parseItems(arr) {
        return {
            items: arr.map(parseItem),
            metadata: { itemsReturned: arr.length }
        }

        function parseItem(item){
            item.id = item.title
            item.category = Categories.get()
            item.aspects = {}
            return item
        }
    }

    function receive(json){
        var handler = getHandler(json.subject)
        var parsed = handler.parse(json.content)
        handler.publish(parsed, json.params)
    }

    var ws;
    function send(subject, params){
        var jsonMsg = {
            subject: subject,
            params: params
        }
        console.log(strMsg)
        var strMsg = JSON.stringify(jsonMsg)
        var doSend = () => {
            ws.send(strMsg)
            console.log('ws: sent:', strMsg)
        }
        if(ws) doSend()
        else init(doSend)
    }

    function init(callback){
        if (!("WebSocket" in window)) console.err("WebSocket NOT supported by your Browser!")
        ws = new WebSocket("ws://localhost:8080")
        ws.onopen = () => {
            console.log("ws: opened")
            callback()
        }
        ws.onmessage = evt => {
            var json = JSON.parse(evt.data)
            console.log('ws: received', json)
            receive(json)
        }
        ws.onclose = () => console.log("ws: closed")
    }

}
