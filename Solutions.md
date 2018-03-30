
# Project Proposal - MoonToday

MoonToday is an online cryptocurrency profolio tracker app that provide trading advices.

#### Authors:
* William Ginsberg - Github username: wginsberg - UTORID: ginsber9
* Kang Jie Yuan - Github username: kjackyuan - UTORID: yuankang
* Hung Yuan Chen - Github username: harveyc95 - UTORID: chenhun4

#### Note: Please init the sqlite3 database once using `init.js` start the server using `server.js` connect using localhost:3000

Main view upon startup: 
![alt text](https://github.com/csc309-18s/assignment-2-senpai-please-notice-me/blob/master/SolutionsIMG/Home.png)

## Functionalities
### Wallet
![alt text](https://github.com/csc309-18s/assignment-2-senpai-please-notice-me/blob/master/SolutionsIMG/Wallet.png)

User input the amount of different cryptocurrencies that he/she owns.
To change the amount of crypto owned, the user can type in a new number or just the up and down toggle.
MoonToday calculates their total value using the current market price from Nexchange.
At the bottom of, the sum of all cryptocurrency values is displayed. 

### Summary
![alt text](https://github.com/csc309-18s/assignment-2-senpai-please-notice-me/blob/master/SolutionsIMG/Summary.png)

Displays a doughnut chart of the cryptocurrencies owned, including $ value and % of portfolio.

### Insights
![alt text](https://github.com/csc309-18s/assignment-2-senpai-please-notice-me/blob/master/SolutionsIMG/Insights.png)

To access the insights page. To access this, the user can click on Insights view (default to BTCCAD with 24HR analysis) 
or the user will can select a specific cryptocurrency by selecting its corresponding trading pair in the wallet view.
MoonToday will display the price chart of the traiding pair in the last 24HR by default. Other timescales such as 
Week, Month, and Year is also available.
Other revelant data such as Market High, Market Low, Trend, % Change, and current holdings are also displayed.

### Search Bar
The search bar is persistent across all three views and allows the user to add their other crypto holdings.

### Session Management
-insert pic
