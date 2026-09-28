import mongoose from 'mongoose';
const { Schema } = mongoose;
function schema(fields) {
  return new Schema(fields, { timestamps: true, toJSON: { transform(_doc, obj) {
    obj.id = obj._id.toString(); delete obj._id; delete obj.__v;
    delete obj.password; delete obj.username; delete obj.reminderClaimedAt;
    return obj;
  } } });
}
export const User = mongoose.model('User', schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firstName: String, lastName: String, password: { type: String, required: true, select: false },
  roles: { type: String, default: 'USER' }
}));
const todoSchema = schema({
  username: { type: String, required: true, index: true }, userEmail: String,
  description: { type: String, required: true, maxlength: 1000 },
  done: { type: Boolean, default: false }, targetDate: String,
  reminderSent: { type: Boolean, default: false }, reminderClaimedAt: Date,
  category: { type: String, default: 'Manual Todo' }, skill: String,
  priority: { type: String, enum: ['HIGH','MEDIUM','LOW'], default: 'MEDIUM' },
  estimatedHours: { type: Number, default: 1, min: 0 }, roadmapStepNo: Number,
  createdFromAi: { type: Boolean, default: false }, analysisKey: String
});
todoSchema.index({ username: 1, analysisKey: 1 });
export const Todo = mongoose.model('Todo', todoSchema);
export const Analysis = mongoose.model('CareerAnalysis', schema({
  username: { type: String, required: true, index: true }, targetRole: String,
  resumeFileName: String, atsScore: Number, analysisKey: String, conversationId: String,
  jobDescription: String, resumeText: String, aiJsonResponse: String,
  resumeSummary: String, jobDescriptionSummary: String, aiAnalysisSummary: String
}));
const chatSchema = schema({
  username: { type: String, required: true }, analysisId: { type: Schema.Types.ObjectId, required: true },
  conversationId: String, role: { type: String, enum: ['USER','AI'] }, message: String
});
chatSchema.index({ username: 1, analysisId: 1, createdAt: 1 });
export const Chat = mongoose.model('ResumeChatMessage', chatSchema);
