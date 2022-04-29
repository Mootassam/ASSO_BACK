import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('transaction');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TransactionSchema = new Schema(
    {
      amount: {
        type: Number,
      },
      email: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      tax: {
        type: Schema.Types.ObjectId,
        ref: 'taxes',
      },
      currencySign: {
        type: String,
      },
      currencyValue: {
        type: String,
      },
      orderId: [{
        type: Schema.Types.ObjectId,
        ref: 'order',
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

  TransactionSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  TransactionSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TransactionSchema.set('toJSON', {
    getters: true,
  });

  TransactionSchema.set('toObject', {
    getters: true,
  });

  return database.model('transaction', TransactionSchema);
};
