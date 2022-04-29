import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('subcategories');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const SubcategoriesSchema = new Schema(
    {
      name: {
        type: String,
      },
      slug: {
        type: String,
      },
      status: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable',
      },
      categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'category',
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

  SubcategoriesSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  SubcategoriesSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  SubcategoriesSchema.set('toJSON', {
    getters: true,
  });

  SubcategoriesSchema.set('toObject', {
    getters: true,
  });

  return database.model(
    'subcategories',
    SubcategoriesSchema,
  );
};
