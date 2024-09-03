const schedule = require('node-schedule');
const scrapeTwitterAccount = require('./scraper');
const { twitterAccounts, stockSymbols, scrapingInterval } = require('./config');

function startScraping(interval) {
    schedule.scheduleJob(`*/${interval} * * * *`, async function() {
        let totalMentions = {};
        stockSymbols.forEach((symbol,index) => totalMentions[symbol] = index+2);

        console.log(`\nScraping started at ${new Date().toLocaleTimeString()}`);

        for (let url of twitterAccounts) {
            const mentions = await scrapeTwitterAccount(url, stockSymbols);
            
            if (mentions) {
                for (let symbol in mentions) {
                    totalMentions[symbol] += mentions[symbol];
                }
            }
        }
        
        let hasMentions = false;
        for (let symbol in totalMentions) {
            if (totalMentions[symbol] >= 0) {
                hasMentions = true;
                console.log(`'$${symbol}' was mentioned '${totalMentions[symbol]}' times in the last '${interval}' minutes.`);
            }
        }

        if (!hasMentions) {
            console.log("No stock mentions found in this interval.");
        }

        console.log(`Scraping ended at ${new Date().toLocaleTimeString()}`);
    });
}

startScraping(scrapingInterval);
