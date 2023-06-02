const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

module.exports = multer({ storage });