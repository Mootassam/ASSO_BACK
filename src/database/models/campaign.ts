import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('campaign');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CampaignSchema = new Schema(
    {
      name: {
        type: String,
      },
      membership: [{
        type: Schema.Types.ObjectId,
        ref: 'membership',
      }],
      status: {
        type: String,
        enum: [
          "published",
          "draft",
          "suspended",
          "archived",
          null
        ],
      },
      year: {
        type: Number,
      },
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
      tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
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

  CampaignSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  CampaignSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CampaignSchema.set('toJSON', {
    getters: true,
  });

  CampaignSchema.set('toObject', {
    getters: true,
  });

  return database.model('campaign', CampaignSchema);
};
