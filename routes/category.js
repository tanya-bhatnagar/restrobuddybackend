var express = require('express');
var router = express.Router();
var pool = require('./pool.js');
var upload = require('./multer.js');

router.post('/submit_category', upload.single('icon'), function(req, res) {
    console.log("File:", req.file);  
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded', status: false });
        }
        
        pool.query("INSERT INTO category (restaurantid, categoryname, icon) VALUES (?, ?, ?)", [
            req.body.restaurantid, 
            req.body.categoryname, 
            req.file.filename
        ], function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, please contact the administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Category successfully registered.', status: true });
            }
        });
    } catch (e) {
        console.log("Error:", e);
        res.status(500).json({ data: [], message: 'Critical error, please contact the administrator...', status: false });
    }
});

router.get('/display_all_category', function(req, res) {
    try {
        pool.query("SELECT C.*, R.restaurantname FROM category C JOIN restaurant R ON C.restaurantid = R.restaurantid", function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, please contact the administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Success', data: result, status: true });
            }
        });
    } catch (e) {
        res.status(500).json({ data: [], message: 'Critical error, please contact the administrator...', status: false });
    }
});


router.post('/edit_category', function(req, res) {
    try {
        pool.query("UPDATE category SET categoryname = ? WHERE categoryid = ?", [
            req.body.categoryname, 
            req.body.categoryid
        ], function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, please contact the administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Category updated successfully.', status: true });
            }
        });
    } catch (e) {
        res.status(500).json({ data: [], message: 'Critical error, please contact the administrator...', status: false });
    }
});


router.post('/delete_category', function(req, res) {
    try {
        pool.query("DELETE FROM category WHERE categoryid = ?", [
            req.body.categoryid
        ], function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, please contact the administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Category deleted successfully.', status: true });
            }
        });
    } catch (e) {
        res.status(500).json({ data: [], message: 'Critical error, please contact the administrator...', status: false });
    }
});

router.post('/edit_category_icon', upload.single('icon'), function(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded', status: false });
    }

    try {
        console.log("Updated file:", req.file);  

        pool.query("UPDATE category SET icon = ? WHERE categoryid = ?", [
            req.file.filename,  
            req.body.categoryid
        ], function(error, result) {
            if (error) {
                console.log("Error:", error);
                res.status(500).json({ message: 'Database error, please contact the administrator...', status: false });
            } else {
                res.status(200).json({ message: 'Category icon updated successfully.', status: true });
            }
        });
    } catch (e) {
        console.log("Error:", e);
        res.status(500).json({ data: [], message: 'Critical error, please contact the administrator...', status: false });
    }
});

module.exports = router;
