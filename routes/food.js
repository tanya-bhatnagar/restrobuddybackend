var express = require("express");
var router = express.Router();
var pool = require("./pool.js");
var upload = require("./multer.js");

/* Insert Food */
router.post("/food_submit", upload.single("icon"), function (req, res) {
  try {
    console.log("Body", req.body);
    pool.query(
      "INSERT INTO food (restaurantid, categoryid, subcategoryid, fooditemname, foodtype, ingredients, price, offerprice, status, icon, createdat, updatedat,quantitytype) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.restaurantid,
        req.body.categoryid,
        req.body.subcategoryid,
        req.body.fooditemname,
        req.body.foodtype,
        req.body.ingredients,
        req.body.price,
        req.body.offerprice,
        req.body.status,
        req.file ? req.file.filename : null,
        req.body.createdat,
        req.body.updatedat,
        req.body.quantitytype,
      ],
      function (error, result) {
        if (error) {
          console.error("Database Error:", error);
          res.status(500).json({
            message: "Database error, please contact the administrator.",
            status: false,
          });
        } else {
          res.status(200).json({ message: "Food successfully added.", status: true });
        }
      }
    );
  } catch (e) {
    console.error("Critical Error:", e);
    res.status(500).json({
      message: "Critical error, please contact the administrator.",
      status: false,
    });
  }
});

/* Display All Food */
router.get("/display_all", function (req, res) {
  try {
    pool.query(
      `SELECT F.*, 
        (SELECT C.categoryname FROM category C WHERE C.categoryid = F.categoryid) AS categoryname, 
        (SELECT S.subcategoryname FROM subcategory S WHERE S.subcategoryid = F.subcategoryid) AS subcategoryname, 
        (SELECT R.restaurantname FROM restaurant R WHERE R.restaurantid = F.restaurantid) AS restaurantname 
       FROM food F`,
      function (error, result) {
        if (error) {
          console.error("Database Error:", error);
          res.status(500).json({
            message: "Database error, please contact the administrator.",
            status: false,
          });
        } else {
          res.status(200).json({
            data: result,
            message: "Food list retrieved successfully.",
            status: true,
          });
        }
      }
    );
  } catch (e) {
    console.error("Critical Error:", e);
    res.status(500).json({
      message: "Critical error, please contact the administrator.",
      status: false,
    });
  }
});

/* Edit Food */
router.post("/edit_food", function (req, res) {
  console.log("Edit Food Request:", req.body);

  if (!req.body.fooditemid) {
    return res.status(400).json({ message: "Food ID is missing", status: false });
  }

  pool.query(
    `UPDATE food 
     SET fooditemname=?, foodtype=?, ingredients=?, price=?, offerprice=?, status=?, updatedat=? ,quantitytype=?
     WHERE fooditemid=?`,
    [
      req.body.foodName,
      req.body.foodType,
      req.body.ingredients,
      req.body.price,
      req.body.offerPrice,
      req.body.status,
      req.body.updatedat,
      req.body.quantitytype,
      req.body.fooditemid,
    ],
    function (error, result) {
      if (error) {
        res.status(500).json({ message: "Database error", status: false });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Food item not found", status: false });
      } else {
        res.status(200).json({ message: "Food details updated successfully.", status: true });
      }
    }
  );
});
/* Delete Food */
router.post("/delete_food", function (req, res) {
  console.log("Delete Request:", req.body);

  try {
    pool.query(
      "DELETE FROM food WHERE fooditemid=?",
      [req.body.fooditemid],
      function (error, result) {
        if (error) {
          console.error("Database Error:", error);
          res.status(500).json({
            message: "Database error, please contact the administrator.",
            status: false,
          });
        } else {
          res.status(200).json({
            message: "Food deleted successfully.",
            status: true,
          });
        }
      }
    );
  } catch (e) {
    console.error("Critical Error:", e);
    res.status(500).json({
      message: "Critical error, please contact the administrator.",
      status: false,
    });
  }
});

/* Edit Food Image */
router.post("/edit_food_icon", upload.single("icon"), function (req, res) {
  console.log("Edit Food Icon Request:", req.body);

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        status: false,
      });
    }

    pool.query(
      "UPDATE food SET icon = ? WHERE fooditemid = ?",
      [req.file.filename, req.body.fooditemid],
      function (error, result) {
        if (error) {
          console.error("Database Error:", error);
          res.status(500).json({
            message: "Database error, please contact the administrator.",
            status: false,
          });
        } else {
          res.status(200).json({
            message: "Food image updated successfully.",
            status: true,
          });
        }
      }
    );
  } catch (e) {
    console.error("Critical Error:", e);
    res.status(500).json({
      message: "Critical error, please contact the administrator.",
      status: false,
    });
  }
});

module.exports = router;
