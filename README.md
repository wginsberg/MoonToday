IN PROGRESS:
* Will, you rube, you started making changes to something else while all this was in progress! The second set of changes had to do with the server-crash bug. Pulling the thread revealed that there are further required changes to the logic of price fetching
* Adding loading spinners to the wallet table
* The sequence should be something like: spin, show table, spin rows and total, show rows and total as they come in
* In the middle of changing the logic so that state, ajax, html and shit are handled correctly
* oh my god I wish I was using react

BUGS:
[x] NaN in Insights chart
[x] Default coins still appear in typeahead
[x] Broken typeahead
[x] Update total on wallet delete
[ ] Server crashes when client opened in second browser

IDEADS:
* crypto headlines in the navbar with links

TODO in order of priority:
[x] Set a default set of coins for new user
[x] Transform coinpair list to just be a list of coins, with everything using USD
[x] Proper layout of main page on mobile
[x] Insights button takes you to a portfolio aggregate chart
[x] Clicking on a wallet brings up a coin insight in a modal window
[x] Biggest movers on insights page
[ ] Spinners on insights page
[ ] Portfolio stats on insights page
* Add a special message to the Summary page for null wallets
* Add loading animation for wallets page
* Better loading animation for Insights
* Recaptcha
* Routing
* Serverside computation of graph data for insights so that loading time is reasonable
