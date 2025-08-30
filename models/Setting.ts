// models/Setting.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInfo {
  id: string;
  value: string;
  type: 'address' | 'phone' | 'email';
}

export interface ISetting extends Document {
  siteName: string;
  contacts: IContactInfo[];
  logo: string;
  favicon: string;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema({
  id: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['address', 'phone', 'email'], required: true }
});

const SettingSchema: Schema = new Schema({
  siteName: { type: String, default: 'My Site' },
  contacts: [ContactSchema],
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
}, {
  timestamps: true,
});

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);