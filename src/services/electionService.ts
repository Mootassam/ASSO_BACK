import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import ElectionRepository from '../database/repositories/electionRepository';
import AssociationRepository from '../database/repositories/associationRepository';
import UserRepository from '../database/repositories/userRepository';
import ObjectifRepository from '../database/repositories/objectifRepository';

export default class ElectionService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.members = await UserRepository.filterIdsInTenant(data.members, { ...this.options, session });
      data.association = await AssociationRepository.filterIdsInTenant(data.association, { ...this.options, session });
      data.objectifs = await ObjectifRepository.filterIdsInTenant(data.objectifs, { ...this.options, session });
      const record = await ElectionRepository.create(data, {
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
        'election',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.members = await UserRepository.filterIdsInTenant(data.members, { ...this.options, session });
      data.association = await AssociationRepository.filterIdsInTenant(data.association, { ...this.options, session });

      const record = await ElectionRepository.update(
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
        'election',
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
        await ElectionRepository.destroy(id, {
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
    return ElectionRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return ElectionRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return ElectionRepository.findAndCountAll(
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
    const count = await ElectionRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
