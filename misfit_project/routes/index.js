var express = require("express");
var router = express.Router();

const fs=require('fs');
let routes=fs.readdirSync("./routes");

router.use("/home",require('./home'));
router.use("/",require("./home"));

for(let route of routes){

  if(route.includes(".js") && route != 'index.js'){
    router.use("/"+route.replace(".js",""),require('./'+route));
  }  //TODO:olmayan bir endpointe gelen isteklerin karşılanması eksiliği giderilecek.
}

module.exports = router;