### Extra steps for running on GCP

Have a valid App Engine Project and loud SQL instance.

Have the Cloud SQL proxy present.

Edit app.standard.yaml to have add correct password, user, database, etc.

Start the proxy:
```./cloud_sql_proxy -instances=$INSTANCE_CONNECTION_NAME```

Start the server with extra flag:
```npm start -- --cloud-sql```
