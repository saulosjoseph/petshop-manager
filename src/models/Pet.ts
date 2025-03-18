import mongoose from 'mongoose';
import Tutor from './Tutor';

const petSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  ownerName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  birthDate: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

if (!mongoose.models.Tutor) {
  mongoose.model('Tutor', Tutor.schema);
}

export default mongoose.models.Pet || mongoose.model('Pet', petSchema);