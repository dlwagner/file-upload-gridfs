const db = require('../db');
var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Require controller modules.
var issue_controller = require('../controllers/issueController');

// GET list home page.
router.get('/', issue_controller.index);

// GET request for creating an ISSUE. NOTE This must come before routes that display ISSUE (uses id).
router.get('/issue/create', issue_controller.issue_create_get);

// @route GET /issue/filedisplay
// @desc display file attachment in new page
router.get('/issue/filedisplay/:id', issue_controller.file_display);

// @route PUT /issue/create
// @desc upload multiple files
router.post(
  '/issue/create',
  db.upload.array('file', 3),
  issue_controller.upload_files
);

// GET request for list of all Issue items.
router.get('/issues', issue_controller.issue_list);

// GET request for one Issue.
router.get('/issue/:id', issue_controller.issue_detail);

module.exports = router;
