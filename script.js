import { get } from 'https';
import { createWriteStream } from 'fs';
import { basename, join } from 'path';
import { load } from 'cheerio';

const url = 'https://google.com'; // replace with your URL
const downloadFolder = 'downloads'; // replace with the name of your download folder

get(url, (response) => {
  let html = '';

  response.on('data', (chunk) => {
    html += chunk;
  });
  response.on('end', () => {
    const $ = load(html);
    $('img').each((i, elem) => {
      console.log(elem);
      const imgUrl = $(elem).attr('src');
      const imgName = basename(imgUrl);
      const imgPath = join(__dirname, downloadFolder, imgName);

      get(imgUrl, (response) => {
        response.pipe(createWriteStream(imgPath));
      });
    });
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
