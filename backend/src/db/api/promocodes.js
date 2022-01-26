const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PromocodesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const promocodes = await db.promocodes.create(
      {
        id: data.id || undefined,

        code: data.code || null,
        discount: data.discount || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await promocodes.setProducts(data.products || [], {
      transaction,
    });

    return promocodes;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const promocodes = await db.promocodes.findByPk(id, {
      transaction,
    });

    await promocodes.update(
      {
        code: data.code || null,
        discount: data.discount || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await promocodes.setProducts(data.products || [], {
      transaction,
    });

    return promocodes;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const promocodes = await db.promocodes.findByPk(id, options);

    await promocodes.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await promocodes.destroy({
      transaction,
    });

    return promocodes;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const promocodes = await db.promocodes.findOne({ where }, { transaction });

    if (!promocodes) {
      return promocodes;
    }

    const output = promocodes.get({ plain: true });

    output.products = await promocodes.getProducts({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    if (filter.page != 1 && filter.page) {
      const currentPage = +filter.page - 1;
      offset = currentPage * limit;
    }
    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.products,
        as: 'products',
        through: filter.products
          ? {
              where: {
                [Op.or]: filter.products.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.products ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.code) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('promocodes', 'code', filter.code),
        };
      }

      if (filter.discountRange) {
        const [start, end] = filter.discountRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            discount: {
              ...where.discount,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            discount: {
              ...where.discount,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.promocodes.findAndCountAll({
      where,
      include,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: orderBy ? [orderBy.split('_')] : [['createdAt', 'DESC']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('promocodes', 'code', query),
        ],
      };
    }

    const records = await db.promocodes.findAll({
      attributes: ['id', 'code'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['code', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.code,
    }));
  }
};
