import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'create', 'update', 'delete', 'auth'], default: 'info' }
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);
