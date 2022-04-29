import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('news');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const NewsSchema = new Schema(
    {
      name: {
        type: String,
      },
      type: {
        type: String,
        enum: [
          "news",
          "appelOffre",
          null
        ],
      },
      shortDescription: {
        type: String,
      },
      description: {
        type: String,
      },
      image: [FileSchema],
      attachements: [FileSchema],
      category: {
        type: Schema.Types.ObjectId,
        ref: 'newsCategory',
      },
      tags: [{
        type: Schema.Types.ObjectId,
        ref: 'newsTag',
      }],
      published: {
        type: Boolean,
        default: false
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

  NewsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  NewsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  NewsSchema.set('toJSON', {
    getters: true,
  });

  NewsSchema.set('toObject', {
    getters: true,
  });

  return database.model('news', NewsSchema);
};
