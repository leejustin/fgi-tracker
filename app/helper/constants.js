var nconf = require('nconf');
nconf.argv().env().file('./config/keys.json');

let constants = {
    fgiUrl: 'http://money.cnn.com/data/fear-and-greed/',
    cron: {
        marketOpen: '0 14 * * 1-5',
        marketHalf: '0 17 * * 1-5',
        marketClose: '30 20 * * 1-5'
    },
    db: {
        automation: {
            user: nconf.get('mongoUser'),
            pass: nconf.get('mongoPass'),
            host: nconf.get('mongoHost'),
            port: nconf.get('mongoPort'),
            db:   nconf.get('mongoDatabase')
        }
    }
}

module.exports = Object.freeze(constants);