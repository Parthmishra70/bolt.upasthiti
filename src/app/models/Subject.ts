import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  department: 'CSE' | 'ME' | 'CE' | 'EE' | 'ECE';
  credits: number;
  semester: number;
  facultyId?: mongoose.Types.ObjectId;
  facultyName?: string;
  description?: string;
  isActive: boolean;
  syllabus?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const subjectSchema = new Schema<ISubject>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  department: { type: String, required: true, enum: ['CSE', 'ME', 'CE', 'EE', 'ECE'] },
  credits: { type: Number, required: true, min: 1, max: 6 },
  semester: { type: Number, required: true, min: 1, max: 8 },
  facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  facultyName: { type: String, required: false },
  description: { type: String, maxlength: 500 },
  isActive: { type: Boolean, default: true },
  syllabus: { type: String, default: null }
}, { timestamps: true });

subjectSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

subjectSchema.index({ department: 1, semester: 1 });
subjectSchema.index({ facultyId: 1 });

export default models.Subject || model<ISubject>('Subject', subjectSchema);