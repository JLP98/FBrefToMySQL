const puppeteer = require("puppeteer");
const fs = require("fs");
const dataFolder = "/home/jp/Documents/Data/";
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await getStats(process.env.SHOOTING_TABLE, page);
    await getStats(process.env.PASSING_TABLE, page);
    await getStats(process.env.PASSING_TYPES_TABLE, page);
    await getStats(process.env.CREATIVE_ACTIONS_TABLE, page);
    await getStats(process.env.DEFENCE_TABLE, page);
    await getStats(process.env.POSSESSION_TABLE, page);
    await getStats(process.env.MISCELLANEOUS_TABLE, page);
    await browser.close();
})();

async function getStats(type, page) {
    fs.writeFile(`${dataFolder}${type}.csv`, "", function (err) {
        if (err) return console.log(err);
    });
    console.log(type);
    await page.goto(`https://fbref.com/en/comps/Big5/${type}/players/Big-5-European-Leagues-Stats`);
    const togglePer90 = `#stats_${type}_per_match_toggle`;
    let openCSV = `#all_stats_${type} > div:nth-child(1) > div:nth-child(3) > ul:nth-child(1) > li:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(4) > button:nth-child(1)`;
    if (type === "possession" || type === "passing_types") {
        openCSV = `.sidescroll_note > ul:nth-child(1) > li:nth-child(1) > div:nth-child(2) > ul:nth-child(1) > li:nth-child(4) > button:nth-child(1)`;
    }
    await page.evaluate((togglePer90) => {
        document.querySelector(togglePer90).click();
    }, togglePer90);
    await page.evaluate((openCSV) => {
        document.querySelector(openCSV).click();
    }, openCSV);
    const fullContents = await page.evaluate((type) => {
        let stats = String(document.querySelector(`#csv_stats_${type}`).textContent);
        return stats;
    }, type);
    const splitter = fullContents.split(",\n");
    fs.appendFile(
        `${dataFolder}${type}.csv`,
        `${splitter[1]}`,
        function (err) {
            if (err) return console.log(err);
        }
    );
}