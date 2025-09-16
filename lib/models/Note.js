// lib/models/Note.js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  tenantSlug: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

NoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
