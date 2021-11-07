const algosdk = require('algosdk');
const environment = require('../env')


// PureStake API key. This is the Algorand server
const token = {
    'X-API-Key': process.env.API_KEY
}
const server = 'https://testnet-algorand.api.purestake.io/ps2';
// const server = "https://testnet-algorand.api.purestake.io/idx2"
const port = '';
const client = new algosdk.Algodv2(token, server, port);
// const indexer = new algosdk.Indexer(token, 'https://testnet-algorand.api.purestake.io/idx2', port);



const AlgoSDK = {
    checkAssets: function(req, res, next) {
        // Get the address and get its information.
        (async () => {
            // console.log(await client.status().do());
            const address = req.params.account
            const account = await client.accountInformation(address).do()
            res.status(200).json({account: account})

          })().catch((e) => {
            console.log(e);
            res.status(500).json({error: e.toString()})
          });


        // next()
    }
}

module.exports = AlgoSDK