const sequelize = require('./api/v1/db');
const Data = sequelize.import('./api/v1/models/data');
const Impact = sequelize.import('./api/v1/models/impact');
const Severe = sequelize.import('./api/v1/models/severe');

exports.covid19ImpactEstimator = async (req, res) => {

    const t = await sequelize.transaction();
    try {
            const regionName = req.body.regionName;
            const avgAge = req.body.avgAge;
            const avgDailyIncomeInUSD = req.body.avgDailyIncomeInUSD;
            const avgDailyIncomePopulation = req.body.avgDailyIncomePopulation;
            const periodType = req.body.periodType;
            const timeToElapse = req.body.timeToElapse;
            const reportedCases = req.body.reportedCases;
            const population = req.body.population;
            const totalHospitalBeds = req.body.totalHospitalBeds;
            const confirmedCases = req.body.confirmedCases;
            const recoveredCases = req.body.recoveredCases;
            const deaths = req.body.deaths;
        
       const createdData = await Data.create({ regionName, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation, periodType, timeToElapse, reportedCases, population, totalHospitalBeds, confirmedCases, periodType, recoveredCases, deaths }, {
            transaction: t });

            let a = createdData.reportedCases;
            var b = createdData.totalHospitalBeds;
            var c = createdData.avgDailyIncomeInUSD;
            var d = createdData.avgDailyIncomePopulation;
            let y = createdData.timeToElapse;
            let z = createdData.periodType;

        const impactCurrentlyInfected = (a * 10);
        const severeCurrentlyInfected = (a * 50);


        // FUNCTION FOR INFECTION BY REQUESTED TIME
        function infectionsByRequestedTime(x, u) {
            let ac = createdData.periodType;

            if (ac === "10") {
                u = y; 
            } else if (ac === "20") {
                u = (y * 7)   
            } else if (ac === "30") {
                u = (y * 30)
            };

            var z = ( u / 3)
            var calc = x * (Math.pow(2, z));
            var result = parseInt(calc);
            return (result);
            };

            let p = impactCurrentlyInfected
            let q = severeCurrentlyInfected;

            // CALCULATION OF INFECTION BY REQUESTED TIME
            
            const impactInfectionsByRequestedTime = infectionsByRequestedTime(p, y);
            const severeInfectionsByRequestedTime = infectionsByRequestedTime(q, y);

            let aa = impactInfectionsByRequestedTime;
            let ab = severeInfectionsByRequestedTime;

            // FUNCTION FOR SEVERE INFECTION BY REQUESTED TIME

            function requireHospitalization(x) {
            var calc = (0.15 * x);
            var result = parseInt(calc);
            return (result);
            };

            const impactSevereCasesByRequestedTime = requireHospitalization(aa);
            const severeSevereCasesByRequestedTime = requireHospitalization(ab);

            let ae = impactSevereCasesByRequestedTime;
            let af = severeSevereCasesByRequestedTime;

 // MEASURE HospitalBedsByRequestedTime

            function hospitalBedsByRequestedTime(x, y) {
                var z = (0.35 * x);
                var calc = (z - y);
            var result = parseInt(calc);
            return (result);
            };

            const impactHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(b, ae);
            const severeHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(b, af);

// MEASURE CasesForICUByRequestedTime

            function casesForICUByRequestedTime(x) {
                var calc = (0.05 * x);
                var result = parseInt(calc);
                return (result);
                };

            const impactCasesForICUByRequestedTime = casesForICUByRequestedTime(aa);
            const severeCasesForICUByRequestedTime = casesForICUByRequestedTime(ab);

// MEASURE CasesForVentilatorsByRequestedTime

            function casesForVentilatorsByRequestedTime(x) {
                var calc = (0.02 * x);
                var result = parseInt(calc);
                return (result);
                };

            const impactCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(aa);
            const severeCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(ab);

// MEASURE DollarsInFlight

            function dollarsInFlight(x) {
                 
                let ae = createdData.periodType;
                let u;
                if (ae === "10") {
                    u = y; 
                } else if (ae === "20") {
                    u = (y * 7)   
                } else if (ae === "30") {
                    u = (y * 30)
                }; 

            const calc = (x * d * c * ae);
                var result = parseInt(calc);
                return (result);
                };

            const impactDollarsInFlight = dollarsInFlight(aa);
            const severeDollarsInFlight = dollarsInFlight(ab);

// MEASURE RecoveryByRequestedTime

            function recoveryByRequestedTime(x) {
                let a = createdData.reportedCases;
                let f = createdData.recoveredCases;
                var rr = (f / a);
                var calc = (x * rr );
                var result = parseInt(calc);
                return (result);
                };

            const impactRecoveryByRequestedTime = recoveryByRequestedTime(aa);
            const severeRecoveryByRequestedTime = recoveryByRequestedTime(ab);

            // MEASURE DeathByRequestedTime

            function deathByRequestedTime(x) {
                let a = createdData.reportedCases;
                let g = createdData.deaths;
                var dr = (g / a);
                var calc = (x * dr );
                var result = parseInt(calc);
                return (result);
                };

            const impactDeathByRequestedTime = deathByRequestedTime(aa);
            const severeDeathByRequestedTime = deathByRequestedTime(ab);

            const impactId = createdData.id;
            const severeId = createdData.id;

            const createdImpact = await Impact.create({ impactId, impactCurrentlyInfected, impactInfectionsByRequestedTime, impactSevereCasesByRequestedTime, impactHospitalBedsByRequestedTime, impactCasesForICUByRequestedTime, impactCasesForVentilatorsByRequestedTime, impactDollarsInFlight, impactRecoveryByRequestedTime, impactDeathByRequestedTime }, {
            transaction: t });

            const createdSevere = await Severe.create({ severeId, severeCurrentlyInfected, severeInfectionsByRequestedTime, severeSevereCasesByRequestedTime, severeHospitalBedsByRequestedTime, severeCasesForICUByRequestedTime, severeCasesForVentilatorsByRequestedTime, severeDollarsInFlight, severeRecoveryByRequestedTime, severeDeathByRequestedTime }, {
            transaction: t });

            await t.commit();

            if (createdSevere) {
                res.status(200).json({
                    data: {
                        region: {
                            regionName: createdData.regionName,
                            avgAge: createdData.avgAge,
                            avgDailyIncomeInUSD: createdData.avgDailyIncomeInUSD,
                            avgDailyIncomePopulation: createdData.avgDailyIncomePopulation
                        },
                         periodType: createdData.periodType,
                         timeToElapse: createdData.timeToElapse,
                         reportedCases: createdData.reportedCases,
                         population: createdData.population,
                         totalHospitalBeds: createdData.totalHospitalBeds,
                         confirmedCases: createdData.confirmedCases,
                         recoveredCases: createdData.recoveredCases,
                         deaths: createdData.deaths
                    }, 
                    impact: {
                         currentlyInfected: createdImpact.impactCurrentlyInfected,
                         infectionsByRequestedTime: createdImpact.impactInfectionsByRequestedTime,
                         severeCasesByRequestedTime: createdImpact.impactSevereCasesByRequestedTime,
                         hospitalBedsByRequestedTime: createdImpact.impactHospitalBedsByRequestedTime,
                         casesForICUByRequestedTime: createdImpact.impactCasesForICUByRequestedTime,
                         casesForVentilatorsByRequestedTime: createdImpact.impactCasesForVentilatorsByRequestedTime,
                         dollarsInFlight: createdImpact.impactDollarsInFlight,
                         recoveryByRequestedTime: createdImpact.impactRecoveryByRequestedTime,
                         deathByRequestedTime: createdImpact.impactDeathByRequestedTime
                        },
                    severeImpact: {
                         currentlyInfected: createdSevere.severeCurrentlyInfected,
                         infectionsByRequestedTime:  createdSevere.severeInfectionsByRequestedTime,
                         severeCasesByRequestedTime: createdSevere.severeSevereCasesByRequestedTime,
                         hospitalBedsByRequestedTime: createdSevere.severeHospitalBedsByRequestedTime,
                         casesForICUByRequestedTime: createdSevere.severeCasesForICUByRequestedTime,
                         casesForVentilatorsByRequestedTime: createdSevere.severeCasesForVentilatorsByRequestedTime,
                         dollarsInFlight: createdSevere.severeDollarsInFlight,
                         recoveryByRequestedTime: createdSevere.severeRecoveryByRequestedTime,
                         deathByRequestedTime: createdSevere.severeDeathByRequestedTime
                    }
                });
            }
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            message: "Covid data creation failed!", error
          });
        }
    };

    exports.covid19ImpactEstimatorJson = async (req, res) => {

    const t = await sequelize.transaction();
    try {
            const regionName = req.body.regionName;
            const avgAge = req.body.avgAge;
            const avgDailyIncomeInUSD = req.body.avgDailyIncomeInUSD;
            const avgDailyIncomePopulation = req.body.avgDailyIncomePopulation;
            const periodType = req.body.periodType;
            const timeToElapse = req.body.timeToElapse;
            const reportedCases = req.body.reportedCases;
            const population = req.body.population;
            const totalHospitalBeds = req.body.totalHospitalBeds;
            const confirmedCases = req.body.confirmedCases;
            const recoveredCases = req.body.recoveredCases;
            const deaths = req.body.deaths;
        
       const createdData = await Data.create({ regionName, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation, periodType, timeToElapse, reportedCases, population, totalHospitalBeds, confirmedCases, periodType, recoveredCases, deaths }, {
            transaction: t });

            let a = createdData.reportedCases;
            var b = createdData.totalHospitalBeds;
            var c = createdData.avgDailyIncomeInUSD;
            var d = createdData.avgDailyIncomePopulation;
            let y = createdData.timeToElapse;
            let z = createdData.periodType;

        const impactCurrentlyInfected = (a * 10);
        const severeCurrentlyInfected = (a * 50);


        // FUNCTION FOR INFECTION BY REQUESTED TIME
        function infectionsByRequestedTime(x, u) {
            let ac = createdData.periodType;

            if (ac === "10") {
                u = y; 
            } else if (ac === "20") {
                u = (y * 7)   
            } else if (ac === "30") {
                u = (y * 30)
            };

            var z = ( u / 3)
            var calc = x * (Math.pow(2, z));
            var result = parseInt(calc);
            return (result);
            };

            let p = impactCurrentlyInfected
            let q = severeCurrentlyInfected;

            // CALCULATION OF INFECTION BY REQUESTED TIME
            
            const impactInfectionsByRequestedTime = infectionsByRequestedTime(p, y);
            const severeInfectionsByRequestedTime = infectionsByRequestedTime(q, y);

            let aa = impactInfectionsByRequestedTime;
            let ab = severeInfectionsByRequestedTime;

            // FUNCTION FOR SEVERE INFECTION BY REQUESTED TIME

            function requireHospitalization(x) {
            var calc = (0.15 * x);
            var result = parseInt(calc);
            return (result);
            };

            const impactSevereCasesByRequestedTime = requireHospitalization(aa);
            const severeSevereCasesByRequestedTime = requireHospitalization(ab);

            let ae = impactSevereCasesByRequestedTime;
            let af = severeSevereCasesByRequestedTime;

 // MEASURE HospitalBedsByRequestedTime

            function hospitalBedsByRequestedTime(x, y) {
                var z = (0.35 * x);
                var calc = (z - y);
            var result = parseInt(calc);
            return (result);
            };

            const impactHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(b, ae);
            const severeHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(b, af);

// MEASURE CasesForICUByRequestedTime

            function casesForICUByRequestedTime(x) {
                var calc = (0.05 * x);
                var result = parseInt(calc);
                return (result);
                };

            const impactCasesForICUByRequestedTime = casesForICUByRequestedTime(aa);
            const severeCasesForICUByRequestedTime = casesForICUByRequestedTime(ab);

// MEASURE CasesForVentilatorsByRequestedTime

            function casesForVentilatorsByRequestedTime(x) {
                var calc = (0.02 * x);
                var result = parseInt(calc);
                return (result);
                };

            const impactCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(aa);
            const severeCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(ab);

// MEASURE DollarsInFlight

            function dollarsInFlight(x) {
                 
                let ae = createdData.periodType;
                let u;
                if (ae === "10") {
                    u = y; 
                } else if (ae === "20") {
                    u = (y * 7)   
                } else if (ae === "30") {
                    u = (y * 30)
                }; 

            const calc = (x * d * c * ae);
                var result = parseInt(calc);
                return (result);
                };

            const impactDollarsInFlight = dollarsInFlight(aa);
            const severeDollarsInFlight = dollarsInFlight(ab);

// MEASURE RecoveryByRequestedTime

            function recoveryByRequestedTime(x) {
                let a = createdData.reportedCases;
                let f = createdData.recoveredCases;
                var rr = (f / a);
                var calc = (x * rr );
                var result = parseInt(calc);
                return (result);
                };

            const impactRecoveryByRequestedTime = recoveryByRequestedTime(aa);
            const severeRecoveryByRequestedTime = recoveryByRequestedTime(ab);

            // MEASURE DeathByRequestedTime

            function deathByRequestedTime(x) {
                let a = createdData.reportedCases;
                let g = createdData.deaths;
                var dr = (g / a);
                var calc = (x * dr );
                var result = parseInt(calc);
                return (result);
                };

            const impactDeathByRequestedTime = deathByRequestedTime(aa);
            const severeDeathByRequestedTime = deathByRequestedTime(ab);

            const impactId = createdData.id;
            const severeId = createdData.id;

            const createdImpact = await Impact.create({ impactId, impactCurrentlyInfected, impactInfectionsByRequestedTime, impactSevereCasesByRequestedTime, impactHospitalBedsByRequestedTime, impactCasesForICUByRequestedTime, impactCasesForVentilatorsByRequestedTime, impactDollarsInFlight, impactRecoveryByRequestedTime, impactDeathByRequestedTime }, {
            transaction: t });

            const createdSevere = await Severe.create({ severeId, severeCurrentlyInfected, severeInfectionsByRequestedTime, severeSevereCasesByRequestedTime, severeHospitalBedsByRequestedTime, severeCasesForICUByRequestedTime, severeCasesForVentilatorsByRequestedTime, severeDollarsInFlight, severeRecoveryByRequestedTime, severeDeathByRequestedTime }, {
            transaction: t });

            await t.commit();

            if (createdSevere) {
                res.status(200).json({
                    data: {
                        region: {
                            regionName: createdData.regionName,
                            avgAge: createdData.avgAge,
                            avgDailyIncomeInUSD: createdData.avgDailyIncomeInUSD,
                            avgDailyIncomePopulation: createdData.avgDailyIncomePopulation
                        },
                         periodType: createdData.periodType,
                         timeToElapse: createdData.timeToElapse,
                         reportedCases: createdData.reportedCases,
                         population: createdData.population,
                         totalHospitalBeds: createdData.totalHospitalBeds,
                         confirmedCases: createdData.confirmedCases,
                         recoveredCases: createdData.recoveredCases,
                         deaths: createdData.deaths
                    }, 
                    impact: {
                         currentlyInfected: createdImpact.impactCurrentlyInfected,
                         infectionsByRequestedTime: createdImpact.impactInfectionsByRequestedTime,
                         severeCasesByRequestedTime: createdImpact.impactSevereCasesByRequestedTime,
                         hospitalBedsByRequestedTime: createdImpact.impactHospitalBedsByRequestedTime,
                         casesForICUByRequestedTime: createdImpact.impactCasesForICUByRequestedTime,
                         casesForVentilatorsByRequestedTime: createdImpact.impactCasesForVentilatorsByRequestedTime,
                         dollarsInFlight: createdImpact.impactDollarsInFlight,
                         recoveryByRequestedTime: createdImpact.impactRecoveryByRequestedTime,
                         deathByRequestedTime: createdImpact.impactDeathByRequestedTime
                        },
                    severeImpact: {
                         currentlyInfected: createdSevere.severeCurrentlyInfected,
                         infectionsByRequestedTime:  createdSevere.severeInfectionsByRequestedTime,
                         severeCasesByRequestedTime: createdSevere.severeSevereCasesByRequestedTime,
                         hospitalBedsByRequestedTime: createdSevere.severeHospitalBedsByRequestedTime,
                         casesForICUByRequestedTime: createdSevere.severeCasesForICUByRequestedTime,
                         casesForVentilatorsByRequestedTime: createdSevere.severeCasesForVentilatorsByRequestedTime,
                         dollarsInFlight: createdSevere.severeDollarsInFlight,
                         recoveryByRequestedTime: createdSevere.severeRecoveryByRequestedTime,
                         deathByRequestedTime: createdSevere.severeDeathByRequestedTime
                    }
                });
            }
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            message: "Covid data creation failed!", error
          });
        }
    };

    exports.covid19ImpactEstimatorXml = async (req, res) => {

    const t = await sequelize.transaction();
    try {
            const regionName = req.body.regionName;
            const avgAge = req.body.avgAge;
            const avgDailyIncomeInUSD = req.body.avgDailyIncomeInUSD;
            const avgDailyIncomePopulation = req.body.avgDailyIncomePopulation;
            const periodType = req.body.periodType;
            const timeToElapse = req.body.timeToElapse;
            const reportedCases = req.body.reportedCases;
            const population = req.body.population;
            const totalHospitalBeds = req.body.totalHospitalBeds;
            const confirmedCases = req.body.confirmedCases;
            const recoveredCases = req.body.recoveredCases;
            const deaths = req.body.deaths;
        
       const createdData = await Data.create({ regionName, avgAge, avgDailyIncomeInUSD, avgDailyIncomePopulation, periodType, timeToElapse, reportedCases, population, totalHospitalBeds, confirmedCases, periodType, recoveredCases, deaths }, {
            transaction: t });

            let a = createdData.reportedCases;
            var b = createdData.totalHospitalBeds;
            var c = createdData.avgDailyIncomeInUSD;
            var d = createdData.avgDailyIncomePopulation;
            let y = createdData.timeToElapse;
            let z = createdData.periodType;

        const impactCurrentlyInfected = (a * 10);
        const severeCurrentlyInfected = (a * 50);


        // FUNCTION FOR INFECTION BY REQUESTED TIME
        function infectionsByRequestedTime(x, u) {
            let ac = createdData.periodType;

            if (ac === "10") {
                u = y; 
            } else if (ac === "20") {
                u = (y * 7)   
            } else if (ac === "30") {
                u = (y * 30)
            };

            var z = ( u / 3)
            var calc = x * (Math.pow(2, z));
            var result = parseInt(calc);
            return (result);
            };

            let p = impactCurrentlyInfected
            let q = severeCurrentlyInfected;

            // CALCULATION OF INFECTION BY REQUESTED TIME
            
            const impactInfectionsByRequestedTime = infectionsByRequestedTime(p, y);
            const severeInfectionsByRequestedTime = infectionsByRequestedTime(q, y);

            let aa = impactInfectionsByRequestedTime;
            let ab = severeInfectionsByRequestedTime;

            // FUNCTION FOR SEVERE INFECTION BY REQUESTED TIME

            function requireHospitalization(x) {
            var calc = (0.15 * x);
            var result = parseInt(calc);
            return (result);
            };

            const impactSevereCasesByRequestedTime = requireHospitalization(aa);
            const severeSevereCasesByRequestedTime = requireHospitalization(ab);

            let ae = impactSevereCasesByRequestedTime;
            let af = severeSevereCasesByRequestedTime;

 // MEASURE HospitalBedsByRequestedTime

            function hospitalBedsByRequestedTime(x, y) {
                var z = (0.35 * x);
                var calc = (z - y);
            var result = parseInt(calc);
            return (result);
            };

            const impactHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(b, ae);
            const severeHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(b, af);

// MEASURE CasesForICUByRequestedTime

            function casesForICUByRequestedTime(x) {
                var calc = (0.05 * x);
                var result = parseInt(calc);
                return (result);
                };

            const impactCasesForICUByRequestedTime = casesForICUByRequestedTime(aa);
            const severeCasesForICUByRequestedTime = casesForICUByRequestedTime(ab);

// MEASURE CasesForVentilatorsByRequestedTime

            function casesForVentilatorsByRequestedTime(x) {
                var calc = (0.02 * x);
                var result = parseInt(calc);
                return (result);
                };

            const impactCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(aa);
            const severeCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(ab);

// MEASURE DollarsInFlight

            function dollarsInFlight(x) {
                 
                let ae = createdData.periodType;
                let u;
                if (ae === "10") {
                    u = y; 
                } else if (ae === "20") {
                    u = (y * 7)   
                } else if (ae === "30") {
                    u = (y * 30)
                }; 

            const calc = (x * d * c * ae);
                var result = parseInt(calc);
                return (result);
                };

            const impactDollarsInFlight = dollarsInFlight(aa);
            const severeDollarsInFlight = dollarsInFlight(ab);

// MEASURE RecoveryByRequestedTime

            function recoveryByRequestedTime(x) {
                let a = createdData.reportedCases;
                let f = createdData.recoveredCases;
                var rr = (f / a);
                var calc = (x * rr );
                var result = parseInt(calc);
                return (result);
                };

            const impactRecoveryByRequestedTime = recoveryByRequestedTime(aa);
            const severeRecoveryByRequestedTime = recoveryByRequestedTime(ab);

            // MEASURE DeathByRequestedTime

            function deathByRequestedTime(x) {
                let a = createdData.reportedCases;
                let g = createdData.deaths;
                var dr = (g / a);
                var calc = (x * dr );
                var result = parseInt(calc);
                return (result);
                };

            const impactDeathByRequestedTime = deathByRequestedTime(aa);
            const severeDeathByRequestedTime = deathByRequestedTime(ab);

            const impactId = createdData.id;
            const severeId = createdData.id;

            const createdImpact = await Impact.create({ impactId, impactCurrentlyInfected, impactInfectionsByRequestedTime, impactSevereCasesByRequestedTime, impactHospitalBedsByRequestedTime, impactCasesForICUByRequestedTime, impactCasesForVentilatorsByRequestedTime, impactDollarsInFlight, impactRecoveryByRequestedTime, impactDeathByRequestedTime }, {
            transaction: t });

            const createdSevere = await Severe.create({ severeId, severeCurrentlyInfected, severeInfectionsByRequestedTime, severeSevereCasesByRequestedTime, severeHospitalBedsByRequestedTime, severeCasesForICUByRequestedTime, severeCasesForVentilatorsByRequestedTime, severeDollarsInFlight, severeRecoveryByRequestedTime, severeDeathByRequestedTime }, {
            transaction: t });

            await t.commit();

            if (createdSevere) {
                res.contentType('application/xml');
                res.status(200).send({
                    data: {
                        region: {
                            regionName: createdData.regionName,
                            avgAge: createdData.avgAge,
                            avgDailyIncomeInUSD: createdData.avgDailyIncomeInUSD,
                            avgDailyIncomePopulation: createdData.avgDailyIncomePopulation
                        },
                         periodType: createdData.periodType,
                         timeToElapse: createdData.timeToElapse,
                         reportedCases: createdData.reportedCases,
                         population: createdData.population,
                         totalHospitalBeds: createdData.totalHospitalBeds,
                         confirmedCases: createdData.confirmedCases,
                         recoveredCases: createdData.recoveredCases,
                         deaths: createdData.deaths
                    }, 
                    impact: {
                         currentlyInfected: createdImpact.impactCurrentlyInfected,
                         infectionsByRequestedTime: createdImpact.impactInfectionsByRequestedTime,
                         severeCasesByRequestedTime: createdImpact.impactSevereCasesByRequestedTime,
                         hospitalBedsByRequestedTime: createdImpact.impactHospitalBedsByRequestedTime,
                         casesForICUByRequestedTime: createdImpact.impactCasesForICUByRequestedTime,
                         casesForVentilatorsByRequestedTime: createdImpact.impactCasesForVentilatorsByRequestedTime,
                         dollarsInFlight: createdImpact.impactDollarsInFlight,
                         recoveryByRequestedTime: createdImpact.impactRecoveryByRequestedTime,
                         deathByRequestedTime: createdImpact.impactDeathByRequestedTime
                        },
                    severeImpact: {
                         currentlyInfected: createdSevere.severeCurrentlyInfected,
                         infectionsByRequestedTime:  createdSevere.severeInfectionsByRequestedTime,
                         severeCasesByRequestedTime: createdSevere.severeSevereCasesByRequestedTime,
                         hospitalBedsByRequestedTime: createdSevere.severeHospitalBedsByRequestedTime,
                         casesForICUByRequestedTime: createdSevere.severeCasesForICUByRequestedTime,
                         casesForVentilatorsByRequestedTime: createdSevere.severeCasesForVentilatorsByRequestedTime,
                         dollarsInFlight: createdSevere.severeDollarsInFlight,
                         recoveryByRequestedTime: createdSevere.severeRecoveryByRequestedTime,
                         deathByRequestedTime: createdSevere.severeDeathByRequestedTime
                    }
                });
            }
    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).json({
            message: "Covid data creation failed!", error
          });
        }
    };
