const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileUploadSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 200 },
});

module.exports = mongoose.model('FileUpload', FileUploadSchema);
