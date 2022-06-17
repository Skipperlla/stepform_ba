import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    req.savedImage = "image_" + "." + extension;
    cb(null, req.savedImage);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

  // if (!allowedTypes.includes(file.mimetype)) {
  //   return cb(new CustomError("Please provide a valid image file", 400), false);
  // }
  return cb(null, true);
};

const photoUpload = multer({ storage, fileFilter });

export default photoUpload;
