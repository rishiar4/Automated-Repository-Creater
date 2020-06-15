let puppeteer = require("puppeteer");
let fs = require("fs");

let credentialsFile = process.argv[2];

// let toSearchItem = process.argv[3];

let fileDetails = process.argv[3];

//Search User Command and Follow ==>> node script.js credentials.json rishiar4

(async function () {
    try {
        let data = await fs.promises.readFile(credentialsFile, "utf-8");
        let data2 = await fs.promises.readFile(fileDetails, "utf-8");

        let credentials = JSON.parse(data);
        let repoData = JSON.parse(data2);

        let url = credentials.url;
        let email = credentials.email;
        let pwd = credentials.pwd;
        let username = credentials.username;

        let RepoName = repoData.repo_name;
        let Description = repoData.description;


        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized", "--icognito", "--disable-notifications"]
        });

        let numberOfPages = await browser.pages();
        let tab = numberOfPages[0];

        await tab.goto(url, {
            waitUntil: "networkidle2"
        });

        await tab.waitForSelector("input[autocomplete='username']");
        await tab.type("input[autocomplete='username']", email, { delay: 200 });

        await tab.waitForSelector("input[autocomplete='current-password']");
        await tab.type("input[autocomplete='current-password']", pwd, { delay: 200 });

        await tab.waitForSelector(".btn.btn-primary.btn-block");
        await tab.click(".btn.btn-primary.btn-block");

        // await tab.waitForSelector(".Header-link");
        // await tab.click(".Header-link");
        await tab.waitForSelector(".form-control.input-sm.header-search-input.jump-to-field.js-jump-to-field.js-site-search-focus");
        let cUrl = await tab.url();
        // console.log(cUrl);

        let newPUrl = cUrl + 'new';

        await tab.goto(newPUrl, { waitUntil: "networkidle2" });

        // console.log(newPUrl);



        await tab.waitForSelector(".form-control.js-repo-name.js-repo-name-auto-check.short");
        await tab.type(".form-control.js-repo-name.js-repo-name-auto-check.short", RepoName);

        await tab.waitForSelector(".form-control.long");
        await tab.type(".form-control.long", Description, { delay  : 600});

        await tab.waitForSelector('#repository_auto_init');
        await tab.click('#repository_auto_init');

        await tab.waitForSelector("button[data-disable-with='Creating repository…']", { visible: true });
        await tab.click("button[data-disable-with='Creating repository…']");

        await tab.waitForSelector(".btn.btn-sm.ml-2.btn-primary", { visible : true});
        await tab.click(".btn.btn-sm.ml-2.btn-primary");

        let cLink = `https://github.com/${username}/${RepoName}.git`;
        console.log(cLink);
        https://github.com/rishiar4/CLI-Interface.git
        await tab.close();
        
    }
    catch (err) {
        console.log(err.message);
    }
})();
async function navigationHelper(tab, selector) {
    await Promise.all([tab.waitForNavigation({
        waitUntil: "networkidle2"
    }), tab.click(selector)]);
}

async function searchInRepo(tab, data) {
    console.log("Starting to Search");

    await tab.waitForSelector(".form-control.input-sm.header-search-input.jump-to-field.js-jump-to-field.js-site-search-focus");
    await tab.type(".form-control.input-sm.header-search-input.jump-to-field.js-jump-to-field.js-site-search-focus", toSearchItem, { delay: 200 });

    await tab.keyboard.press("Enter");

}
