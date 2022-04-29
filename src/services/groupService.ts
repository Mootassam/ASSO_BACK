import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import GroupRepository from '../database/repositories/groupRepository';
import PartnerRepository from '../database/repositories/partnerRepository';
import UserRepository from '../database/repositories/userRepository';

export default class GroupService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.admin = await UserRepository.filterIdInTenant(data.admin, { ...this.options, session });
      data.members = await UserRepository.filterIdsInTenant(data.members, { ...this.options, session });
      data.partners = await PartnerRepository.filterIdsInTenant(data.partners, { ...this.options, session });

      const record = await GroupRepository.create(data, {
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
        'group',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.admin = await UserRepository.filterIdInTenant(data.admin, { ...this.options, session });
      data.members = await UserRepository.filterIdsInTenant(data.members, { ...this.options, session });
      data.partners = await PartnerRepository.filterIdsInTenant(data.partners, { ...this.options, session });

      const record = await GroupRepository.update(
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
        'group',
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
        await GroupRepository.destroy(id, {
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
    return GroupRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return GroupRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return GroupRepository.findAndCountAll(
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
    const count = await GroupRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
