
function WebSocketApi() {

    this.find = (params, onSuccess, onFail) => request(onSuccess)

    this.findAspects = (params, onSuccess, onFail) => {}

    function request(onSuccess) {
        var receive = (msg) => {
            var arr = JSON.parse(msg)
            var items = parseItems(arr)
            onSuccess(items)
        }
        send(receive)
    }

    function parseItems(arr) {
        return {
            items: arr.map(parseItem),
            metadata: { itemsReturned: arr.length }
        }
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

    var ws;
    function send(receive){
        var doSend = () => {
            ws.onmessage = (evt) => receive(evt.data)
            ws.send('more')
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