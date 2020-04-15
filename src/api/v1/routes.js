const express = require('express')
const router = express.Router()

const estimator = require('../../../src/estimator');
const { dataValidator, validate } = require('./dataValidator');

router.post('/', dataValidator(), validate, estimator.covid19ImpactEstimator);
router.post('/json', dataValidator(), validate, estimator.covid19ImpactEstimatorJson);
router.post('/xml', dataValidator(), validate, estimator.covid19ImpactEstimatorXml);

module.exports = router