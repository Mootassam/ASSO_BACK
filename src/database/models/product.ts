import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('product');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ProductSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      slug: {
        type: String,
      },
      tags: {
        type: String,
      },
      video: {
        type: String,
      },
      detailspecification: [
        {
          specificationName: { type: String },
          specificationDesciption: { type: String },
        },
      ],

      details: {
        type: String,
        required: true,
      },
      photo: [FileSchema],
      discountPrice: {
        type: Number,
      },
      previousPrice: {
        type: Number,
      },
      stock: {
        type: Number,
      },
      metaKeywords: {
        type: String,
      },
      metaDesctiption: {
        type: String,
      },
      status: {
        type: String,
        enum: ['publish', 'unpublish'],
        default: 'publish',
      },
      isType: {
        type: String,
      },
      date: {
        type: String,
      },
      itemType: {
        type: String,
        enum: ['physical', 'digitale'],
        default: 'physical',
      },
      file: [FileSchema],
      link: {
        type: String,
      },
      taxe: {
        type: Schema.Types.ObjectId,
        ref: 'taxes',
      },
      category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
      },
      subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'subcategories',
        required: true,
      },
      childcategory: {
        type: Schema.Types.ObjectId,
        ref: 'chieldCategories',
        required: true,
      },
      brand: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
      },
      gallery: {
        type: Schema.Types.ObjectId,
        ref: 'gallery',
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

  ProductSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  ProductSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ProductSchema.set('toJSON', {
    getters: true,
  });

  ProductSchema.set('toObject', {
    getters: true,
  });

  return database.model('product', ProductSchema);
};
