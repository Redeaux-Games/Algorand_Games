const algosdk = require('algosdk');
const environment = require('../env')


// PureStake API key. This is the Algorand server
const token = {
    'X-API-Key': process.env.API_KEY
}

const algoNet = process.env.ALGO_NET
let server = ''
algoNet === 'main' ? server = 'https://mainnet-algorand.api.purestake.io/ps2' : server = 'https://testnet-algorand.api.purestake.io/ps2'
// TODO: There are operations that require one of these servers.
// const server = 'https://testnet-algorand.api.purestake.io/ps2';
// const server = "https://testnet-algorand.api.purestake.io/idx2"
const port = '';
const client = new algosdk.Algodv2(token, server, port);
// const indexer = new algosdk.Indexer(token, 'https://testnet-algorand.api.purestake.io/idx2', port);

const waitForConfirmation = async function (algodClient, txId, timeout) {
  if (algodClient == null || txId == null || timeout < 0) {
      throw new Error("Bad arguments");
  }

  const status = (await algodClient.status().do());
  if (status === undefined) {
      throw new Error("Unable to get node status");
  }

  const startround = status["last-round"] + 1;
  let currentround = startround;

  while (currentround < (startround + timeout)) {
      const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
      if (pendingInfo !== undefined) {
          if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
              //Got the completed Transaction
              return pendingInfo;
          } else {
              if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                  // If there was a pool error, then the transaction has been rejected!
                  throw new Error("Transaction " + txId + " rejected - pool error: " + pendingInfo["pool-error"]);
              }
          }
      }
      await algodClient.statusAfterBlock(currentround).do();
      currentround++;
  }
  throw new Error("Transaction " + txId + " not confirmed after " + timeout + " rounds!");
};



const AlgoSDK = {
    getAssets: function(req, res, next) {
        // Get the address and get its information.
        (async () => {
            // console.log(await client.status().do());
            const address = req.params.addr
            const account = await client.accountInformation(address).do()
            res.status(200).json({account: account})
          })().catch((e) => {
            console.log(e);
            res.status(500).json({error: e.toString()})
          });
        // next()
    },

    asaOptIn: async function(req, res, next) {
      // (async() => {
        try {

          // Construct the transaction
          let params = await client.getTransactionParams().do();
          // comment out the next two lines to use suggested fee
          // params.fee = 1000;
          // params.flatFee = true;
  
          // receiver defined as TestNet faucet address 
          const receiver = req.params.addr;
          const enc = new TextEncoder();
          const note = enc.encode("Opt in to the NRPG Coin.");
          // This is not a clawback operation
          let revocationTarget = undefined;
          // CloseReaminerTo is set to undefined as
          // we are not closing out an asset
          let closeRemainderTo = undefined;
          let amount = 0;
          let closeout = receiver; //closeRemainderTo
          let sender = req.params.addr;
          // let txn = algosdk.makePaymentTxnWithSuggestedParams(sender, receiver, amount, undefined, note, params);
          let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, receiver,  closeRemainderTo, revocationTarget, amount, note, parseInt(req.params.asa), params);
          // WARNING! all remaining funds in the sender account above will be sent to the closeRemainderTo Account 
          // In order to keep all remaning funds in the sender account after tx, set closeout parameter to undefined.
          // For more info see: 
          // https://developer.algorand.org/docs/reference/transactions/#payment-transaction
  
          // Sign the transaction
          // const _sk = new Uint8Array(JSON.parse(req.body.sk))
          var sk = JSON.parse(req.body.sk);
          let arr = []
          for(let key in sk) {
            // console.log(key)
            arr.push(sk[key])
          }
          // var skarray = Uint8Array.from(sk)
          // const _sk = Uint8Array.of(skarray)
          const _sk = Uint8Array.from(arr)
          let signedTxn
          // Try to sign the transaction with the secret key. This can fail if we have the wrong key for whatever reason.
          try {
            signedTxn = txn.signTxn(_sk);
          } catch (err) {
            res.status(200).json({response: err.toString()})
            return next() // This prevents the rest of the script from running and instead returns with next()
          }


          let txId = txn.txID().toString();
          console.log("Signed transaction with txID: %s", txId);
  
          // Submit the transaction
          await client.sendRawTransaction(signedTxn).do();
  
          // Wait for confirmation
          let confirmedTxn = await waitForConfirmation(client, txId, 4);
          //Get the completed Transaction
          console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
          // let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2);
          // console.log("Transaction information: %o", mytxinfo);
          var string = new TextDecoder().decode(confirmedTxn.txn.txn.note);
          console.log("Note field: ", string);
          accountInfo = await client.accountInformation(req.params.addr).do();
          // console.log("Transaction Amount: %d microAlgos", confirmedTxn.txn.txn.amt);        
          // console.log("Transaction Fee: %d microAlgos", confirmedTxn.txn.txn.fee);
          // let closeoutamt = startingAmount - confirmedTxn.txn.txn.amt - confirmedTxn.txn.txn.fee;        
          // console.log("Close To Amount: %d microAlgos", closeoutamt);
          // console.log("Account balance: %d microAlgos", accountInfo.amount);
          res.status(200).json({response: "success"})
        }
        catch (err) {
            console.log("err", err);
            res.status(200).json({response: err})
        }
      }
}

module.exports = AlgoSDK