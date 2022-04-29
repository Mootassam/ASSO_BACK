import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('attributeOptions');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const AttributeOptionsSchema = new Schema(
    {
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      keyword: {
        type: String,
      },
      stock: {
        type: Number,
      },
      attributeId: {
        type: Schema.Types.ObjectId,
        ref: 'attributes',
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

  AttributeOptionsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  AttributeOptionsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  AttributeOptionsSchema.set('toJSON', {
    getters: true,
  });

  AttributeOptionsSchema.set('toObject', {
    getters: true,
  });

  return database.model(
    'attributeOptions',
    AttributeOptionsSchema,
  );
};
