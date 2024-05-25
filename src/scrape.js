const axios = require('axios');
const cheerio = require('cheerio');
const { parentPort } = require('worker_threads');
const { createObjectCsvWriter } = require('csv-writer');

async function scrapeTable(baseUrl, currentPage, isFirstPage, lastPage) {
  let allData = [];
  try {
    const csvWriter = createObjectCsvWriter({
      path: '../output-2.csv',
      header: [
        { id: 'Attacker', title: 'Attacker' },
        { id: 'Country', title: 'Country' },
        { id: 'URL', title: 'URL' },
        { id: 'IP', title: 'IP' },
        { id: 'Date', title: 'Date' },
      ],
    });
    while (true) {
      const url = `${baseUrl}${currentPage}`;
      const response = await axios(url);
      const $ = cheerio.load(response.data);

      $('table tbody tr').each((index, element) => {
        const rowData = {
          ['Attacker']: $(element).find('td:nth-child(1)').text(),
          ['Country']: $(element).find('td:nth-child(2)').text(),
          ['URL']: $(element).find('td:nth-child(3)').text(),
          ['IP']: $(element).find('td:nth-child(4)').text(),
          ['Date']: $(element).find('td:nth-child(5)').text(),
        };
        allData.push(rowData);
      });
      await csvWriter.writeRecords(allData);
      allData = [];
      console.log('PAGE: ', currentPage);
      if (isFirstPage) {
        const pageAsArray = $('a[title="Last"]').attr('href').split('/');
        const pagination = pageAsArray[pageAsArray.length - 1];
        lastPage = Number(pagination);
        isFirstPage = false;
      }
      currentPage++;
      if (currentPage > lastPage) {
        break;
      }
    }
  } catch (error) {
    console.log(error.message, 'error message');
  }
}

parentPort.on('message', async (message) => {
  const { baseUrl, currentPage, isFirstPage, lastPage } = message;
  await scrapeTable(baseUrl, currentPage, isFirstPage, lastPage);
});
