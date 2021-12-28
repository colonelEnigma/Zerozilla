const router = require('express').Router();
const Agency = require('../models/Agency');
const Client = require('../models/Client');
const verify = require('../helper/verifyToken')
const mongoose = require('mongoose');
const async = require('async');


router.post('/create', verify, async (req, res) => {
    const agency = new Agency({
        name: req.body.name,
        address_one: req.body.address_one,
        address_two: req.body.address_two ? req.body.address_two : '',
        state: req.body.state,
        city: req.body.city,
        phone: req.body.phone,
        user: req.body.user_id,
    });

    const session = await mongoose.startSession();

    await session.withTransaction(async () => {
        const user = await Agency.findOne({ phone: req.body.phone }).session(session);
        if (user) {
            return res.status(409).send('agency with phone number already exists');
        }

        const ag = await agency.save();

        async.each(req.body.clients, async function (clientData, cb) {
            const client = await Client.findOne({ phone: clientData.phone });
            if (client) {
                return res.status(409).send('client with phone number already exists');
            }

            const cc = new Client({
                name: clientData.name,
                email: clientData.email,
                phone: clientData.phone,
                totalbill: clientData.totalbill,
                agency: ag._id,
            })

            await cc.save().then((result) => {
                Agency.findOne({ phone: req.body.phone }, (err, agent) => {
                    if (agent) {
                        agent.clients.push(result._id);
                        agent.save();
                    }
                });
            });

        });

        res.send(ag);
    });

    session.endSession();

})


router.get('/topclients', verify, async (req, res) => {
    try {
        const dss = await Agency
            .findOne({ name: req.body.name })
            .populate({ path: 'clients', options: { sort: { 'totalbill': -1 } } })

        if (!dss) {
            return res.send('no agency found')
        } else {
            let finalArr = []
            if (dss.clients.length) {
                dss.clients.forEach(element => {
                    let obj = {}
                    obj['agencyName'] = req.body.name;
                    obj['clientName'] = element.name;
                    obj['totalbill'] = element.totalbill;
                    finalArr.push(obj)
                });
            }

            return res.status(200).send(finalArr)
        }
    } catch (error) {
        return res.send('something went wrong')
    }

})

module.exports = router;