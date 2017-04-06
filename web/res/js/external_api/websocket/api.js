
function WebSocketApi() {

    this.find = (params, onSuccess, onFail) => send('items', params)
    this.findAspects = (params, onSuccess, onFail) => send('features', params)
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
            'features': {
                parse: parseFeatures,
                publish: publishFeatures },
            'list-sources': {
                parse: x => x,
                publish: list => $.publish('found-new-scraper-sources', [list]) }
        }
        return map[subject]
    }

    function publishItems(result, params) {
        $.publish('find-items', [params, result])
    }

    function publishFeatures(features) {
        var category = WebSocketApi.dummyCategory(features)
        category.hasFetchedFeatures = true
        $.publish('new-aspects', [category, features])
    }

    function parseItems(arr) {
        return {
            items: arr.map(parseItem),
            metadata: { itemsReturned: arr.length }
        }

        function parseItem(item){
            item.id = item.title
            item.category = WebSocketApi.dummyCategory()
            item.aspects = {}
            return item
        }
    }

    function parseFeatures(arr){
        return arr.map(parseFeature)

        function parseFeature(feature){
            return {
                id: feature.key,
                name: feature.key,
                values: feature.values.map(parseFeatureValue)
            }
        }

        function parseFeatureValue(value){
            return {
                id: value,
                name: value
            }
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

WebSocketApi.getRootCategory = () => WebSocketApi.dummyCategory()
WebSocketApi.dummyCategory = (features = []) => ({
                                id: "dummy",
                                name: "dummy",
                                aspects: features
                            })