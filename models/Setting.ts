// models/Setting.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInfo {
  id: string;
  value: string;
  type: 'address' | 'phone' | 'email';
}

export interface ISocialMedia {
  id: string;
  platform: string;
  url: string;
}

export interface ISetting extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contacts: IContactInfo[];
  socialMedia: ISocialMedia[];
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  seoDescription: string;
  seoKeywords: string;
  updatedAt: Date;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  id: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, enum: ['address', 'phone', 'email'], required: true }
});

const SocialMediaSchema: Schema = new Schema({
  id: { type: String, required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true }
});

const SettingSchema: Schema = new Schema({
  siteName: { type: String, default: 'My Site' },
  siteDescription: { type: String, default: '' },
  siteUrl: { type: String, default: '' },
  contacts: [ContactSchema],
  socialMedia: [SocialMediaSchema],
  logo: { type: String, default: '' },
  favicon: { type: String, default: '' },
  primaryColor: { type: String, default: '#3b82f6' },
  secondaryColor: { type: String, default: '#10b981' },
  maintenanceMode: { type: Boolean, default: false },
  allowRegistrations: { type: Boolean, default: true },
  seoDescription: { type: String, default: '' },
  seoKeywords: { type: String, default: '' }
}, {
  timestamps: true,
});

export default mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);