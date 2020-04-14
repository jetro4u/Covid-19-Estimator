const { check, validationResult } = require('express-validator')

const dataValidator = () => {
  return [
    check('regionName').isLength({min: undefined}).withMessage('Must be a valid region name.'),
    check('avgAge').isDecimal().withMessage('Only submit number to 2 decimal places.'),
    check('avgDailyIncomeInUSD').isDecimal().withMessage('Only submit number to 2 decimal places.'),
    check('avgDailyIncomePopulation').isDecimal().withMessage('Only submit number to 2 decimal places.'),
    check('periodType').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
    check('timeToElapse').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
    check('reportedCases').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
    check('population').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
    check('totalHospitalBeds').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
    check('recoveredCases').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
    check('deaths').isNumeric({no_symbols: true}).withMessage('Only numbers can be submitted. Please do not include any symbols e.g. +, -, or .'),
  ] 
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  dataValidator, validate,
}