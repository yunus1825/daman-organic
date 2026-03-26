import multer from "multer";

const storage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, "uploads/");
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
export const uploadMultiple = multer({ storage: storage }).array("file", 2);

export default upload;
