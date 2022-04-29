import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('trackOrder');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const TrackOrderSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      item: [{
        type: Schema.Types.ObjectId,
        ref: 'product',
      }],
      order: [{
        type: Schema.Types.ObjectId,
        ref: 'order',
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

  TrackOrderSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  TrackOrderSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  TrackOrderSchema.set('toJSON', {
    getters: true,
  });

  TrackOrderSchema.set('toObject', {
    getters: true,
  });

  return database.model('trackOrder', TrackOrderSchema);
};
