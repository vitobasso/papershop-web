
function WebSocketApi() {

    this.find = (params, onSuccess, onFail) => send('items')
    this.findAspects = (params, onSuccess, onFail) => send('features')

    function getHandler(type) {
        if(type == 'items') {
            return {
                parse: parseItems,
                publish: publishItems
            }
        } else if(type == 'features') {
            return {
                parse: parseFeatures,
                publish: publishFeatures
            }
        }
    }

    function publishItems(result) {
        var params = { filters: [] }
        $.publish('find-items', [params, result])
    }

    function publishFeatures(features) {
        var category = WebSocketApi.dummyCategory(features)
        $.publish('new-aspects', [category, features])
    }

    function parseItems(arr) {
        return {
            items: arr.map(parseItem),
            metadata: { itemsReturned: arr.length }
        }

        function parseItem(item){
            item.id = item.title
            item.price = {
                currency: 'USD',
                value: parseFloat(item.price.substring(1))
            }
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
        handler.publish(parsed)
    }

    var ws;
    function send(subject){
        var doSend = () => {
            ws.send(subject)
            console.log('ws: sent:', subject)
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