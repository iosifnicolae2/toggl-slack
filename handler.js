'use strict';

var qs = require('qs');
var TogglClient = require('toggl-api');

var START_COMMAND = "start";
var STOP_COMMAND = "stop";


module.exports.info = (event, context, callback) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            event: event,
            context: context,
        }),
    };

    callback(null, response);
};


module.exports.slack = (event, context, callback) => {
    var toggl = new TogglClient({
        apiToken: event.queryStringParameters.apiToken
    });
    var data = qs.parse(event.body);
    // TODO add user validation

    if (data.text.indexOf(START_COMMAND) == 0) {
        var description = data.text.split(START_COMMAND + " ")[1];
        var words = data.text.split(" ")
        var searchProject = words[words.length - 1];

        toggl.getUserData({'with_related_data':true}, function(err, userData) {
          console.log(userData)
          var matched_project = userData.projects.filter(
            project => (project.name.toLowerCase()).indexOf(searchProject.toLowerCase()) >=0 
            );
          console.log(matched_project);
          if(matched_project.length != 1) {
              const response = {
                  statusCode: 200,
                  body: JSON.stringify({
                      err: 'Can\'t identify project!'
                  }),
              };

              callback(null, response);
            return;
          }

          toggl.startTimeEntry({
              pid: matched_project[0].id,
              description: description,
              billable: true
          }, function(err, timeEntry) {
              const response = {
                  statusCode: 200,
                  body: JSON.stringify({
                      err: err,
                      timeEntry: timeEntry
                  }),
              };

              callback(null, response);
          });
          // TODO in the future we can implement a button to stop this entry.

        });

    } else if (data.text.indexOf(STOP_COMMAND) == 0) {
        var active_entry_id = 0;
        toggl.getCurrentTimeEntry(function(err, timeEntry) {
            if (err) {
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        err: err,
                    })
                };
                callback(null, response);
                return;
            }
            toggl.stopTimeEntry(timeEntry.id, function(err) {

                const response = {
                    statusCode: 200,
                    body: JSON.stringify({
                        err: err,
                    })
                };
                callback(null, response);
            });
        });

    } else {
        const response = {
            statusCode: 200,
            body: "Unknown command!",
        };

        callback(null, response);
    }
};