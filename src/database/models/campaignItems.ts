import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('campaignItems');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CampaignItemsSchema = new Schema(
    {
      status: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable',
      },
      isFeature: {
        type: String,
        enum: ['publish', 'unpublish'],
        default: 'publish',
      },
      itemId: [
        {
          type: Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
      ],
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true,
      },
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      importHash: { type: String },
    },
    { timestamps: true },
  );

  CampaignItemsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  CampaignItemsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CampaignItemsSchema.set('toJSON', {
    getters: true,
  });

  CampaignItemsSchema.set('toObject', {
    getters: true,
  });

  return database.model(
    'campaignItems',
    CampaignItemsSchema,
  );
};
