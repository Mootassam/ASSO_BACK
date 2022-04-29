import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('formule');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const FormuleSchema = new Schema(
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      amount: {
        type: Number,
      },
      membership: [{
        type: Schema.Types.ObjectId,
        ref: 'membership',
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

  FormuleSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  FormuleSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  FormuleSchema.set('toJSON', {
    getters: true,
  });

  FormuleSchema.set('toObject', {
    getters: true,
  });

  return database.model('formule', FormuleSchema);
};
