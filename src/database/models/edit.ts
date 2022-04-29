import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('edit');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const EditSchema = new Schema(
    {
      campaignTitle: {
        type: String,
        required: true,
      },
      campaignLastDateTime: {
        type: Date,
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

  EditSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  EditSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  EditSchema.set('toJSON', {
    getters: true,
  });

  EditSchema.set('toObject', {
    getters: true,
  });

  return database.model('edit', EditSchema);
};
