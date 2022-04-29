import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('paymentsettings');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const PaymentsettingsSchema = new Schema(
    {
      name: {
        type: String,
      },
      information: {
        type: String,
      },
      uniqueKeywords: {
        type: String,
      },
      photo: [FileSchema],
      text: {
        type: String,
      },
      status: {
        type: String,
        enum: [
          "enable",
          "disable",
          null
        ],
      },
      type: {
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

  PaymentsettingsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  PaymentsettingsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  PaymentsettingsSchema.set('toJSON', {
    getters: true,
  });

  PaymentsettingsSchema.set('toObject', {
    getters: true,
  });

  return database.model('paymentsettings', PaymentsettingsSchema);
};
