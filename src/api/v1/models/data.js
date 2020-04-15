'use strict';
module.exports = (sequelize, Sequelize) => {
  const Data = sequelize.define('c_data', {
   id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4
    },
    regionName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    avgAge: {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false
    },
    avgDailyIncomeInUSD: {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false
    },
    avgDailyIncomePopulation: {
      type: Sequelize.DECIMAL(20, 2),
      allowNull: false,
    },
    periodType: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    timeToElapse: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    reportedCases: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    population: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    totalHospitalBeds: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    recoveredCases: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deaths: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
  },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
  }
      },
  { timestamps: true,
    freezeTableName: true,
    tableName: 'c_data',
    });

  Data.associate = function(models) {
    Data.hasOne(models.Impact);
    Data.hasOne(models.Severe);
      };
  
  return Data;
};