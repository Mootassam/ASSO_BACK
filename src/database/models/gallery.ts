import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('gallery');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const GallerySchema = new Schema(
    {
      photos: [FileSchema],
      name: {
        type: String,
        required: true,
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

  GallerySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  GallerySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  GallerySchema.set('toJSON', {
    getters: true,
  });

  GallerySchema.set('toObject', {
    getters: true,
  });

  return database.model('gallery', GallerySchema);
};
