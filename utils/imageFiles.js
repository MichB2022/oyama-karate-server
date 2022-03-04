const fs = require('fs');
const path = require('path');

const checkIfFileIsImage = (files) => {
  for (const file of files) {
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  }
};

const deleteFiles = (filePaths) => {
  for (const path of filePaths) {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  }
};

const uploadFiles = (filePath, id, files) => {
  files.forEach((file, index) => {
    file.name = `photo_${id}_${index}${path.parse(file.name).ext}`;

    file.mv(`${filePath}${file.name}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload: ${err}`, 500));
      }
    });
  });
};

module.exports = { checkIfFileIsImage, deleteFiles, uploadFiles };
