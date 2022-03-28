const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const path = require('path');
const {puppeteerConfig} = require("./puppeteer.config");

async function GoUrl(page, url) {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');
    const timeout = 10 * 1000;
    await page.goto(url, {
        timeout,
        waitUntil: 'domcontentloaded',
    }).catch(() => { });
    await injectJquery(page);
    await injectApi(page);
    return page;
}

async function injectApi(page) {
    const injected = await page
        .evaluate(() => {
            return (
                typeof window.Injetou !== 'undefined'
            );
        })
        .catch(() => false);

    if (injected) {
        return;
    }

    const filepath = path.join(__dirname, "../util/", "inject.js");
    await page.addScriptTag({
        path: require.resolve(filepath),
    });

    return await page
        .waitForFunction(
            () => {
                typeof window.Injetou !== 'undefined'
            },
            {
                timeout: 6000,
            }
        )
        .catch(() => false);
};

async function DownloadHtml(page) {
    return await ExecScript(page, 'document.body.innerHTML');
};

async function DownloadTxt(page) {
    return await ExecScript(page, 'document.body.innerText');
};

async function ExecScript(page, script) {
    return await page
        .evaluate((script) => {return eval(script)}, script);
};

async function injectJquery(page) {
    const injected = await page
        .evaluate(() => {
            return (
                typeof window.jQuery !== 'undefined'
            );
        })
        .catch(() => false);

    if (injected) {
        return;
    }

    await page.addScriptTag({
        url: process.env.JQUERY
    });

    return await page
        .waitForFunction(
            () => {
                window.jQuery !== undefined
            },
            {
                timeout: 6000,
            }
        )
        .catch(() => false);
};

async function initBrowser(session, options, logger) {
    const chromePath = getChrome();
    if (chromePath) {
        if (!options.puppeteerOptions) {
            options.puppeteerOptions = {};
        }
        options.puppeteerOptions.executablePath = chromePath;
    } else {
        logger.warn('Chrome not found, using chromium', {
            session,
            type: 'browser',
        });
    }

    // Use stealth plugin to avoid being detected as a bot
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
        headless: options.headless,
        devtools: options.devtools,
        args: options.browserArgs
            ? options.browserArgs
            : [...puppeteerConfig.chromeArgs],
        ...options.puppeteerOptions,
    });
    return browser;
}

async function getOrCreatePage(browser) {
    const pages = await browser.pages();

    if (pages.length) {
        return pages[0];
    }
    return await browser.newPage();
}

function getChrome() {
    try {
        return chromeLauncher.Launcher.getFirstInstallation();
    } catch (error) {
        return undefined;
    }
}

const defaultOptions = {
    folderNameToken: './tokens',
    headless: eval(process.env.HEADLESS),
    devtools: false,
    useChrome: true,
    debug: false,
    logQR: true,
    browserWS: '',
    browserArgs: [''],
    puppeteerOptions: {},
    disableWelcome: false,
    updatesLog: true,
    autoClose: 60000,
    createPathFileToken: true,
    waitForLogin: true,
    tokenStore: 'file',
    deviceName: false,
};

module.exports = {defaultOptions, getOrCreatePage, initBrowser, GoUrl, injectApi, injectJquery, DownloadTxt, DownloadHtml, ExecScript}
