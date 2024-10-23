const express = require('express');
const router = express.Router();

router.get('',(req,res) => {
    res.send("Helllo World");
});

module.exports = router;