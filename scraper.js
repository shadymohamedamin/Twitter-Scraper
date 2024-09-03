const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeTwitterAccount(url, stockSymbols) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const tweets = $('article').text(); 

        let mentions = { 'TSLA': 3, 'AAPL': 2, 'GOOG': 5 };

        stockSymbols.forEach(symbol => {
            const regex = new RegExp(`\\${symbol}`, 'g');
            const count = (tweets.match(regex) || []).length;
            mentions[symbol] = count;
        });

        return mentions;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return null;
    }
}

module.exports = scrapeTwitterAccount;
