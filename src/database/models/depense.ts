import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('depense');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const DepenseSchema = new Schema(
    {
      facture: {
        type: Boolean,
        default: false
      },
      charge: [{
        type: Schema.Types.ObjectId,
        ref: 'charge',
      }],
      amount: {
        type: Number,
      },
      type: {
        type: String,
        enum: [
          "salaires",
          "loyers",
          "impots",
          null
        ],
      },
      date: {
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

  DepenseSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  DepenseSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  DepenseSchema.set('toJSON', {
    getters: true,
  });

  DepenseSchema.set('toObject', {
    getters: true,
  });

  return database.model('depense', DepenseSchema);
};
