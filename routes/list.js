var express = require('express');
var router = express.Router();

// Require controller modules.
var issue_controller = require('../controllers/issueController');

/// ISSUE ROUTES ///

// GET list home page.
router.get('/', issue_controller.index);

// GET request for creating an ISSUE. NOTE This must come before routes that display ISSUE (uses id).
router.get('/issue/create', issue_controller.issue_create_get);

// POST request for creating Issue.
router.post('/issue/create', issue_controller.issue_create_post);

// GET request to delete Issue.
router.get('/issue/:id/delete', issue_controller.issue_delete_get);

// POST request to delete Issue.
router.post('/issue/:id/delete', issue_controller.issue_delete_post);

// GET request to update Issue.
router.get('/issue/:id/update', issue_controller.issue_update_get);

// POST request to update Issue.
router.post('/issue/:id/update', issue_controller.issue_update_post);

// GET request for one Issue.
router.get('/issue/:id', issue_controller.issue_detail);

// GET request for list of all Issue items.
router.get('/issues', issue_controller.issue_list);

module.exports = router;
