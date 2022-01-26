const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const promocodes = sequelize.define(
    'promocodes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      code: {
        type: DataTypes.TEXT,
      },

      discount: {
        type: DataTypes.DECIMAL,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  promocodes.associate = (db) => {
    db.promocodes.belongsToMany(db.products, {
      as: 'products',
      constraints: false,
      through: 'promocodesProductsProducts',
    });

    db.promocodes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.promocodes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return promocodes;
};
