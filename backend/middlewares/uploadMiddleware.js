import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `audio-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg" || file.mimetype === "audio/mp3") {
    cb(null, true);
  } else {
    cb(new Error("Only MP3 files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
