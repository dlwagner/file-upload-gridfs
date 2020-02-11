#! /usr/bin/env node

console.log(
  'This script populates some test issues to the database. Specified database as argument - e.g.: >sudo node populatedb mongodb+srv://<username>:<password>@cluster0-mbdj7.mongodb.net/<db-name>?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Issue = require('./models/issue');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var issues = [];

function issueCreate(title, description, cb) {
  issuedetail = {
    title: title,
    description: description,
  };

  var issue = new Issue(issuedetail);

  issue.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Issue: ' + issue);
    issues.push(issue);
    cb(null, issue);
  });
}

function createIssues(cb) {
  async.series(
    [
      function(callback) {
        issueCreate('Issue10', 'bug in machine', callback);
      },
      function(callback) {
        issueCreate('Issue2', 'bug in coffee', callback);
      },
      function(callback) {
        issueCreate('AC out', 'ac has stopped working', callback);
      },
      function(callback) {
        issueCreate(
          'process improvement',
          'update change management procedures',
          callback
        );
      },
      function(callback) {
        issueCreate('Issue1', 'racoon in garage', callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createIssues],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('Issues: ' + issues);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
