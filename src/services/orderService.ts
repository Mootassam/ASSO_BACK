import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import OrderRepository from '../database/repositories/orderRepository';
import TaxesRepository from '../database/repositories/taxesRepository';
import TransactionRepository from '../database/repositories/transactionRepository';
import UserRepository from '../database/repositories/userRepository';

export default class OrderService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.userId = await UserRepository.filterIdInTenant(data.userId, { ...this.options, session });
      data.taxe = await TaxesRepository.filterIdInTenant(data.taxe, { ...this.options, session });
      data.transactionNumber = await TransactionRepository.filterIdsInTenant(data.transactionNumber, { ...this.options, session });

      const record = await OrderRepository.create(data, {
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
        'order',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.userId = await UserRepository.filterIdInTenant(data.userId, { ...this.options, session });
      data.taxe = await TaxesRepository.filterIdInTenant(data.taxe, { ...this.options, session });
      data.transactionNumber = await TransactionRepository.filterIdsInTenant(data.transactionNumber, { ...this.options, session });

      const record = await OrderRepository.update(
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
        'order',
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
        await OrderRepository.destroy(id, {
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
    return OrderRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return OrderRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return OrderRepository.findAndCountAll(
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
    const count = await OrderRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
