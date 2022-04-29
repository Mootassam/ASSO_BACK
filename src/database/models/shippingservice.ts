import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('shippingservice');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ShippingserviceSchema = new Schema(
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
        enum: [
          "enable",
          "disable",
          null
        ],
      },
      minimumPrice: {
        type: Number,
      },
      isCondition: {
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

  ShippingserviceSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  ShippingserviceSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ShippingserviceSchema.set('toJSON', {
    getters: true,
  });

  ShippingserviceSchema.set('toObject', {
    getters: true,
  });

  return database.model('shippingservice', ShippingserviceSchema);
};
