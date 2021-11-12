var express = require('express');
var router = express.Router();
const algosdk = require('algosdk');
const AlgoMiddleWare = require('../bin/middleware/AlgoSDK')


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

router.get('/assets/:addr', AlgoMiddleWare.getAssets, function(req, res, next) {
  res.json({assets: "This is a test."})
});

router.post('/assets/:addr/opt-in/:asa', AlgoMiddleWare.asaOptIn, function(req, res, next) {
  // this should be handled in the AlgoMiddleWare.optedIn
})

module.exports = router;