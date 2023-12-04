const sharp = require('sharp');
const fs = require('fs');
const mime = require('mime-types');
const inquirer = require('inquirer');

/**
 * Allowed mime types
 */
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif'
];

inquirer
  .prompt([
    {
      type: 'input',
      name: 'inputDir',
      default: 'images',
      message: 'Enter a input path',
      validate: (value) => {
        if (value !== '') {

          /**
           * Check if the input path exists
           */
          if (!fs.existsSync(value)) {
            return 'Enter a valid input path';
          }

          return true;
        }

        return 'Enter a valid input path';
      }
    },
    {
      type: 'input',
      name: 'outputDir',
      default: 'output',
      message: 'Enter a output directory name',
      validate: (value) => {
        if (value === '') {
          return 'Enter a valid output directory name';
        }

        return true;
      }
    },
    {
      type: 'number',
      name: 'maxWidth',
      default: 1920,
      message: 'Enter a maximum width',
      validate: (value) => {
        if (value !== '') {
          if (isNaN(value)) {
            return 'Enter a valid maximum width';
          }

          return true;
        }
      }
    },
    {
      type: 'number',
      name: 'maxHeight',
      default: 1920,
      message: 'Enter a maximum height',
      validate: (value) => {
        if (value !== '') {
          if (isNaN(value)) {
            return 'Enter a valid maximum height';
          }

          return true;
        }
      }
    },
  ])
  .then(answers => {
    const inputDir = answers.inputDir + '/';
    const outputDir = inputDir + answers.outputDir + '/';

    fs.readdir(inputDir, (error, filenames) => {
      if (error) {
        console.error(error);
        return;
      }

      /**
       * Check if the output directory exists
       */
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      /**
       * Loop through the filenames array
       */
      for (let i = 0; i < filenames.length; i++) {
        const mimeType = mime.lookup(inputDir + filenames[i]);

        /**
         * Check if the mime type is allowed
         */
        if (!allowedMimeTypes.includes(mimeType)) {
          continue;
        }

        /**
         * Resize the image
         */
        sharp(inputDir + filenames[i])
          .resize(answers.maxWidth, answers.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .sharpen({ sigma: 0.5 })
          .toFile(outputDir + filenames[i])
          .then(info => { console.info(info); })
          .catch(error => { console.error(error); });
      }
    });
  });
