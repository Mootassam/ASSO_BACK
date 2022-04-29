import mongoose from 'mongoose';
import FileSchema from './schemas/fileSchema';
const Schema = mongoose.Schema;

export default (database) => {
  try {
    return database.model('association');
  } catch (error) {
    // continue, because model doesnt exist
  }

  const AssociationSchema = new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      logo: [FileSchema],
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      postalCode: {
        type: Number,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      admins: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
      }],
      elections: [{
        type: Schema.Types.ObjectId,
        ref: 'election',
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

  AssociationSchema.index(
    { importHash: 1, tenant: 1 },
    {
      unique: true,
      partialFilterExpression: {
        importHash: { $type: 'string' },
      },
    },
  );

  

  AssociationSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
  });

  AssociationSchema.set('toJSON', {
    getters: true,
  });

  AssociationSchema.set('toObject', {
    getters: true,
  });

  return database.model('association', AssociationSchema);
};
