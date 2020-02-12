var Issue = require('../models/issue');

var async = require('async');

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

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
exports.issue_list = function(req, res, next) {
  Issue.find({}, 'title description').exec(function(err, list_issues) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.render('issue_list', { title: 'Issue List', issue_list: list_issues });
  });
};

// Display detail page for a specific issue.
exports.issue_detail = function(req, res) {
  async.parallel(
    {
      issue: function(callback) {
        Issue.findById(req.params.id).exec(callback);
      },
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      if (results.issue == null) {
        // No results.
        var err = new Error('Issue not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('issue_detail', {
        issue: results.issue,
      });
    }
  );
};

// Display issue create form on GET.
exports.issue_create_get = function(req, res, next) {
  // Get all authors and genres, which we can use for adding to our book.
  async.parallel(
    {
      // We'll put stuff here later
    },
    function(err, results) {
      if (err) {
        return next(err);
      }
      res.render('issue-form', { title: 'Create Issue' });
    }
  );
};

// Handle issue create on POST.
exports.issue_create_post = [
  // Validate fields.
  body('title', 'Title must not be empty.')
    .isLength({ min: 1 })
    .trim(),
  body('description', 'Description must not be empty.')
    .isLength({ min: 1 })
    .trim(),

  // Sanitize fields (using wildcard).
  sanitizeBody('*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Issue object with escaped and trimmed data.
    var issue = new Issue({
      title: req.body.title,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Show the form.
      async.parallel(
        {
          // We'll put stuff here later
        },
        function(err, results) {
          if (err) {
            return next(err);
          }
          res.render('issue-form', {
            title: 'Create Issue',
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid. Save issue.
      issue.save(function(err) {
        if (err) {
          return next(err);
        }
        //successful - redirect to new issue record.
        res.redirect(issue.url);
      });
    }
  },
];

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
