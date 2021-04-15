const puppy = require("puppeteer");
const $ = require('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url = 'https://www.amazon.in/Boat-Rockerz-510-Bluetooth-Headphones/dp/B0749D4QM9/';


//for other products , customised
//const search = "" ; url = ""; 
// let browserPromise = puppeteer.launch({
//   headless: false,
//   defaultViewport: false,
// });


async function selector(){
    let browser = await puppy.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
    });

    let tabs = await browser.pages();
    let tab = tabs[0];

    await tab.goto(url);
    
    await tab.waitForSelector("#priceblock_dealprice", {visible : true});
    let dataTag = await tab.$$("#priceblock_dealprice");
    
    let Price = await tab.evaluate(function(ele){
            return ele.textContent;
    },dataTag[0]);

    
    console.log(Price);
    
    let currentPrice = Number(Price.replace(/[^0-9.-]+/g,""));
    if (currentPrice < 2000) {
      console.log("BUY!!!! " + currentPrice);
      sendNotification(currentPrice);
  }

  return tab;

}

async function startTracking() {
  const page = await selector();

  let job = new CronJob('* */30 * * * *', function() { //runs every 30 minutes in this config
    //checkPrice(page);
  }, null, true, null, null, true);
  job.start();
}

async function sendNotification(currentPrice) {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mercifulgamer.399@gmail.com',
      pass: 'password'
    }
  });
  let textToSend = 'Price dropped to ' + currentrice;
  let htmlText = `<a href=\"${url}\">Link</a>`;

  let info = await transporter.sendMail({
    from: '"Price Tracker" <mercifulgamer.399@gmail.com>',
    to: "simarpreetsingh.019@gmail.com",
    subject: 'Price dropped to ' + currentPrice, 
    text: textToSend,
    html: htmlText
  });

  console.log("Message sent: %s", info.messageId);
}

startTracking();
