import mongoose, { Schema, Document, models, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  department: 'CSE' | 'ME' | 'CE' | 'EE' | 'ECE';
  role: 'admin' | 'faculty' | 'student';
  profileImage?: string | null;
  isActive: boolean;
  enrollmentNumber?: string;
  employeeId?: string;
  division?: 'A' | 'B' | 'C';
  semester?: number;
  assignedSubjects?: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  department: { type: String, required: true, enum: ['CSE', 'ME', 'CE', 'EE', 'ECE'] },
  role: { type: String, required: true, enum: ['admin', 'faculty', 'student'], default: 'student' },
  profileImage: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  enrollmentNumber: { type: String, sparse: true, unique: true },
  employeeId: { type: String, sparse: true, unique: true },
  division: { type: String, enum: ['A', 'B', 'C'], required: function(this: IUser) { return this.role === 'student'; } },
  semester: { type: Number, min: 1, max: 8, required: function(this: IUser) { return this.role === 'student'; } },
  assignedSubjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }]
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

userSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre<IUser>('save', function(next) {
  if (this.role === 'student' && !this.enrollmentNumber) {
    const year = new Date().getFullYear().toString().slice(-2);
    const deptCode = this.department;
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.enrollmentNumber = `${year}${deptCode}${random}`;
  }
  if (this.role === 'faculty' && !this.employeeId) {
    const deptCode = this.department;
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.employeeId = `FAC${deptCode}${random}`;
  }
  next();
});

export default models.User || model<IUser>('User', userSchema);