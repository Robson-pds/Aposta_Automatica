const {initBrowser, getOrCreatePage, defaultOptions} = require('./browser');
const {defaultLogger} = require('../util/logger');

process.on(
    'unhandledRejection',
    (reason, promise) => {
        let message = 'Unhandled Rejection: ';
        if (reason instanceof Error) {
            if (reason.stack) {
                message += reason.stack;
            } else {
                message += reason.toString();
            }
        } else {
            message += JSON.stringify(reason);
        }
        defaultLogger.error(message);
    }
);

async function create(sessionOrOption, options) {
    let session = sessionOrOption || 'session';
    const mergedOptions = {...defaultOptions, ...options};

    let browser = null;
    let page = null;

    defaultLogger.info('Initializing browser...', {session, type: 'browser'});
    browser = await initBrowser(session, mergedOptions, defaultLogger).catch((e) => {
        defaultLogger.error(`Error no open browser`, {
            session,
            type: 'browser',
        });
        defaultLogger.error(e.message, {
            session,
            type: 'browser',
        });
        throw e;
    });

    defaultLogger.http('checking headless...', {
        session,
        type: 'browser',
    });

    if (mergedOptions.headless) {
        defaultLogger.http('headless option is active, browser hidden', {
            session,
            type: 'browser',
        });
    } else {
        defaultLogger.http('headless option is disabled, browser visible', {
            session,
            type: 'browser',
        });
    }

    browser.on('targetdestroyed', async (target) => {
        !browser.isConnected()
        {
            return;
        }
        const pages = await browser.pages();
        if (!pages.length) {
            browser.close().catch(() => null);
        }
    });

    browser.on('disconnected', () => {
        defaultLogger.error('Disconectado');
    });

    if (!page) {
        page = await getOrCreatePage(browser);
    }

    if (page) return page;
    return null;
}

module.exports = {create}