import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('cart');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CartSchema = new Schema(
    {
      optionsId: [{
        type: Schema.Types.ObjectId,
        ref: 'attributeOptions',
      }],
      attribute: {
        type: String,
      },
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
      qty: {
        type: Number,
      },
      price: {
        type: Number,
      },
      mainPrice: {
        type: Number,
      },
      photo: [FileSchema],
      itemType: {
        type: String,
      },
      itemLN: {
        type: String,
      },
      itemLK: {
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

  CartSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  CartSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CartSchema.set('toJSON', {
    getters: true,
  });

  CartSchema.set('toObject', {
    getters: true,
  });

  return database.model('cart', CartSchema);
};
