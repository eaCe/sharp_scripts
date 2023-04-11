const sharp = require('sharp');
const fs = require('fs');
const mime = require('mime-types');
const inquirer = require('inquirer');
const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif'
];
const iconsSizes = [
    16,
    32,
    57,
    60,
    70,
    72,
    76,
    96,
    114,
    120,
    144,
    150,
    152,
    180,
    192,
    310
];

inquirer
    .prompt([
        {
            type: 'input',
            name: 'input',
            default: 'favicon.png',
            message: 'Enter the image path',
            validate: async (imagePath) => {
                if (imagePath !== '') {
                    if (!fs.existsSync(imagePath)) {
                        return 'Enter a valid image path';
                    }

                    const metadata = await sharp(imagePath).metadata();
                    const mimeType = mime.lookup(imagePath);

                    if (!allowedMimeTypes.includes(mimeType)) {
                        return `Mime type "${mimeType}" not supported`;
                    }

                    if (metadata.width < 310 || metadata.height < 310) {
                        return 'The image should have a minimum height and width of 310px '
                    }

                    return true;
                }

                return 'Enter a valid input path';
            }
        },
        {
            type: 'input',
            name: 'outputDir',
            default: 'favicon',
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
        const imagePath = answers.input;
        const outputDir = answers.outputDir + '/';

        // create output dir
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        iconsSizes.forEach(size => {
            sharp(imagePath)
                .resize(size, size, {
                    fit: 'cover',
                    withoutEnlargement: true
                })
                .toFormat('png')
                .toFile(outputDir + `favicon-${size}x${size}.png`)
                .then(info => { console.info(info); })
                .catch(error => { console.error(error); });
        })

        // TODO: create .ico file

        const faviconHTML = '' +
        '<link rel="apple-touch-icon" sizes="57x57" href="/favicon-57x57.png">\n' +
        '<link rel="apple-touch-icon" sizes="60x60" href="/favicon-60x60.png">\n' +
        '<link rel="apple-touch-icon" sizes="72x72" href="/favicon-72x72.png">\n' +
        '<link rel="apple-touch-icon" sizes="76x76" href="/favicon-76x76.png">\n' +
        '<link rel="apple-touch-icon" sizes="114x114" href="/favicon-114x114.png">\n' +
        '<link rel="apple-touch-icon" sizes="120x120" href="/favicon-120x120.png">\n' +
        '<link rel="apple-touch-icon" sizes="144x144" href="/favicon-144x144.png">\n' +
        '<link rel="apple-touch-icon" sizes="152x152" href="/favicon-152x152.png">\n' +
        '<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">\n' +
        '<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">\n' +
        '<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">\n' +
        '<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">\n' +
        '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">\n' +
        // '<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">\n' +
        // '<link rel="icon" type="image/x-icon" href="/favicon.ico">\n' +
        '<meta name="msapplication-TileColor" content="#ffffff">\n' +
        '<meta name="msapplication-TileImage" content="/favicon-144x144.png">\n' +
        '<meta name="msapplication-config" content="/browserconfig.xml">';

        fs.writeFileSync(outputDir + 'favicon.txt', faviconHTML);

        const browserConfig = '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<browserconfig>\n' +
            '\t<msapplication>\n' +
            '\t\t<tile>\n' +
            '\t\t\t<square70x70logo src="/favicon-70x70.png"/>\n' +
            '\t\t\t<square150x150logo src="/favicon-150x150.png"/>\n' +
            '\t\t\t<square310x310logo src="/favicon-310x310.png"/>\n' +
            '\t\t\t<TileColor>#ffffff</TileColor>\n' +
            '\t\t</tile>\n' +
            '\t</msapplication>\n' +
            '</browserconfig>';

        fs.writeFileSync(outputDir + 'browserconfig.xml', browserConfig);
    });
