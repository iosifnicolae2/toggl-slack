# toggl-slack
Start/stop Toggl from Slack

#### Setup AWS credentials 
http://bit.ly/aws-creds-setup

#### Deploy function on AWS Lambda
```
serverless deploy
```

#### Configure Slack app
##### Create a Slack bot
https://api.slack.com/apps?new_app=1
##### Configure a Slack `Slash Command`
Insert your AWS Lambda endpoint in `Request URL` field.
Example:
```
https://xxxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/slack?apiToken=<paste_slack_api_token>
```

#### Test
Type on Slack
```
/toggl start My first task ProjectName
```
