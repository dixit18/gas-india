import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100, index: true },
    city: { type: String, default: '', trim: true, maxlength: 60 },
  },
  { timestamps: true }
);

// Pre-written positive polls only. No free text, no DMs — safety by design.
const pollSchema = new mongoose.Schema(
  {
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', index: true },
    question: { type: String, required: true, trim: true, maxlength: 120 },
    options: { type: [String], validate: [(v) => v.length === 4, 'need 4 options'] },
    category: { type: String, enum: ['kindness', 'talent', 'fun', 'cricket', 'fest'], default: 'kindness', index: true },
  },
  { timestamps: true }
);

const voteSchema = new mongoose.Schema(
  {
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', index: true },
    optionIdx: { type: Number, min: 0, max: 3 },
    voterKey: { type: String, required: true, maxlength: 80 },
    grade: { type: String, default: '', maxlength: 20 },
  },
  { timestamps: true }
);
voteSchema.index({ pollId: 1, voterKey: 1 }, { unique: true });

const flameSchema = new mongoose.Schema(
  {
    toUser: { type: String, required: true, trim: true, index: true },
    fromHint: { type: String, default: '', maxlength: 40 },
    question: { type: String, default: '', maxlength: 120 },
  },
  { timestamps: true }
);

export const School = mongoose.models.School || mongoose.model('School', schoolSchema);
export const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema);
export const Vote = mongoose.models.Vote || mongoose.model('Vote', voteSchema);
export const Flame = mongoose.models.Flame || mongoose.model('Flame', flameSchema);
