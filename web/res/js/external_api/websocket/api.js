
function WebSocketApi() {

    this.find = (params, onSuccess, onFail) => request('items', parseItems, onSuccess)

    this.findAspects = (params, onSuccess, onFail) => request('features', parseFeatures, onSuccess)

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
            item.category = { name: "category" }
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

    function request(question, parse, onSuccess){
        send(question, receive(parse, onSuccess))
    }

    function receive(parse, onSuccess) {
        return (msg) => {
            console.log('ws: received:', msg)
            var json = JSON.parse(msg)
            onSuccess(parse(json))
        }
    }

    var ws;
    function send(question, receive){
        var doSend = () => {
            ws.onmessage = (evt) => receive(evt.data)
            ws.send(question)
            console.log('ws: sent:', question)
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
        ws.onclose = () => console.log("ws: closed")
    }

}