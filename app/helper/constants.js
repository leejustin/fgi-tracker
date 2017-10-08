var nconf = require('nconf');
nconf.argv().env().file('./config/keys.json');

let constants = {
    fgiUrl: 'http://money.cnn.com/data/fear-and-greed/',
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