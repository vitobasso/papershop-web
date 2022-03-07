Papershop
=========

A web app to aggregate items from various web shops and help compare prices in a plot.

Web shops share a similar data model:
Items with a price and some features that can be searched by a keyword.
That's the case for things like:
- E-commerce: ebay.com, amazon.com, mercadolivre.com.br
- Classified ads: gumtree.com, marktplaats.nl, olx.com.br
- Hotel booking: booking.com, hostelworld.com
- Apartment renting: funda.nl, kamernet.nl

Maybe in an ideal world you'd have one fancy UI to do your browsing
and all the shops would just publish data that you can visualize there.
That's the idea.

![screenshot](screenshot.png)

## Data scraping

### Approach 1: Call public apis
Can't really do it for multiple websites, but as a first attempt I did it for:
- [✔] ebay.com
- [✔] mercadolivre.com.br

### Approach 2: Scrape HTML from their website
Easy to add new websites once a common mapping mechanism has been defined.
Most websites have:
- A page with a **keyword search** box
- A results page showing a **list of items** and maybe paging buttons
- An **item details** page after clicking an item from the list

I've implemented this as a backend service in
[papershop-scraper](https://github.com/vitobasso/papershop-scraper)
and added mappings for some websites.
