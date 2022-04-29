import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('attributes');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const AttributesSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      itemId: {
        type: Schema.Types.ObjectId,
        ref: 'product',
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

  AttributesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  AttributesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  AttributesSchema.set('toJSON', {
    getters: true,
  });

  AttributesSchema.set('toObject', {
    getters: true,
  });

  return database.model('attributes', AttributesSchema);
};
