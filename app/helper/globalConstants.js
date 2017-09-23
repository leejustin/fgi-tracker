module.exports = function() {

    /*
    const nconf = require('nconf');
    
    nconf.argv().env().file('./config/keys.json');
    const user = nconf.get('mongoUser');
    const pass = nconf.get('mongoPass');
    const host = nconf.get('mongoHost');
    const port = nconf.get('mongoPort');
    
    //let uri = `mongodb://${user}:${pass}@${host}:${port}`;
    let uri = `mongodb://${host}:${port}`;
    if (nconf.get('mongoDatabase')) {
      uri = `${uri}/${nconf.get('mongoDatabase')}`;
    }
    
    */
    console.log("constants run");
    this.fgiUrl = function() {
        return 'http://money.cnn.com/data/fear-anfd-greed/';
    }

    return this;
}