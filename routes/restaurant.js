var express = require('express');
var router = express.Router();
var pool=require('./pool.js')
var upload=require('./multer.js')


/* GET home page. */
//upload.single("icon")
router.post('/submit_restaurant',upload.any(), function(req, res, next) {
    console.log("Body",req.body)
    console.log("Files",req.files)
    try{
   pool.query("insert into restaurant(restaurantname, ownername, phonenumber, mobilenumber, emailid, url, fssai, gstno, gsttype, filefssai, fileshopact, filelogo, address, stateid, cityid, latlong, password, status, createdat, updatedat) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
    req.body.restaurantname, 
    req.body.ownername, 
    req.body.phonenumber, 
    req.body.mobilenumber, 
    req.body.emailid, 
    req.body.url, 
    req.body.fssai, 
    req.body.gstno, 
    req.body.gsttype, 
    req.files[0].filename, 
    req.files[1].filename, 
    req.files[2].filename, 
    req.body.address, 
    req.body.stateid, 
    req.body.cityid,
    req.body.latlong, 
    req.body.password, 
    req.body.status, 
    req.body.createdat, 
    req.body.updatedat

   ],function(error,result){
   if(error)
   { console.log("error",error)
    res.status(500).json({message:'Database error, Pls contact database administrator...',status:false})
   }
   else
   {
    res.status(200).json({message:'Restaurant Successfully Registerd....',status:true})
     }

   })
  
    }
   catch(e)
   { console.log("e:",e)
    res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
   }
 
});

router.get('/display_all',function(req,res){
  try{
   pool.query("select R.*,(select S.statename from states S where S.stateid=R.stateid) as statename,(select C.cityname from cities C where C.cityid=R.cityid) as cityname  from restaurant R",function(error,result){
    if(error)
      { console.log("error",error)
       res.status(500).json({message:'Database error, Pls contact database administrator...',status:false})
      }
      else
      {
       res.status(200).json({message:'Success',data:result,status:true})
        }

   })

  }catch(e)
  {

    res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

})


router.post('/edit_restaurant_data', function(req, res, next) {
  console.log("Body",req.body)
  
  try{
 pool.query("update restaurant set restaurantname=?, ownername=?, phonenumber=?, mobilenumber=?, emailid=?, url=?, fssai=?, gstno=?, gsttype=?, address=?, stateid=?, cityid=?, latlong=?, createdat=?, updatedat=? where restaurantid=?",[
  req.body.restaurantname, 
  req.body.ownername, 
  req.body.phonenumber, 
  req.body.mobilenumber, 
  req.body.emailid, 
  req.body.url, 
  req.body.fssai, 
  req.body.gstno, 
  req.body.gsttype, 
  req.body.address, 
  req.body.stateid, 
  req.body.cityid,
  req.body.latlong, 
  req.body.createdat, 
  req.body.updatedat,
  req.body.restaurantid

 ],function(error,result){
 if(error)
 { console.log("error",error)
  res.status(500).json({message:'Database error, Pls contact database administrator...',status:false})
 }
 else
 {
  res.status(200).json({message:'Restaurant Data Edited Successfully...',status:true})
   }

 })

  }
 catch(e)
 { console.log("e:",e)
  res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
 }

});


router.post('/delete_restaurant_data', function(req, res, next) {
  console.log("Body",req.body)
  
  try{
 pool.query("delete from restaurant where restaurantid=?",[
  req.body.restaurantid],function(error,result){
 if(error)
 { console.log("error",error)
  res.status(500).json({message:'Database error, Pls contact database administrator...',status:false})
 }
 else
 {
  res.status(200).json({message:'Restaurant Data Deleted Successfully...',status:true})
   }

 })

  }
 catch(e)
 { console.log("e:",e)
  res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
 }

});



router.post('/edit_restaurant_images',upload.single('picture'), function(req, res, next) {
  console.log("Body",req.body)
 
  var fieldname=req.body.whichimage
  try{
  var q=""
  if(fieldname=='Fssai')
  { q="update restaurant set filefssai=? where restaurantid=?"}
  else if(fieldname=='Shop Act')
    { q="update restaurant set fileshopact=? where restaurantid=?"}
  else if(fieldname=='Logo')
    { q="update restaurant set filelogo=? where restaurantid=?"}
    
      
 pool.query(q,[ req.file.filename,
  req.body.restaurantid],function(error,result){
 if(error)
 { console.log("error",error)
  res.status(500).json({message:'Database error, Pls contact database administrator...',status:false})
 }
 else
 {
  res.status(200).json({message:`Restaurant ${fieldname} image edited Successfully...`,status:true})
   }

 })

  }
 catch(e)
 { console.log("e:",e)
  res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
 }

});

router.post('/chk_restaurant_login', function(req, res, next) {
  console.log("Body:",req.body)
  try
  {
    pool.query("Select * from restaurant where (emailid=? or mobilenumber=?) and password=?",[req.body.id,req.body.id,req.body.password],function(error,result){
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
