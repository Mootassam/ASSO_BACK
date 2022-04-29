import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('brands');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const BrandsSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
      },
      photo: [FileSchema],
      status: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable',
      },
      isPopular: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable',
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

  BrandsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  BrandsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  BrandsSchema.set('toJSON', {
    getters: true,
  });

  BrandsSchema.set('toObject', {
    getters: true,
  });

  return database.model('brands', BrandsSchema);
};
