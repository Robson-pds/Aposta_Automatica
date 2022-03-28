require('dotenv').config();
const {create} = require('./lib/initializer');
const {injectApi, injectJquery, GoUrl, ExecScript, DownloadHtml} = require('./lib/browser');
const JSSoup = require('jssoup').default;

async function Iniciar(){
    const t = await create(null, null);
    await GoUrl(t, 'https://www.google.com.br/');
    const texto = await DownloadHtml(t);
    const soup = new JSSoup(texto);

    console.log(soup.find('a'));
}

Iniciar();




