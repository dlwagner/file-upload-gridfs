const db = require('../db');
const Issue = require('../models/issue');
var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
let fileIds = [];

dotenv.config();

// Require controller modules.
var issue_controller = require('../controllers/issueController');

// GET list home page.
router.get('/', issue_controller.index);

// GET request for creating an ISSUE. NOTE This must come before routes that display ISSUE (uses id).
router.get('/issue/create', issue_controller.issue_create_get);

// @route PUT /issue/create
// @desc upload multiple files
router.post('/issue/create', db.upload.array('file', 3), (req, res) => {
  //res.json({ file: req.files });

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
});

// GET request for list of all Issue items.
router.get('/issues', issue_controller.issue_list);

// GET request for one Issue.
router.get('/issue/:id', issue_controller.issue_detail);

/*
// GET request to delete Issue.
router.get('/issue/:id/delete', issue_controller.issue_delete_get);

// POST request to delete Issue.
router.post('/issue/:id/delete', issue_controller.issue_delete_post);

// GET request to update Issue.
router.get('/issue/:id/update', issue_controller.issue_update_get);

// POST request to update Issue.
router.post('/issue/:id/update', issue_controller.issue_update_post);

*/

module.exports = router;
