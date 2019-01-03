# Friendly-Service
## What is Friendly-Service?
This is a job, intended to be run on a schedule, that will read from a Google Spreadsheet and send a text message.
The text message alerts users of current and upcoming birthdays.

## User Guide
### Requirements
User must be able to login to "bryansmi" user.
Password for dockerhub must be stored at **/usr/local/secrets/dockerhub.txt**.
Server must have docker installed and running.

### Known Issues
Server will assume it's local date and time.
This is by design.
