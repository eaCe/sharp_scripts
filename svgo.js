const { optimize } = require('svgo');
const fs = require('fs');
const mime = require('mime-types');
const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'inputDir',
      default: 'svg',
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

      /**
       * Check if the output directory exists
       */
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      /**
       * Loop through all the files in the input directory
       */
      for (let i = 0; i < filenames.length; i++) {
        const mimeType = mime.lookup(inputDir + filenames[i]);

        if (mimeType !== 'image/svg+xml') {
          continue;
        }

        /**
         * Read the file
         */
        const svgString = fs.readFileSync(inputDir + filenames[i], 'utf8');

        /**
         * Run the svgo optimization
         */
        const result = optimize(svgString, {
          multipass: true
        });

        /**
         * Write the optimized file to the output directory
         */
        fs.writeFileSync(outputDir + filenames[i], result.data);
      }
    });
  });
