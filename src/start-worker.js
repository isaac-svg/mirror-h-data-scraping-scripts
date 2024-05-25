const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const baseUrl = 'http://mirror-h.org/archive/page/';
  let currentPage = 1;
  let isFirstPage = true;
  let lastPage;

  const worker = new Worker('./scrape.js');
  worker.on('message', (message) => {
    currentPage = message.currentPage;
    isFirstPage = message.isFirstPage;
    lastPage = message.lastPage;

    if (currentPage <= lastPage) {
      worker.postMessage({ baseUrl, currentPage, isFirstPage, lastPage });
    } else {
      console.log('Scraping completed!');
    }
  });
  worker.postMessage({ baseUrl, currentPage, isFirstPage, lastPage });
} else {
  console.log('Worker thread initialized');
}
