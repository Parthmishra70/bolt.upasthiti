import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';
import Subject from '@/app/models/Subject';
import User from '@/app/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/education_system';

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter: any = { isActive: true };
    if (searchParams.get('department')) filter.department = searchParams.get('department');
    if (searchParams.get('semester')) filter.semester = Number(searchParams.get('semester'));
    if (searchParams.get('facultyId')) filter.facultyId = searchParams.get('facultyId');
    const subjects = await Subject.find(filter)
      .populate('facultyId', '_id username email employeeId')
      .sort({ department: 1, semester: 1, name: 1 });
    return NextResponse.json({ subjects });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error?.toString() }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, code, department, credits, semester, facultyId, description } = body;
    // Check if subject code already exists
    const existingSubject = await Subject.findOne({ code });
    if (existingSubject) {
      return NextResponse.json({ message: 'Subject code already exists' }, { status: 400 });
    }
    const subjectData: any = { name, code, department, credits, semester, description };
    if (facultyId) {
      const faculty = await User.findById(facultyId);
      if (!faculty || faculty.role !== 'faculty') {
        return NextResponse.json({ message: 'Invalid faculty ID' }, { status: 400 });
      }
      subjectData.facultyId = facultyId;
      subjectData.facultyName = faculty.username;
    }
    const subject = new Subject(subjectData);
    await subject.save();
    const populatedSubject = await Subject.findById(subject._id)
      .populate('facultyId', 'username email employeeId');
    return NextResponse.json({ message: 'Subject created successfully', subject: populatedSubject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error?.toString() }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('id');
    if (!subjectId) {
      return NextResponse.json({ message: 'Subject ID is required' }, { status: 400 });
    }
    const body = await req.json();
    const updateData: any = { ...body };
    if (body.facultyId) {
      const faculty = await User.findById(body.facultyId);
      if (!faculty || faculty.role !== 'faculty') {
        return NextResponse.json({ message: 'Invalid faculty ID' }, { status: 400 });
      }
      updateData.facultyName = faculty.username;
    } else if (body.facultyId === null) {
      updateData.facultyId = null;
      updateData.facultyName = null;
    }
    const updated = await Subject.findByIdAndUpdate(subjectId, updateData, { new: true })
      .populate('facultyId', 'username email employeeId');
    if (!updated) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Subject updated successfully', subject: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error?.toString() }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('id');
    if (!subjectId) {
      return NextResponse.json({ message: 'Subject ID is required' }, { status: 400 });
    }
    const updated = await Subject.findByIdAndUpdate(subjectId, { isActive: false }, { new: true });
    if (!updated) {
      return NextResponse.json({ message: 'Subject not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Subject deleted (soft) successfully', subject: updated });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error?.toString() }, { status: 500 });
  }
}