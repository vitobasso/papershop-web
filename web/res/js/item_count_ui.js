/**
 * Created by Victor on 18/07/2015.
 */

function ItemCountUI() {

    this.setFiltered = setFiltered;
    this.setTotal = setTotal;

    var total = 0, filtered = 0;
    hide();

    function setTotal(newTotal) {
        total = newTotal;
        render();
    }

    function setFiltered(newFiltered) {
        filtered = newFiltered;
        render();
    }

    function render() {
        var text = "Showing " + filtered + " out of " + total + " known items.";
        $("#item-count").show().text(text);
    }

    function hide() {
        $("#item-count").hide();
    }

}