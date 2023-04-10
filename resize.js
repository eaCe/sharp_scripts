const sharp = require('sharp');
const fs = require('fs');
const mime = require('mime-types');

const inputDir = 'images/';
const outputDir = inputDir + 'output/';
const resizeOptions = {
  maxWidth: 1920,
  maxHeight: 1920
};
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif'
];

fs.readdir(inputDir, function (error, filenames) {
  if (error) {
    console.error(error);
    return;
  }

  // create output dir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (let i = 0; i < filenames.length; i++) {
    const mimeType = mime.lookup(inputDir + filenames[i]);

    if (!allowedMimeTypes.includes(mimeType)) {
      continue;
    }

    sharp(inputDir + filenames[i])
      .resize(resizeOptions.maxWidth, resizeOptions.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .sharpen({ sigma: 0.5 })
      .toFile(outputDir + filenames[i])
      .then(info => { console.info(info); })
      .catch(error => { console.error(error); });
  }
});