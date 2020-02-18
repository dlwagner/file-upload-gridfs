const db = require('../db');
const express = require('express');
const mongoose = require('mongoose');
const Issue = require('../models/issue');
const async = require('async');
let fileIds = [];

const { body, validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');

// Get Home Page
exports.index = function(req, res) {
  async.parallel(
    {
      issue_count: function(callback) {
        Issue.countDocuments({}, callback);
      },
    },
    function(err, results) {
      res.render('index', {
        title: 'Home Page',
        error: err,
        data: results,
      });
    }
  );
};

// All Issue Page: Display list of all issues.
exports.issue_list = function(req, res, next) {
  Issue.find({}, 'title description').exec(function(err, list_issues) {
    if (err) {
      return next(err);
    }
    //Successful, so render
    res.render('issue_list', { title: 'All Issues', issue_list: list_issues });
  });
};

// Get detail page: Display detail page for a specific issue.
exports.issue_detail = function(req, res, next) {
  async.parallel(
    {
      issue: function(callback) {
        Issue.findById(req.params.id)
          .populate('files')
          .exec(callback);
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
        files: results.files,
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
      res.render('issue-form', { title: 'Create New Issue' });
    }
  );
};

exports.upload_files = function(req, res) {
  if (req.files.length === 0) {
    var issue = new Issue({
      title: req.body.title,
      description: req.body.description,
    });
  } else if (req.files.length === 1) {
    var issue = new Issue({
      title: req.body.title,
      description: req.body.description,
      fileID: req.files[0].id,
    });
  } else {
    for (let i = 0; i < req.files.length; i++) {
      fileIds[i] = req.files[i].id;
      //console.log('req.files.id: ' + req.files[i].id);
    }
    var issue = new Issue({
      title: req.body.title,
      description: req.body.description,
      fileID: fileIds,
    });
  }
  issue.save();
  res.redirect('/list/issues');
};

// Display image
exports.file_display = function(req, res) {
  db.gfs.grid.files.findOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    (err, file) => {
      //res.contentType(file.contentType);
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists',
        });
      }
      const readstream = db.gfs.grid.createReadStream(file._id);
      readstream.pipe(res);
    }
  );
};

// Keep this, I may need it later
/*
// POST form data to DB. Handle issue create on POST.
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
      //fileID: req.file._id,
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
            title: 'Create New Issue',
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
*/
