import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('charge');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ChargeSchema = new Schema(
    {
      type: {
        type: String,
        enum: ['salaires', 'loyers', 'impots', null],
      },
      amount: {
        type: Number,
      },
      date: {
        type: String,
      },
      depense: {
        type: Schema.Types.ObjectId,
        ref: 'depense',
      },
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

  ChargeSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ChargeSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ChargeSchema.set('toJSON', {
    getters: true,
  });

  ChargeSchema.set('toObject', {
    getters: true,
  });

  return database.model('charge', ChargeSchema);
};
