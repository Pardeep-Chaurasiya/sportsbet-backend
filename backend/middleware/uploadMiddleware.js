const multer = require("multer");
const uuid = require("uuid");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const uniqueId = uuid.v4();
    // const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    // cb(null, `${file.fieldname}-${uniqueSuffix}.jpg`);
    cb(null, `${file.fieldname}-${uniqueId}.jpg`);
  },
});

const upload = multer({ storage });

module.exports = upload;
