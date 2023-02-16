import fetch from 'node-fetch';
import { load } from 'cheerio';
import { createWriteStream } from 'fs';
import { basename, join } from 'path';

const websiteUrl = 'https://www.github.com';
const downloadDir = './downloads';

fetch(websiteUrl)
  .then(response => response.text())
  .then(html => {
    const $ = load(html);
    const imageUrls = $('img').map((i, el) => $(el).attr('src')).get();

    imageUrls.forEach(url => {
      const filename = basename(url);
      const filepath = join(downloadDir, filename);
      const file = createWriteStream(filepath);

      fetch(url).then(response => {
        response.body.pipe(file);
      });
    });
  })
  .catch(error => {
    console.error(error);
  });