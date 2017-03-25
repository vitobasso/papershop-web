
function WebSocketApi() {

    this.find = function (params, onSuccess, onFail) {

        if ("WebSocket" in window) {
            var ws = new WebSocket("ws://localhost:8080");
            ws.onmessage = (evt) => {
                var msg = evt.data;
                console.log("received: ", msg)
                var arr = JSON.parse(msg)
                var items = parseItems(arr)
                onSuccess(items)
            }

            ws.onopen = () => {
                console.log("ws opened")
                ws.send('more')
            }

            ws.onclose = () => console.log("ws closed")

        } else {
            console.err("WebSocket NOT supported by your Browser!");
        }

    };

    this.findAspects = function (params, onSuccess, onFail) {}

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

}