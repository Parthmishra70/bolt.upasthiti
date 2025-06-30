import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceSession',
    required: [true, 'Attendance session is required']
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student is required']
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'absent'
  },
  verificationMethod: {
    type: String,
    enum: ['face', 'manual'],
    required: [true, 'Verification method is required']
  },
  verifiedAt: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      latitude: Number,
      longitude: Number
    },
    required: false
  },
  notes: {
    type: String,
    trim: true
  }
});

// Compound index to ensure unique attendance records per session per student
attendanceSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

// Index for efficient queries
attendanceSchema.index({ studentId: 1, status: 1 });
attendanceSchema.index({ sessionId: 1, status: 1 });

const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;