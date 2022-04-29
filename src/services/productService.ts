import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import ProductRepository from '../database/repositories/productRepository';
import TaxesRepository from '../database/repositories/taxesRepository';
import CategoryRepository from '../database/repositories/categoryRepository';
import SubcategoriesRepository from '../database/repositories/subcategoriesRepository';
import ChieldCategoriesRepository from '../database/repositories/chieldCategoriesRepository';
import BrandsRepository from '../database/repositories/brandsRepository';
import GalleryRepository from '../database/repositories/galleryRepository';

export default class ProductService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.taxe = await TaxesRepository.filterIdInTenant(
        data.taxe,
        { ...this.options, session },
      );
      data.category =
        await CategoryRepository.filterIdInTenant(
          data.category,
          { ...this.options, session },
        );
      data.subcategory =
        await SubcategoriesRepository.filterIdInTenant(
          data.subcategory,
          { ...this.options, session },
        );
      data.childcategory =
        await ChieldCategoriesRepository.filterIdInTenant(
          data.childcategory,
          { ...this.options, session },
        );
      data.brand = await BrandsRepository.filterIdInTenant(
        data.brand,
        { ...this.options, session },
      );
      data.gallery =
        await GalleryRepository.filterIdInTenant(
          data.gallery,
          { ...this.options, session },
        );

      const record = await ProductRepository.create(data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'product',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.taxe = await TaxesRepository.filterIdInTenant(
        data.taxe,
        { ...this.options, session },
      );
      data.category =
        await CategoryRepository.filterIdInTenant(
          data.category,
          { ...this.options, session },
        );
      data.subcategory =
        await SubcategoriesRepository.filterIdInTenant(
          data.subcategory,
          { ...this.options, session },
        );
      data.childcategory =
        await ChieldCategoriesRepository.filterIdInTenant(
          data.childcategory,
          { ...this.options, session },
        );
      data.brand = await BrandsRepository.filterIdInTenant(
        data.brand,
        { ...this.options, session },
      );
      data.gallery =
        await GalleryRepository.filterIdInTenant(
          data.gallery,
          { ...this.options, session },
        );

      const record = await ProductRepository.update(
        id,
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'product',
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await ProductRepository.destroy(id, {
          ...this.options,
          session,
        });
      }

      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async findById(id) {
    return ProductRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return ProductRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return ProductRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash) {
    const count = await ProductRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
