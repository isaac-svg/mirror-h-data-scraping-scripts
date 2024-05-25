const axios = require('axios');
const cheerio = require('cheerio');
const { createObjectCsvWriter } = require('csv-writer');

async function scrapeTable() {
  const baseUrl = 'http://mirror-h.org/archive/page/';
  let currentPage = 1;
  let allData = [];

  let isFirstPage = true;
  let lastPage;
  try {
    const csvWriter = createObjectCsvWriter({
      path: 'output.csv',
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
      const response = await axios(url, {
        headers: {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'max-age=0',
          Cookie: 'PHPSESSID=16a86bcaefc15bb56df6c5a589c690cb',
          'if-none-match': 'W/"5beb-j7HA+NTniMpjK04+k8LqTBaaOHI"',

          'sec-ch-ua-mobile': '?0',

          'sec-fetch-dest': 'document',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-site': 'same-origin',
          'sec-fetch-user': '?1',
          'upgrade-insecure-requests': '1',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        },
      });
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
scrapeTable();
