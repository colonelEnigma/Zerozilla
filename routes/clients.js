const router = require('express').Router();
const Agency = require('../models/Agency');
const Client = require('../models/Client');
const verify = require('../helper/verifyToken')
const mongoose = require('mongoose');

router.post('/update', verify, async (req, res) => {

    const cc = await Client.findOne({ _id: req.body.cid })

    Client.findOneAndUpdate({ "_id": req.body.cid }, {
        "$set": {
            "name": req.body.name ? req.body.name : cc.name,
            "email": req.body.email ? req.body.email : cc.email,
            "phone": req.body.phone ? req.body.phone : cc.phone,
            "totalbill": req.body.totalbill ? req.body.totalbill : cc.totalbill
        }
    }).exec(function (err, data) {
        if (err) {
            res.status(500).send('something is wrong cannot update');
        } else {
            res.status(200).send(data);
        }
    });
})

module.exports = router;