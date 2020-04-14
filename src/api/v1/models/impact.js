'use strict';
module.exports = (sequelize, Sequelize) => {
  const Impact = sequelize.define('c_impact', {
   impactId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    impactCurrentlyInfected: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    impactInfectionsByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    impactSevereCasesByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    impactHospitalBedsByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    impactCasesForICUByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    impactCasesForVentilatorsByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    impactDollarsInFlight: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    impactRecoveryByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    impactDeathByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
      },
  { timestamps: false,
    freezeTableName: true,
    tableName: 'c_impact',
    });

  Impact.associate = function(models) {
    Impact.belongsTo(models.c_data, { foreignKey: 'impactId', target_key: 'id' });
      };
  
  return Impact;
};