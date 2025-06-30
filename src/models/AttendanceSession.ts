import mongoose from 'mongoose';

const attendanceSessionSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject is required']
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Faculty is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)']
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['regular', 'extra', 'makeup'],
    default: 'regular'
  },
  room: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  presentCount: {
    type: Number,
    default: 0
  },
  verificationMethod: {
    type: String,
    enum: ['face', 'manual', 'both'],
    default: 'both'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure end time is after start time
attendanceSessionSchema.pre('save', function(next) {
  const startTime = new Date(`1970/01/01 ${this.startTime}`).getTime();
  const endTime = new Date(`1970/01/01 ${this.endTime}`).getTime();

  if (endTime <= startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Index for efficient queries
attendanceSessionSchema.index({ subjectId: 1, date: 1 });
attendanceSessionSchema.index({ facultyId: 1, date: 1 });
attendanceSessionSchema.index({ status: 1 });

const AttendanceSession = mongoose.models.AttendanceSession || mongoose.model('AttendanceSession', attendanceSessionSchema);

export default AttendanceSession;