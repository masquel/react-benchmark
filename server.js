require("events").EventEmitter.defaultMaxListeners = Infinity;
const puppeteer = require("puppeteer");
const chalk = require('chalk');
const { groupBy, flatten, meanBy, map, sortBy } = require("lodash");
const ITERATIONS = 100;
const SITE = "http://localhost:3000";
const results = [];

const medianBy = (results, key) =>
  sortBy(results, result => result[key])[Math.floor(results.length / 2)][key];

const processResults = results =>
  map(groupBy(flatten(results), "name"), (mark, name) => [
    name,
    meanBy(mark, "startTime").toFixed(2),
    medianBy(mark, "startTime").toFixed(2),
    meanBy(mark, "duration").toFixed(2),
    medianBy(mark, "duration").toFixed(2)
  ]);

try {
  puppeteer
  .launch({headless: false})
  .then(async browser => {
    let i = 0;
    const page = await browser.newPage();
    await page.exposeFunction("onRenderCompletion", async result => {
      if (i < ITERATIONS) {
        process.stdout.write(` Complete ${chalk.green(`%${i}`)}\r`);
        i++;
        results.push(result);
        await page.reload();
      } else {
        var Table = require("cli-table");
        var table = new Table({
          head: [
            "Event Name",
            "Mean Start Time",
            "Median Start Time",
            "Mean Duration",
            "Median Duration"
          ],
          colWidths: [40, 20, 20, 20, 20]
        });

        table.push(...processResults(results));

        console.log(`Loaded ${SITE} to Render Completion ${ITERATIONS} times.`);
        console.log(table.toString());
        await page.close();
        await browser.close();
      }
    });
    await page.goto(SITE, { timeout: 3000000 });
  })
  .catch((err) => {
    console.error("Error", chalk.red(err));
  });
} catch(e){
  console.error(e);
}  