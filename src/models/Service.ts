import mongoose from 'mongoose';
import Pet from './Pet';

const serviceSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  type: { 
    type: [String],
    enum: ['bath', 'grooming', 'vet', 'boarding'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'fetching', 'in_progress', 'completed', 'returning'], 
    default: 'pending' 
  },
  scheduledDate: { type: Date, required: true },
  taxi: { type: Boolean, default: false },
  cep: { type: String }, // Novo campo opcional
  street: { type: String }, // Novo campo opcional
  number: { type: String }, // Novo campo opcional
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

if (!mongoose.models.Pet) {
  mongoose.model('Pet', Pet.schema);
}

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);