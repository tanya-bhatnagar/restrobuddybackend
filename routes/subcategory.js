var express = require('express');
var router = express.Router();
var pool = require("./pool");
var upload = require('./multer.js'); 

router.post('/submit_subcategory', upload.single("icon"), function(req, res, next) {
    console.log('Body:', req.body);
    console.log('File:', req.file);  
    try {
        pool.query("INSERT INTO subcategory (restaurantid, categoryid, subcategoryname, icon) VALUES (?,?,?,?)", [
            req.body.restaurantid,
            req.body.categoryid,
            req.body.subcategoryname,
            req.file.filename,  
        ], function(error, result) {
            if (error) {
                console.log('Error:', error);
                res.status(500).json({ message: 'Database error, Please contact database administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Subcategory successfully added!', status: true });
            }
        });
    } catch (e) {
        console.log('Error:', e);
        res.status(500).json({ message: 'Critical error, Please contact database administrator...', status: false });
    }
});

router.get('/display_all', function(req, res) {
    try {
        pool.query("select s.*,(select c.categoryname from category c where c.categoryid=s.categoryid) as categoryname,(select R.restaurantname from restaurant R where R.restaurantid=s.restaurantid) as restaurantname from subcategory s", function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, Please contact the database administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Success', data: result, status: true });
            }
        });
    } catch (e) {
        res.status(500).json({ message: 'Critical error, Please contact the database administrator...', status: false });
    }
});

router.post('/edit_subcategory', upload.single("icon"), function(req, res) {
    const { subcategoryid, subcategoryname } = req.body;

    if (req.file) {
        pool.query("UPDATE subcategory SET subcategoryname = ?, icon = ? WHERE subcategoryid = ?", [
            subcategoryname, 
            req.file.filename,
            subcategoryid
        ], function(error, result) {
            if (error) {
                console.log('Error:', error);
                res.status(500).json({ message: 'Database error, Please contact database administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Subcategory updated successfully!', status: true });
            }
        });
    } else {
        pool.query("UPDATE subcategory SET subcategoryname = ? WHERE subcategoryid = ?", [
            subcategoryname,
            subcategoryid
        ], function(error, result) {
            if (error) {
                console.log('Error:', error);
                res.status(500).json({ message: 'Database error, Please contact database administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Subcategory updated successfully!', status: true });
            }
        });
    }
});

router.post('/delete_subcategory', function(req, res) {
    const { subcategoryid } = req.body;
    try {
        pool.query("DELETE FROM subcategory WHERE subcategoryid = ?", [subcategoryid], function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, Please contact database administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Subcategory deleted successfully!', status: true });
            }
        });
    } catch (e) {
        res.status(500).json({ message: 'Critical error, Please contact database administrator...', status: false });
    }
});

router.post('/edit_subcategory_icon', upload.single('icon'), function(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded', status: false });
    }

    try {
        console.log("Updated file:", req.file);  

        pool.query("UPDATE subcategory SET icon = ? WHERE subcategoryid = ?", [
            req.file.filename,  
            req.body.subcategoryid
        ], function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, please contact the administrator...', status: false });
            } else {
                res.status(200).json({ message: 'SubCategory icon updated successfully.', status: true });
            }
        });
    } catch (e) {
        console.log("Error:", e);
        res.status(500).json({ data: [], message: 'Critical error, please contact the administrator...', status: false });
    }
});

module.exports = router;
