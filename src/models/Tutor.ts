import mongoose from 'mongoose';

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);