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

#### Google
Authenticating to Google Sheets is performed via a configured service account. 
You can read more about [creating a Google Sheets service account here]().

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
`friendly-service-deploy` will find the current version (see below), iterate the minor version once (`1.x` -> `1.x+1`), 
build a new Docker image, tag it, and push it to the repo named in `friendly-secrets.json`.

_Example_
Repostory name: `"friendly-secrets.dockerRepository": "foo/bar"` 
Current verison: `1.5`
Running `friendly-service-deploy.sh` will login to dockerhub, create an image tagged as `foo/bar:friendly-service-1.6` and push it to the `foo/bar` repo.

`friendly-service-run.sh` will query the repo named in `friendly-secrets.json`

#### Versioning

## Deployment

### Docker

### Scripts

### Cron


## Resources
### Google Sheets
Link to FriendlySheet:

### Twilio

### Dockerhub
Repository name: bryansmi/private
Link to dockerhub:

## Known Issues
Server will assume it's local date and time.
This is by design.
