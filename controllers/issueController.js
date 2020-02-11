var Issue = require('../models/issue');

var async = require('async');

exports.index = function(req, res) {
  async.parallel(
    {
      issue_count: function(callback) {
        Issue.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
    },
    function(err, results) {
      res.render('index', {
        title: 'Issues Home',
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all issues.
exports.issue_list = function(req, res) {
  res.send('NOT IMPLEMENTED: issue list');
};

// Display detail page for a specific issue.
exports.issue_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Issue detail: ' + req.params.id);
};

// Display issue create form on GET.
exports.issue_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: issue create GET');
};

// Handle issue create on POST.
exports.issue_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Issue create POST');
};

// Display issue delete form on GET.
exports.issue_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Issue delete GET');
};

// Handle issue delete on POST.
exports.issue_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Issue delete POST');
};

// Display issue update form on GET.
exports.issue_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Issue update GET');
};

// Handle issue update on POST.
exports.issue_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Issue update POST');
};
