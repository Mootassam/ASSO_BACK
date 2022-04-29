import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('partner');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PartnerSchema = new Schema(
    {
      acronym: {
        type: String,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      logo: [FileSchema],
      postalAddress: {
        type: String,
      },
      postalCode: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
      type: {
        type: String,
        enum: [
          "association",
          "funder",
          null
        ],
      },
      group: [{
        type: Schema.Types.ObjectId,
        ref: 'group',
      }],
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

  PartnerSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PartnerSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PartnerSchema.set('toJSON', {
    getters: true,
  });

  PartnerSchema.set('toObject', {
    getters: true,
  });

  return database.model('partner', PartnerSchema);
};
