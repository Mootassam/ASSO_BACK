import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import AttributeOptionsRepository from '../database/repositories/attributeOptionsRepository';
import ProductRepository from '../database/repositories/productRepository';
import AttributesRepository from '../database/repositories/attributesRepository';

export default class AttributeOptionsService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.attributeId =
        await AttributesRepository.filterIdInTenant(
          data.attributeId,
          { ...this.options, session },
        );
      data.itemId =
        await ProductRepository.filterIdInTenant(
          data.itemId,
          { ...this.options, session },
        );

      const record =
        await AttributeOptionsRepository.create(data, {
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
        'attributeOptions',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.item = await ProductRepository.filterIdInTenant(
        data.item,
        { ...this.options, session },
      );
      data.attributeId =
        await AttributesRepository.filterIdInTenant(
          data.attributeId,
          { ...this.options, session },
        );

      const record =
        await AttributeOptionsRepository.update(id, data, {
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
        'attributeOptions',
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
        await AttributeOptionsRepository.destroy(id, {
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
    return AttributeOptionsRepository.findById(
      id,
      this.options,
    );
  }

  async findAllAutocomplete(search, limit) {
    return AttributeOptionsRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return AttributeOptionsRepository.findAndCountAll(
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
    const count = await AttributeOptionsRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
