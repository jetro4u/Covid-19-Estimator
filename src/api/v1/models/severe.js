'use strict';
module.exports = (sequelize, Sequelize) => {
  const Severe = sequelize.define('c_severe', {
   severeId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    severeCurrentlyInfected: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    severeInfectionsByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    severeSevereCasesByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    severeHospitalBedsByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    severeCasesForICUByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    severeCasesForVentilatorsByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    severeDollarsInFlight: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    severeRecoveryByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    severeDeathByRequestedTime: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
      },
  { timestamps: false,
    freezeTableName: true,
    tableName: 'c_severe',
    });

    Severe.associate = function(models) {
        Severe.belongsTo(models.c_data, { foreignKey: 'severeId', target_key: 'id' });
      };
  
  return Severe;
};