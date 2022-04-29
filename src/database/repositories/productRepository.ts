import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Product from '../models/product';
import FileRepository from './fileRepository';
import CampaignItems from '../models/campaignItems';
import TrackOrder from '../models/trackOrder';
import AttributeOptions from '../models/attributeOptions';
import Review from '../models/review';

class ProductRepository {
  static async create(data, options: IRepositoryOptions) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);
    const currentUser =
      MongooseRepository.getCurrentUser(options);
    const [record] = await Product(
      options.database,
    ).insertMany(
      [
        {
          ...data,
          detailspecification: Object.values(
            data.detailspecification,
          ),
          itemType: data.itemType,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        },
      ],
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );

    return this.findById(record.id, options);
  }

  static async update(
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Product(options.database).findOne({
          _id: id,
          tenant: currentTenant.id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }
    if (data?.detailspecification) {
      await Product(options.database).updateMany(
        { _id: id },
        {
          ...data,
          detailspecification: Object.values(
            data.detailspecification,
          ),
          updatedBy:
            MongooseRepository.getCurrentUser(options).id,
        },
        options,
      );
    } else {
      await Product(options.database).updateMany(
        { _id: id },
        {
          ...data,
          updatedBy:
            MongooseRepository.getCurrentUser(options).id,
        },
        options,
      );
    }

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    record = await this.findById(id, options);

    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Product(options.database).findOne({
          _id: id,
          tenant: currentTenant.id,
        }),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    await Product(options.database).deleteOne(
      { _id: id },
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      CampaignItems(options.database),
      'itemId',
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      TrackOrder(options.database),
      'item',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      AttributeOptions(options.database),
      'item',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Review(options.database),
      'item',
      options,
    );
  }

  static async filterIdInTenant(
    id,
    options: IRepositoryOptions,
  ) {
    return lodash.get(
      await this.filterIdsInTenant([id], options),
      '[0]',
      null,
    );
  }

  static async filterIdsInTenant(
    ids,
    options: IRepositoryOptions,
  ) {
    if (!ids || !ids.length) {
      return [];
    }

    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    const records = await Product(options.database)
      .find({
        _id: { $in: ids },
        tenant: currentTenant.id,
      })
      .select(['_id']);

    return records.map((record) => record._id);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    return MongooseRepository.wrapWithSessionIfExists(
      Product(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options,
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    let record =
      await MongooseRepository.wrapWithSessionIfExists(
        Product(options.database)
          .findOne({ _id: id, tenant: currentTenant.id })
          .populate('taxe')
          .populate('category')
          .populate('subcategory')
          .populate('childcategory')
          .populate('brand')
          .populate('gallery'),
        options,
      );

    if (!record) {
      throw new Error404();
    }

    return this._mapRelationshipsAndFillDownloadUrl(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: any = [];

    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ['_id']: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.name) {
        criteriaAnd.push({
          name: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.name,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.slug) {
        criteriaAnd.push({
          slug: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.slug,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.tags) {
        criteriaAnd.push({
          tags: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.tags,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.video) {
        criteriaAnd.push({
          video: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.video,
            ),
            $options: 'i',
          },
        });
      }

      // if (filter.specificationName) {
      //   criteriaAnd.push({
      //     specificationName: {
      //       $regex: MongooseQueryUtils.escapeRegExp(
      //         filter.specificationName,
      //       ),
      //       $options: 'i',
      //     },
      //   });
      // }

      if (filter.specificationDesciption) {
        criteriaAnd.push({
          specificationDesciption: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.specificationDesciption,
            ),
            $options: 'i',
          },
        });
      }

      if (
        filter.isSpecification === true ||
        filter.isSpecification === 'true' ||
        filter.isSpecification === false ||
        filter.isSpecification === 'false'
      ) {
        criteriaAnd.push({
          isSpecification:
            filter.isSpecification === true ||
            filter.isSpecification === 'true',
        });
      }

      if (filter.details) {
        criteriaAnd.push({
          details: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.details,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.discountPriceRange) {
        const [start, end] = filter.discountPriceRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            discountPrice: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            discountPrice: {
              $lte: end,
            },
          });
        }
      }

      if (filter.previousPriceRange) {
        const [start, end] = filter.previousPriceRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            previousPrice: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            previousPrice: {
              $lte: end,
            },
          });
        }
      }

      if (filter.stockRange) {
        const [start, end] = filter.stockRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            stock: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            stock: {
              $lte: end,
            },
          });
        }
      }

      if (filter.metaKeywords) {
        criteriaAnd.push({
          metaKeywords: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.metaKeywords,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.metaDesctiption) {
        criteriaAnd.push({
          metaDesctiption: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.metaDesctiption,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.status) {
        criteriaAnd.push({
          status: filter.status,
        });
      }

      if (filter.isType) {
        criteriaAnd.push({
          isType: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.isType,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.dateRange) {
        const [start, end] = filter.dateRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            date: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            date: {
              $lte: end,
            },
          });
        }
      }

      if (filter.itemType) {
        criteriaAnd.push({
          itemType: filter.itemType,
        });
      }

      if (filter.link) {
        criteriaAnd.push({
          link: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.link,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.fileType) {
        criteriaAnd.push({
          fileType: filter.fileType,
        });
      }

      if (filter.taxe) {
        criteriaAnd.push({
          taxe: MongooseQueryUtils.uuid(filter.taxe),
        });
      }

      if (filter.category) {
        criteriaAnd.push({
          category: MongooseQueryUtils.uuid(
            filter.category,
          ),
        });
      }

      if (filter.subcategory) {
        criteriaAnd.push({
          subcategory: MongooseQueryUtils.uuid(
            filter.subcategory,
          ),
        });
      }

      if (filter.childcategory) {
        criteriaAnd.push({
          childcategory: MongooseQueryUtils.uuid(
            filter.childcategory,
          ),
        });
      }

      if (filter.brand) {
        criteriaAnd.push({
          brand: MongooseQueryUtils.uuid(filter.brand),
        });
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(
      orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length
      ? { $and: criteriaAnd }
      : null;

    let rows = await Product(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('taxe')
      .populate('category')
      .populate('subcategory')
      .populate('childcategory')
      .populate('brand')
      .populate('gallery');

    const count = await Product(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl),
    );

    return { rows, count };
  }

  static async findAllAutocomplete(
    search,
    limit,
    options: IRepositoryOptions,
  ) {
    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    let criteriaAnd: Array<any> = [
      {
        tenant: currentTenant.id,
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            name: {
              $regex:
                MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('name_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Product(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }

  static async _createAuditLog(
    action,
    id,
    data,
    options: IRepositoryOptions,
  ) {
    await AuditLogRepository.log(
      {
        entityName: Product(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }

  static async _mapRelationshipsAndFillDownloadUrl(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject
      ? record.toObject()
      : record;

    output.photo = await FileRepository.fillDownloadUrl(
      output.photo,
    );

    output.file = await FileRepository.fillDownloadUrl(
      output.file,
    );

    return output;
  }
}

export default ProductRepository;
