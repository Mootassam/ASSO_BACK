import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('coupons');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const CouponsSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      codeName: {
        type: String,
        required: true,
      },
      discount: {
        type: Number,
        required: true,
      },
      noOfTimes: {
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
        required: true,
        enum: ['Percentage (%)', 'amount ( TND)'],
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

  CouponsSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  CouponsSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  CouponsSchema.set('toJSON', {
    getters: true,
  });

  CouponsSchema.set('toObject', {
    getters: true,
  });

  return database.model('coupons', CouponsSchema);
};
