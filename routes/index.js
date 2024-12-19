var express = require('express');
var router = express.Router();
var stlController = require('../controllers/stlController.js');
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: path.join(__dirname, "../uploads") });

router
  .route("/")
  .post(upload.single("file"), stlController.calculateSTL);


module.exports = router;
