import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('entree');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const EntreeSchema = new Schema(
    {
      type: {
        type: String,
        enum: [
          "e-commerce",
          "boutique",
          null
        ],
      },
      sourceLink: {
        type: String,
      },
      amount: {
        type: Number,
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

  EntreeSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  EntreeSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  EntreeSchema.set('toJSON', {
    getters: true,
  });

  EntreeSchema.set('toObject', {
    getters: true,
  });

  return database.model('entree', EntreeSchema);
};
