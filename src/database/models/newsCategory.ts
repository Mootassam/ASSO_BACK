import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('newsCategory');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const NewsCategorySchema = new Schema(
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      news: [{
        type: Schema.Types.ObjectId,
        ref: 'news',
      }],
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

  NewsCategorySchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  NewsCategorySchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  NewsCategorySchema.set('toJSON', {
    getters: true,
  });

  NewsCategorySchema.set('toObject', {
    getters: true,
  });

  return database.model('newsCategory', NewsCategorySchema);
};
