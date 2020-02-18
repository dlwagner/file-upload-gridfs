const mongoose = require('mongoose');

const { Schema } = mongoose;

const IssueSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 200 },
  fileID: { type: [Schema.Types.ObjectId] },
});

// Virtual for book's URL
IssueSchema.virtual('url').get(function() {
  return '/list/issue/' + this._id;
});

module.exports = mongoose.model('Issue', IssueSchema);
