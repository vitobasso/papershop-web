/**
 * Created by Victor on 10/07/2015.
 */
function Filters() {

    var filterUI = new FilterUI();

    var filters = [
        {
            name: "Condition",
            values: [
                {id: 1000, name: "New"},
                {id: 1500, name: "New other (see details)"},
                {id: 1750, name: "New with defects"},
                {id: 2000, name: "Manufacturer refurbished"},
                {id: 2500, name: "Seller refurbished"},
                {id: 3000, name: "Used"},
                {id: 4000, name: "Very Good"},
                {id: 5000, name: "Good"},
                {id: 6000, name: "Acceptable"},
                {id: 7000, name: "For parts or not working"}
            ],
            getValueLabel: getName,
            getValueId: getId
        },
        {
            name: "ListingType",
            values: [
                "Auction",
                "AuctionWithBIN",
                "Classified",
                "FixedPrice",
                "StoreInventory"
            ],
            getValueLabel: identity,
            getValueId: identity
        }
    ];

    this.populate = function () {
        filterUI.populate(filters)
            .classed("common-filter", true);
    }

}