import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('review');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ReviewSchema = new Schema(
    {
      review: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: [
          "enable",
          "disable",
          null
        ],
      },
      subject: {
        type: String,
        required: true,
      },
      item: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
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

  ReviewSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  ReviewSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ReviewSchema.set('toJSON', {
    getters: true,
  });

  ReviewSchema.set('toObject', {
    getters: true,
  });

  return database.model('review', ReviewSchema);
};
