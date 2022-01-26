const db = require('../db/models');
const PromocodesDBApi = require('../db/api/promocodes');

module.exports = class PromocodesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await PromocodesDBApi.create(data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let promocodes = await PromocodesDBApi.findBy({ id }, { transaction });

      if (!promocodes) {
        throw new ValidationError('promocodesNotFound');
      }

      await PromocodesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return promocodes;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await PromocodesDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
