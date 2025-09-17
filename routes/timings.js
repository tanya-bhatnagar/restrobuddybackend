var express = require('express');
var router = express.Router();
var pool = require("./pool");

// ✅ Submit Timings
router.post('/submit_timings', function(req, res) {
    console.log('Body:', req.body);

    try {
        pool.query(
            "INSERT INTO timings (status, closetime, opentime, createdat, updatedat) VALUES (?, ?, ?, NOW(), NOW())",
            [
                req.body.status,
                req.body.closetime,
                req.body.opentime
            ],
            function(error, result) {
                if (error) {
                    console.error('Database Error:', error);
                    return res.status(500).json({
                        message: 'Database error, Please contact the administrator...',
                        status: false
                    });
                } 
                res.status(200).json({ message: 'Timings successfully added!', status: true });
            }
        );
    } catch (e) {
        console.error('Critical Error:', e);
        res.status(500).json({
            message: 'Critical error, Please contact the administrator...',
            status: false
        });
    }
});

// ✅ Display Timings
router.get('/display_timings', function(req, res) {
    try {
        pool.query("SELECT * FROM timings", function(error, result) {
            if (error) {
                console.error('Database Error:', error);
                return res.status(500).json({
                    message: 'Database error, Please contact the administrator...',
                    status: false
                });
            }
            res.status(200).json({ data: result, status: true });
        });
    } catch (e) {
        console.error('Critical Error:', e);
        res.status(500).json({
            message: 'Critical error, Please contact the administrator...',
            status: false
        });
    }
});

// ✅ Edit Timings
router.post('/edit_timings', function(req, res) {
    if (!req.body.updatedat) { // 🔄 Using updatedat if timingid is not available
        return res.status(400).json({ message: 'Unique identifier (updatedat) is required!', status: false });
    }

    try {
        pool.query(
            "UPDATE timings SET status=?, closetime=?, opentime=?, updatedat=NOW() WHERE updatedat=?",
            [
                req.body.status,
                req.body.closetime,
                req.body.opentime,
                req.body.updatedat
            ],
            function(error, result) {
                if (error) {
                    console.error('Database Error:', error);
                    return res.status(500).json({
                        message: 'Database error, Please contact the administrator...',
                        status: false
                    });
                } 
                res.status(200).json({ message: 'Timings successfully updated!', status: true });
            }
        );
    } catch (e) {
        console.error('Critical Error:', e);
        res.status(500).json({
            message: 'Critical error, Please contact the administrator...',
            status: false
        });
    }
});

// ✅ Delete Timing
router.post('/delete_timing', function(req, res) {
    if (!req.body.updatedat) {
        return res.status(400).json({ message: 'Unique identifier (updatedat) is required!', status: false });
    }

    try {
        pool.query(
            "DELETE FROM timings WHERE updatedat = ?",
            [req.body.updatedat],
            function(error, result) {
                if (error) {
                    console.error('Database Error:', error);
                    return res.status(500).json({
                        message: 'Database error, Please contact the administrator...',
                        status: false
                    });
                } 
                res.status(200).json({ message: 'Timing successfully deleted!', status: true });
            }
        );
    } catch (e) {
        console.error('Critical Error:', e);
        res.status(500).json({
            message: 'Critical error, Please contact the administrator...',
            status: false
        });
    }
});

module.exports = router;
