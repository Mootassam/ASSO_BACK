import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import MembershipRepository from '../database/repositories/membershipRepository';
import FormuleRepository from '../database/repositories/formuleRepository';
import CampaignRepository from '../database/repositories/campaignRepository';
import UserRepository from '../database/repositories/userRepository';

export default class MembershipService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.formule =
        await FormuleRepository.filterIdInTenant(
          data.formule,
          { ...this.options, session },
        );
      data.user = await UserRepository.filterIdInTenant(
        data.user,
        { ...this.options, session },
      );
      data.campaign =
        await CampaignRepository.filterIdInTenant(
          data.campaign,
          { ...this.options, session },
        );

      const record = await MembershipRepository.create(
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
        'membership',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.formule =
        await FormuleRepository.filterIdInTenant(
          data.formule,
          { ...this.options, session },
        );
      data.user = await UserRepository.filterIdInTenant(
        data.user,
        { ...this.options, session },
      );
      data.campaign =
        await CampaignRepository.filterIdInTenant(
          data.campaign,
          { ...this.options, session },
        );

      const record = await MembershipRepository.update(
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
        'membership',
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
        await MembershipRepository.destroy(id, {
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
    return MembershipRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return MembershipRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return MembershipRepository.findAndCountAll(
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
    const count = await MembershipRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
