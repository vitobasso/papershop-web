
function WebSocketApi() {

    this.find = function (params, onSuccess, onFail) {

        if ("WebSocket" in window) {
            console.log("WebSocket is supported by your Browser!");
            var ws = new WebSocket("ws://localhost:8080");

            ws.onmessage = (evt) => {
                var msg = evt.data;
                console.log("received: ", msg)
                var json = JSON.parse(msg)
                var item = parseItem(json)
                onSuccess(item)
            }

            ws.onopen = () => {
                console.log("ws opened")
                ws.send('more')
            }

            ws.onclose = () => console.log("ws closed")

        } else {
            console.log("WebSocket NOT supported by your Browser!");
        }

    };

    this.findAspects = function (params, onSuccess, onFail) {}

    function parseItem(json) {
        var item = json
        item.id = item.title
        item.price = {
            currency: 'USD',
            value: parseFloat(item.price.substring(1))
        }
        item.category = { name: "category" }
        item.aspects = {}
        return {
                items: [item],
                metadata: { itemsReturned: 1 }
        }
    }

}