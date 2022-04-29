import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('election');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const ElectionSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      members: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
      pv: [FileSchema],
      association: [{
        type: Schema.Types.ObjectId,
        ref: 'association',
      }],
      objectifs: [{
        type: Schema.Types.ObjectId,
        ref: 'objectif',
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

  ElectionSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  ElectionSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  ElectionSchema.set('toJSON', {
    getters: true,
  });

  ElectionSchema.set('toObject', {
    getters: true,
  });

  return database.model('election', ElectionSchema);
};
