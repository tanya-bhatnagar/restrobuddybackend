var express = require('express');
var router = express.Router();
var pool=require("./pool")

router.post('/chk_admin_login', function(req, res, next) {
  console.log("Body:",req.body)
  try
  {
    pool.query("Select * from restroadmin where (emailid=? or mobileno=?) and password=?",[req.body.id,req.body.id,req.body.password],function(error,result){
     if(error)
     {  console.log(error)
        res.status(500).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
     }
     else
     {
        if(result.length==1)
        {var {password,...data}=result[0]  
         //console.log("Selected Data:",data)
        res.status(200).json({data,message:'Successfull',status:true})
        }
        else
        res.status(200).json({data:[],message:'Invalid Adminid/Password',status:false})
     }


    })

  }
  catch(e)
  {

    res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});



module.exports = router;
