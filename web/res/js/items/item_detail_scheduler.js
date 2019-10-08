const ItemDetailScheduler = (function () {
    let module = {};

    module.init = () => {
        setInterval(detailNextItem, 10000) //TODO from config
//        setTimeout(detailNextItem, 10000) //TODO from config
    }

    module.find = function () {
        try {
            var params = RequestLog.notifyNewRequestAndGetPaging(uiParams); //TODO publish & paging
            checkTotalItems(params);
            Sources.get().api.find(params);
        } catch (err) {
            onFail(err);
        }
    };

    module.onSuccess = (params, result) => {
        var aspects = itemAspects(result);
        $.publish('new-aspects', [aspects]);
        $.publish('detailed-item', [params, result]);
    }

    function itemAspects(item) {
        function toAspect(key) {
            let getValue = (anyItem) => ({
                id: anyItem[key],
                name: anyItem[key]
            })
            return {
                 id: key,
                 name: key,
                 values: [getValue(item)],
                 getFromItem: getValue
            }
        }
        return Object.keys(item).map(toAspect)
    }

    function detailNextItem() {
        const item = pickItem();
        if(item){
            fetchDetails(item)
        }
    }

    function isPendingDetails(item) {
        return !item.isDetailed
    }

    function pickItem() {
        const items = Items.filter();
        const chosenItem = items.filter(isPendingDetails)[0];
        if(chosenItem) {
            chosenItem.isDetailed = true;
        }
        return chosenItem
    }

    function fetchDetails(item){
        const params = {
            item: {
                id: item.id,
                url: item.link
            }
        }
        Sources.get().api.detail(params);
    }

    return module;
}());