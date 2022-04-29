import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('chieldCategories');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ChieldCategoriesSchema = new Schema(
    {
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
      subcategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'subcategories',
      },
      status: {
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

  ChieldCategoriesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ChieldCategoriesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ChieldCategoriesSchema.set('toJSON', {
    getters: true,
  });

  ChieldCategoriesSchema.set('toObject', {
    getters: true,
  });

  return database.model(
    'chieldCategories',
    ChieldCategoriesSchema,
  );
};
