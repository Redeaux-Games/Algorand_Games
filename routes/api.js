var express = require('express');
var router = express.Router();
const algosdk = require('algosdk');
// const { default: JSONRequest } = require('algosdk/dist/types/src/client/v2/jsonrequest');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({res: 'respond with a resource'});
});

router.post('/connect', function(req, res, next) {

  (async() => {
    // try {
      const sk = algosdk.mnemonicToSecretKey(req.body.mnemonic)
      res.json({sk: sk})
  

  })().catch(e => {
    res.json({error: e.toString()})
  })


});

module.exports = router;