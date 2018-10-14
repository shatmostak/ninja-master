# ninja

CW production callback #s
4884, 4885, 4886, 4887

MS test callback #s
4888, 4889, 4890, 4891

Status #s that contain 'Shipped In-Transit'
450
78
503
608

ship costs automatically added to ConnectWise products from IP on ConnectWise status = 'Shipped In-Transit'

for IT:
i have setup a webhook setup where ConnectWise will send me data dumps when a ConnectWise ticket hits status 'Shipped - In Transit' on any board.  The dump is sent to the server IPtoCWtoQB on port 3001.  The app is listening on port 3001 and when it receives this dump it pulls the ConnectWise# out of it, then searches InfoPlus for the order ticket that pairs with it.  It will then find the InfoPlus ship ticket that pairs with the order ticket.  It will take the ship cost and postal carrier and send them back to the original ConnectWise ticket and post them as a product along with the tracking number and site.

for ACCOUNTING:
when a ConnectWise ticket hits status 'Shipped - In Transit' on any board in ConnectWise it will pull ship cost and postal carrier and write it back into ConnectWise as a new product called Shipping.  The price is set as what we paid + $1 + 25% of that on top.  The cost is set to zero.  The description will contain the tracking number, the postal carrier, and the site/opco.

for WAREHOUSE:
when a ConnectWise ticket hits status 'Shipped - In Transit' on any board in ConnectWise it will pull ship cost and postal carrier and write it back into ConnectWise as a new product called Shipping.  The price is set as what we paid + $1 + 25% of that on top.  The cost is set to zero.  The description will contain the tracking number, the postal carrier, and the site/opco.  This program will not trigger any automatic status changes as it stands.
