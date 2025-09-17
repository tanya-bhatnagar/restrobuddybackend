var express = require("express");
var router = express.Router();
var pool = require("./pool.js");
var upload = require("./multer.js");
const { request } = require("../app.js");

router.post("/user_fetch_cityid", function (req, res) {
  try {
    pool.query(
      "select  * from cities where cityname=?",
      [req.body.cityname],
      function (error, result) {
        if (error) {
          console.log("error", error);
          res
            .status(500)
            .json({
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ message: "Success", data: result[0], status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_fetch_restaurant_by_city", function (req, res) {
  try {
    pool.query(
      "select R.*,(select S.statename from states S where S.stateid=R.stateid) as statename,(select C.cityname from cities C where C.cityid=R.cityid) as cityname  from restaurant R where R.cityid=?",
      [req.body.cityid],
      function (error, result) {
        if (error) {
          console.log("error", error);
          res
            .status(500)
            .json({
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ message: "Success", data: result, status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_fetch_restaurant_by_city_category", function (req, res) {
  try {
    var q = `select R.*,RP.*,t.*,(select S.statename from states S where S.stateid=R.stateid) as statename,(select C.cityname from cities C where C.cityid=R.cityid) as cityname  from restaurant R,restaurantpictures rp,timings t  where R.restaurantid=rp.restaurantid and R.restaurantid=t.restaurantid and rp.picturetype='Ambience' and R.cityid=${req.body.cityid} and R.restaurantid in (select C.restaurantid from Category C where categoryname like '%${req.body.category}%')`;
    pool.query(q, function (error, result) {
      if (error) {
        console.log("error", error);
        res
          .status(500)
          .json({
            message: "Database error, Pls contact database administrator...",
            status: false,
          });
      } else {
        res
          .status(200)
          .json({ message: "Success", data: result, status: true });
      }
    });
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_fetch_ambience_by_city", function (req, res) {
  try {
    pool.query(
      "select R.*,RP.*,t.*,(select S.statename from states S where S.stateid=R.stateid) as statename,(select C.cityname from cities C where C.cityid=R.cityid) as cityname  from restaurant R,restaurantpictures rp,timings t  where R.restaurantid=rp.restaurantid and R.restaurantid=t.restaurantid and rp.picturetype='Ambience' and R.cityid=?",
      [req.body.cityid],
      function (error, result) {
        if (error) {
          console.log("error", error);
          res
            .status(500)
            .json({
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ message: "Success", data: result, status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_fetch_ambience_by_restaurantid", function (req, res) {
  try {
    pool.query(
      "select R.*,RP.*,t.*,(select GROUP_CONCAT(c.categoryname) from category c where c.restaurantid=r.restaurantid) as listcategory,(select S.statename from states S where S.stateid=R.stateid) as statename,(select C.cityname from cities C where C.cityid=R.cityid) as cityname  from restaurant R,restaurantpictures rp,timings t  where R.restaurantid=rp.restaurantid and R.restaurantid=t.restaurantid and rp.picturetype='Ambience' and rp.restaurantid=?",
      [req.body.restaurantid],
      function (error, result) {
        if (error) {
          console.log("error", error);
          res
            .status(500)
            .json({
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          console.log(result);
          res
            .status(200)
            .json({ message: "Success", data: result[0], status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_fetch_all_photos_by_restaurantid", function (req, res) {
  try {
    pool.query(
      "SELECT * FROM restaurantpictures WHERE restaurantid = ?",
      [req.body.restaurantid],
      function (error, result) {
        if (error) {
          console.log("error", error);
          res.status(500).json({
            message: "Database error, please contact the administrator.",
            status: false,
          });
        } else {
          res
            .status(200)
            .json({ message: "Success", data: result, status: true });
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      message: "Critical error, please contact the administrator.",
      data: [],
      status: false,
    });
  }
});

router.post("/fetch_category_count", function (req, res, next) {
  console.log("Body:", req.body);
  try {
    pool.query(
      "select category.categoryid,category.categoryname,category.icon,count(*) as count_category from category,subcategory where category.categoryid=subcategory.categoryid and category.restaurantid=? group by category.categoryid,category.categoryname,category.icon ",
      [req.body.restaurantid],
      function (error, result) {
        if (error) {
          console.log(error);
          res
            .status(500)
            .json({
              data: [],
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ data: result, message: "Success", status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/fetch_all_food_by_category", function (req, res, next) {
  console.log("Body:", req.body);
  try {
    pool.query(
      "select F.*,R.* from food F ,restaurant R where F.restaurantid=R.restaurantid and F.categoryid=? and F.restaurantid=?",
      [req.body.categoryid, req.body.restaurantid],
      function (error, result) {
        if (error) {
          console.log(error);
          res
            .status(500)
            .json({
              data: [],
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ data: result, message: "Success", status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(500)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/submit_user", function (req, res, next) {
  try {
    pool.query(
      "insert into users values(?,?,?)",
      [req.body.mobileno, req.body.email_id, req.body.username],
      function (error, result) {
        if (error) {
          if (error.errno === 1062)
            res
              .status(401)
              .json({
                data: [],
                message: "Mobile No or EmailId Already Exist...",
                status: false,
              });
          else
            res
              .status(500)
              .json({
                data: [],
                message:
                  "Database error, Pls contact database administrator...",
                status: false,
              });
        } else {
          res
            .status(200)
            .json({ data: req.body, message: "Success", status: true });
        }
      }
    );
  } catch (e) {
    res
      .status(200)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/search_user", function (req, res, next) {
  try {
    pool.query(
      "select * from users where email_id=? or mobileno=?",
      [req.body.email_id, req.body.mobileno],
      function (error, result) {
        if (error) {
          res
            .status(200)
            .json({
              data: [],
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          if (result.length == 1)
            res
              .status(200)
              .json({ data: result, message: "Success", status: true });
          else
            res
              .status(200)
              .json({ data: result, message: "Success", status: false });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res
      .status(200)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/search_user_mobileno", function (req, res, next) {
  try {
    pool.query(
      "select * from users where  mobileno=?",
      [req.body.mobileno],
      
      function (error, result) {
        if (error) {
          res
            .status(200)
            .json({
              data: [],
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          if (result.length == 1)
            res
              .status(200)
              .json({ data: result, message: "Success", status: true });
          else
            res
              .status(200)
              .json({ data: result, message: "Success", status: false });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res
      .status(200)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/submit_user_address", function (req, res, next) {
  try {
    pool.query(
      "insert into useraddress (mobileno, emailid, fullname, state, city, addressone, addresstwo, landmark, pincode) values(?,?,?,?,?,?,?,?,?)",
      [
        req.body.mobileno,
        req.body.emailid,
        req.body.fullname,
        req.body.state,
        req.body.city,
        req.body.addressone,
        req.body.addresstwo,
        req.body.landmark,
        req.body.pincode,
      ],
      function (error, result) {
        if (error) {
          res
            .status(200)
            .json({
              data: [],
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ data: result, message: "Success", status: true });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res
      .status(200)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_address", function (req, res, next) {
  console.log(req.body);
  try {
    pool.query(
      "select * from useraddress where  mobileno=?",
      [req.body.mobileno],
      function (error, result) {
        if (error) {
          res
            .status(200)
            .json({
              data: [],
              message: "Database error, Pls contact database administrator...",
              status: false,
            });
        } else {
          res
            .status(200)
            .json({ data: result, message: "Success", status: true });
        }
      }
    );
  } catch (e) {
    console.log(e);
    res
      .status(200)
      .json({
        data: [],
        message: "Critical error, Pls contact database administrator...",
        status: false,
      });
  }
});

router.post("/user_fetch_ambience_by_city_categoryicon", function (req, res) {
  try {
    pool.query(
      `SELECT R.*, T.*, (SELECT S.statename FROM states S WHERE S.stateid = R.stateid) AS statename,
      (SELECT C.cityname FROM cities C WHERE C.cityid = R.cityid) AS cityname,(SELECT GROUP_CONCAT(cat.icon) FROM category cat WHERE cat.restaurantid = R.restaurantid) AS icon FROM restaurant R, timings T  WHERE R.restaurantid = T.restaurantid`,
      [req.body.cityid],
      function (error, result) {
        if (error) {
          console.log("error", error);
          res.status(500).json({
            message: "Database error, Pls contact database administrator...",
            status: false,
          });
        } else {
          res.status(200).json({
            message: "Success",
            data: result,
            status: true,
          });
        }
      }
    );
  } catch (e) {
    res.status(500).json({
      data: [],
      message: "Critical error, Pls contact database administrator...",
      status: false,
    });
  }
});

module.exports = router;
