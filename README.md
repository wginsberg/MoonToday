BUGS:
[x] NaN in Insights chart
[x] Default coins still appear in typeahead
[x] Broken typeahead
[x] Update total on wallet delete
[x] Server crashes when client opened in second browser
[x] Deleted custom coins appear in typeahead
[ ] Pairs being disapearing from state.pairs (How to reproduce?)
[x] Cookie/url priority is inverted (?)
[ ] Custom coins in Summary

IDEADS:
* crypto headlines in the navbar with links

TODO in order of priority:
[ ] Clean, responsive layout
    [ ] Wallet table
        [ ] Succinct headers
        [ ] Remove Unit price column
        [ ] Smaller delete button
    [ ] Navbar
        [ ] Layout, padding on smaller screens
        [ ] Max height on large screens, for border
        [ ] Hamburger
            [x] Mutually exclusive to sidebar
            [x] Button styling
            [x] Automatic close
            [x] Smaller on tiny screens
        [x] Animate Wallet item when visible, otherwise hamburger button
    [ ] Header
        [ ] Home button styling
[ ] Chrome support
[ ] About page
[ ] Help page
[ ] Safari support
[ ] Edge support
[x] Set a default set of coins for new user
[x] Transform coinpair list to just be a list of coins, with everything using USD
[x] Proper layout of main page on mobile
[x] Insights button takes you to a portfolio aggregate chart
[x] Clicking on a wallet brings up a coin insight in a modal window
[x] Biggest movers on insights page
[x] Add loading animation for wallets page
[x] Spinners on insights page
[x] Change disabled feature logic: Allow insights only with a non-zero number of non-custom wallets, summary only with non-zero portfolio total
[x] Disable 'Biggest Movers' When there are fewer than 3 wallets
[x] Adding wallet should trigger re-render of charts
[x] Tables report small values as > 0 instead of simply rounding to 0
[x] Disable graph for custom coins
[x] Enter key should work on search bar
* Routing
* Serverside computation of graph data for insights so that loading time is reasonable
