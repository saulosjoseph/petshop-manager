import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  ownerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  birthDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pet || mongoose.model('Pet', petSchema);