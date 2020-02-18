var express = require('express');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');

dotenv.config();

// Set up mongoose connection
const mongoDB = process.env.DB_URL;

const conn = mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.Promise = global.Promise;
const dbInstance = mongoose.connection;

/*let gfs;

dbInstance.once('open', () => {
  gfs = Grid(dbInstance.db, mongoose.mongo);
  gfs.collection('fileUploads');
});*/
const gfs = { grid: undefined };

dbInstance.once('open', () => {
  gfs.grid = Grid(dbInstance.db, mongoose.mongo);
  gfs.grid.collection('fileUploads');
});

const storage = new GridFsStorage({
  //url: mongoDB,
  db: dbInstance,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(32, (err, buff) => {
        if (err) return reject(err);
        const filename = buff.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'fileUploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

var upload = multer({ storage });

module.exports = {
  dbInstance,
  upload,
  gfs,
};
