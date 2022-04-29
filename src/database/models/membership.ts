import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('membership');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const MembershipSchema = new Schema(
    {
      status: {
        type: String,
        enum: ['paid', 'waiting', null],
      },
      paymentMethod: {
        type: String,
        enum: ['cash', 'check', 'bank', null],
      },
      formule: {
        type: Schema.Types.ObjectId,
        ref: 'formule',
      },
      attachements: [FileSchema],
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      campaign: {
        type: Schema.Types.ObjectId,
        ref: 'campaign',
      },
      amount: {
        type: Number,
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

  MembershipSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  MembershipSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  MembershipSchema.set('toJSON', {
    getters: true,
  });

  MembershipSchema.set('toObject', {
    getters: true,
  });

  return database.model('membership', MembershipSchema);
};
