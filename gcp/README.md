### Extra steps for running on GCP

Have a valid App Engine Project and loud SQL instance.

Have the Cloud SQL proxy present.

Copy `environ.template` to `environ` and add correct password, user, database, etc.

Initialize environment variables:

```source environ```

Start the proxy:
```./sql_proxy.sh```

