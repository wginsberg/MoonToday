
# Project Proposal - MoonToday

MoonToday is an online cryptocurrency profolio tracker app that provide trading advices.

#### Authors:
* William Ginsberg - Github username: wginsberg - UTORID: ginsber9
* Kang Jie Yuan - Github username: kjackyuan - UTORID: yuankang
* Hung Yuan Chen - Github username: harveyc95 - UTORID: chenhun4

#### Note: Please init the sqlite3 database once using `init.js` start the server using `server.js` connect using localhost:3000

### Your application must include a server-side component and a database. (NoSQL or SQL)
We are using sqlite3


### Your application must connect to at least one external public-facing API, ideally the same one you’ve been working with.
We are using the same API from assignemnt 1 and 2 (https://nexchange2.docs.apiary.io/#)


### Your application should implement session management, allowing a variety of different users to use the application and manage their own data. (TAs must be able to test without using their personal accounts on other applications to log in.)
Session management is implemented using cookies. Each user is associated with a cookie. The user can switch between users and the contents displayed will depend on the cookie.

### Your server must implement a RESTful API that extends/improves the behaviour of any API you’ve chosen to work with by allowing individual users to perform the 4 basic REST operations. This is an important part of your application. Since many public APIs only support GET requests, one approach is to store some portion of the data retrieved using the API and then provide the other REST operations using your own server.
To be added:

### You are responsible for making sure your project is deployed and running throughout the one hour when it will be evaluated. Details on available timeframes below.
The project will be deployed on a laptop for the demo.


Main view upon startup: 
![alt text](https://github.com/csc309-18s/assignment-3-senpai-please-notice-me/blob/master/screenshots/startup.png)

## Functionalities
### Wallet
![alt text](https://github.com/csc309-18s/assignment-3-senpai-please-notice-me/blob/master/screenshots/wallet.png)

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
![alt text](https://github.com/csc309-18s/assignment-3-senpai-please-notice-me/blob/master/screenshots/searchbar.png)

### Session Management
To be added:
![alt text](https://github.com/csc309-18s/assignment-3-senpai-please-notice-me/blob/master/screenshots/cookie.png)
