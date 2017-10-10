const puppeteer = require('puppeteer');
const chalk = require('chalk');
const results = [];
let i = 1;

const processResults = results =>
    results.reduce((acc, result) => {
      return acc + result;
    } ,0) / results.length;

(async () => {
  async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('console', async result => {
      if(typeof result === 'number'){
        results.push(result);
        await browser.close();
        if(i >= 100){
          console.log(`Average Time: ${processResults(results)}ms 😏`)
        } else {
          process.stdout.write(` Complete ${chalk.green(`%${i}`)}\r`);
          i++;
          // console.log('count: %d', i);process.stdout.write(`%${i}`);
          await run();
        }
      }
    });
    await page.goto('http://localhost:3000', {
      timeout: 3000000
    });
  }
  await run();
})();
