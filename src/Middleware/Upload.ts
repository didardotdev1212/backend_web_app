import multer from "multer";

const config = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const prefix = Date.now() + "-";
    cb(null, prefix + file.originalname);
  },
});

const upload = multer({ storage: config });
export default upload;
