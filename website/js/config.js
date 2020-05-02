var api = 'https://gota.kryptokrona.se/api' // Change this to your pools api, if ssl is not used its likely to be 'http://yourpooldomain.se:8117' 

var api_blockexplorer = 'https://explorer.kryptokrona.se/api' // Leave this unchanged

var poolHost = 'poolhost.com' // Change this to your pools site

var irc = 'irc.freenode.net/#poolhost' // Change this to your pools IRC channel

var email = 'support@poolhost.com' // Change this to your our pools email

var cryptonatorWidget = ['{symbol}-BTC', '{symbol}-USD', '{symbol}-EUR'] // Leave this unchanged

var easyminerDownload = 'https://github.com/zone117x/cryptonote-easy-miner/releases/' // Leave this unchanged

var blockchainExplorer = 'https://explorer.kryptokrona.se/?hash={id}#blockchain_block' // Leave this unchanged

var transactionExplorer = 'https://explorer.kryptokrona.se/?hash={id}#blockchain_transaction' // Leave this unchanged

// var themeCss = 'css/default-theme.css'

var networkStat = {
  'xkr': [
    ['pool.kryptokrona.se', 'http://pool.kryptokrona.se:8117'],
    ['pool2.kryptokrona.se', 'http://pool2.kryptokrona.se:8117'],
    ['pool3.kryptokrona.se', 'http://pool3.kryptokrona.se:8117']
    //Add your pool here to get network stats, put a comma on the ending of 
    //the line above and uncomment the line below and fill in your credentials.
    //['pooldomain', 'pool-url']
  ],
  'bip': [
    ['bip.mypool.online', 'http://bip.mypool.online:18874'],
    ['democats.org', 'http://pool.democats.org:7693'],
    ['bip.cryptonotepool.com', 'http://5.189.135.137:8121'],
    ['bip.ms-pool.net.ua', 'http://bip.ms-pool.net.ua:8117'],
    ['bip.crypto-coins.club', 'http://bip.crypto-coins.club:8118']
  ],
  'coal': [
    ['coal.mypool.online', 'http://coal.mypool.online:7704'],
    ['democats.org', 'http://pool.democats.org:7703']
  ],
  'dsh': [
    ['dsh.mypool.online', 'http://dsh.mypool.online:29084'],
    ['democats.org', 'http://pool.democats.org:7613']
  ],
  'fcn': [
    ['fcn.mypool.online', 'http://fcn.mypool.online:24084']
  ],
  'krb': [
    ['krb.mypool.online', 'http://krb.mypool.online:32351'],
    ['democats.org', 'http://pool2.democats.org:7673'],
    ['pool.karbowanec.com', 'http://pool.karbowanec.com:8117'],
    ['pool2.karbowanec.com', 'http://pool2.karbowanec.com:8117'],
    ['krb.sberex.com', 'http://krb.sberex.com:7006'],
    ['krb.crypto-coins.club', 'http://krb.crypto-coins.club:8118'],
    ['krb.cryptonotepool.com', 'http://5.189.135.137:8618'],
    ['krbpool.ml', 'http://krbpool.ml:8117']
  ],
  'qcn': [
    ['qcn.mypool.online', 'http://qcn.mypool.online:23084']
  ],
  'xci': [
    ['xci.mypool.online', 'http://xci.mypool.online:42004'],
    ['xci.cryptonotepool.com', 'http://5.189.135.137:8119']
  ]
}