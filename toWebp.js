const sharp = require('sharp');
const fs = require('fs');
const mime = require('mime-types');
const inquirer = require('inquirer');
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
  ])
  .then(answers => {
    const inputDir = answers.inputDir + '/';
    const outputDir = inputDir + answers.outputDir + '/';

    fs.readdir(inputDir, (error, filenames) => {
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
          .webp()
          .toFile(outputDir + filenames[i].replace(/\.[^/.]+$/, '') + '.webp')
          .then(info => { console.info(info); })
          .catch(error => { console.error(error); });
      }
    });
  });
