# Friendly
Friendly helps me be a better friend - pushing reminders that I pay attention to for things I care about, such as birthday reminders via SMS.

# friendly-service
## Overview
`friendly-service` is a daily worker which queries a Google Sheet (FriendlySheet) and conditionally pushes SMS messages via Twilio.

### Birthdays
`friendly-service` parses FriendlySheet and checks for current (today) or upcoming (within one (1) week) birthdays.
Once entries are found with birthdays, `friendly-service` sends a SMS reminder to the configured phone number via Twilio.

## Development Setup
### Requirements
Node: `lts/dubnium` v10.15.x

### Local Dev
Devs should only need to run `npm i` install secrets (see below), and `tsc` to be able to run the project.
See `package.json` for npm scripts.

`friendly-service` includes two VSCode launch options:
- Debug: Starts the service with a debugger attached. Watch should be enabled, but this is broken as of 3/7/2019.
- Test: Runs unit tests with debugger attached.

### Secrets
`./src/secrets` requires the following structure:
.
├── src 
   |── secrets
      |-- friendly  # `friendly-service` config secrets
      |-- google    # Google Sheets authentication secrets
      |-- twilio    # Twilio authentication secrets

#### Friendly
User secrets (such as docker registry and phone number) are configured locally.
`friendly-service` expects a `.../secrets/friendly/friendly-secrets.json` file with the following values:

```
{
    "bsPhoneNumber":
    "dockerHubRepository":
    "dockerHubUsername":
    "dockerHubPassword":
}
```

#### Google
Authenticating to Google Sheets is performed via a configured service account. 
You can read more about [creating a Google Sheets service account here](https://developers.google.com/identity/protocols/OAuth2ServiceAccount).

`friendly-service` expects a `.../secrets/google/friendly-service-serviceaccount-creds.json` file with the following values:

```
{
  "type":
  "project_id":
  "private_key_id":
  "private_key":
  "client_email":
  "client_id":
  "auth_uri":
  "token_uri":
  "auth_provider_x509_cert_url":
  "client_x509_cert_url":
}
```

`friendly-service` depends on the `googleapis` and `google-auth-library` to perform querying and authentication respectively.

#### Twilio
Authenticating to Twilio is performed with provided Twilio creds.
You can read more about [Twilio credentials for services here](). 

`friendly-services` expects a `.../secrets/twilio/twilio-credentials.json` file with the following values:

```
{
    "accountSid":
    "authToken":
    "sender":
}
```

`friendly-service` depends on `twilio` to perform authentiation and API consumption.

### Scripts
You can choose to deploy `friendly-service` however you want - it's just a node app.
However, for those deploying to home servers, some helpful scripts have been included.

#### friendly-service-deploy.sh
`friendly-service-deploy` will find login to docker, find the current version (see below), iterate the minor version once (`1.x` -> `1.x+1`), 
build a new Docker image, tag it, and push it to the repo named in `friendly-secrets.json`.

_Example_

Repostory name: `"friendly-secrets.dockerRepository": "foo/bar"` 

Current verison: `1.5`

Running `friendly-service-deploy.sh` will login to dockerhub, create an image tagged as `foo/bar:friendly-service-1.6` and push it to the `foo/bar` repo.

`friendly-service-run.sh` will query the repo named in `friendly-secrets.json`

#### friendly-service-run.sh
`friendly-service-run` will login to docker, use the latest version from the configured repo, and run the job.
This script is intended to be run via cron to run this as a scheduled job.

#### Versioning
Versions are kept in `version.txt`.
Versions are automatically updated when `friendly-service-deploy` is run.

Change this file at your own risk.

## Deployment
`friendly-service` can be deployed in a variety of ways:
- clone and `npm run` as desired
- clone and run via cron
- pull docker image and `docker run -p 8080:8080 {tag}`
- docker and run via cron

`friendly-service` is written with the intent to run as a scheduled job (see cron section below).
`friendly-service-run.sh` can be used to aid this (see scripts section above).

### Cron
To run this as a scheduled daily job, I use cron.
`crontab -e` looks as such:
```
SHELL=/bin/bash
PATH=/usr/bin:/bin:/usr/local/bin

# friendly
## friendly-service
10 12 * * * /Users/smith.bryan/code/personal/friendly/friendly-service/friendly-service.sh 1.3 >> /Users/smith.bryan/code/personal/friendly/friendly-service/fs.log
```

## Resources
### Google Sheets
[Link to Bryan's FriendlySheet](https://docs.google.com/spreadsheets/d/1WSbDRh81yQkdkYQdagZDNQ1HpDJn_obcYudJzRz2liY/edit#gid=0) 

Google Sheet columns:
`Timestamp	Name	Email Address	Country Code	Phone Number	Birthday	Mailing Address`

[Google S2S Authentication](https://developers.google.com/identity/protocols/OAuth2ServiceAccount)

### Twilio
Use the `account sid` and `auth token` values in the json secret file expected (see section secrets above).
All you should need to do is make an account to get setup these fields.

### Dockerhub
Repository name: bryansmi/private

[Link to dockerhub](https://cloud.docker.com/u/bryansmi/repository/docker/bryansmi/private)

## Known Issues
Server will assume it's local date and time.
This is by design.
