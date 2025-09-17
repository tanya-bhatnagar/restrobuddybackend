var express = require('express');
var router = express.Router();
var pool=require("./pool")
/* GET home page. */
router.get('/fetch_all_state', function(req, res, next) {
  try
  {
    pool.query("Select * from states",function(error,result){
     if(error)
     {
        res.status(500).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
     }
     else
     {
        res.status(200).json({data:result,message:'Successfull..',status:true})
     }


    })

  }
  catch(e)
  {

    res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});


router.post('/fetch_all_city', function(req, res, next) {
  try
  {
    pool.query("Select * from cities where stateid=?",[req.body.stateid],function(error,result){
     if(error)
     {
        res.status(500).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
     }
     else
     {
        res.status(200).json({data:result,message:'Successfull..',status:true})
     }


    })

  }
  catch(e)
  {

    res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});



module.exports = router;
