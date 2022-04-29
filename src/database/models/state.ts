import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('state');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const StateSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['enable', 'disable'],
        default: 'enable',
      },
      type: {
        type: String,
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

  StateSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  StateSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  StateSchema.set('toJSON', {
    getters: true,
  });

  StateSchema.set('toObject', {
    getters: true,
  });

  return database.model('state', StateSchema);
};
