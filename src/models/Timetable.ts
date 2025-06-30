import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
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
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    lowercase: true
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
  room: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure end time is after start time
timetableSchema.pre('save', function(next) {
  const startTime = new Date(`1970/01/01 ${this.startTime}`).getTime();
  const endTime = new Date(`1970/01/01 ${this.endTime}`).getTime();

  if (endTime <= startTime) {
    next(new Error('End time must be after start time'));
  }
  next();
});

// Index for efficient queries
timetableSchema.index({ subjectId: 1, day: 1 });
timetableSchema.index({ facultyId: 1, day: 1 });
timetableSchema.index({ students: 1, day: 1 });

const Timetable = mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);

export default Timetable;