import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('objectif');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ObjectifSchema = new Schema(
    {
      number: {
        type: Number,
      },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      status: {
        type: String,
        enum: [
          "achieved",
          "waiting",
          null
        ],
      },
      year: {
        type: Number,
      },
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
      election: {
        type: Schema.Types.ObjectId,
        ref: 'election',
      },
      progression: {
        type: Number,
        max: 100
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

  ObjectifSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  ObjectifSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ObjectifSchema.set('toJSON', {
    getters: true,
  });

  ObjectifSchema.set('toObject', {
    getters: true,
  });

  return database.model('objectif', ObjectifSchema);
};
