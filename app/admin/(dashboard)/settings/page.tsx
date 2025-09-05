'use client';

import {AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {Bell,Copy,Eye,Globe,Image as ImageIcon,Mail,MapPin,Palette,Phone,Plus,Save,Settings2,Trash2,Upload} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ContactInfo {
  id: string;
  value: string;
  type: 'address' | 'phone' | 'email';
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contacts: ContactInfo[];
  socialMedia: SocialMedia[];
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  seoDescription: string;
  seoKeywords: string;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  created_at: string;
}

const socialMediaPlatforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'whatsapp', label: 'WhatsApp' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    contacts: [],
    socialMedia: [],
    logo: '',
    favicon: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    maintenanceMode: false,
    allowRegistrations: true,
    seoDescription: '',
    seoKeywords: '',
  });
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string>('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
    fetchImages();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/admin/images');
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files?.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Image uploaded successfully');
        fetchImages();
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('An error occurred while uploading the image');
    }
  };

  const deleteImage = async (publicId: string) => {
    try {
      const response = await fetch('/api/admin/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (response.ok) {
        setImages(images.filter(img => img.public_id !== publicId));
        setDeleteDialogOpen(false);
        toast.success('Image deleted successfully');
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('An error occurred while deleting the image');
    }
  };

  const addContact = (type: 'address' | 'phone' | 'email') => {
    setSettings(prev => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        { id: Date.now().toString(), value: '', type }
      ]
    }));
  };

  const updateContact = (id: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      contacts: prev.contacts?.map(contact =>
        contact?.id === id ? { ...contact, value } : contact
      )
    }));
  };

  const removeContact = (id: string) => {
    setSettings(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact?.id !== id)
    }));
  };

  const addSocialMedia = () => {
    setSettings(prev => ({
      ...prev,
      socialMedia: [
        ...prev.socialMedia,
        { id: Date.now().toString(), platform: '', url: '' }
      ]
    }));
  };

  const updateSocialMedia = (id: string, field: 'platform' | 'url', value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: prev.socialMedia?.map(sm =>
        sm.id === id ? { ...sm, [field]: value } : sm
      )
    }));
  };

  const removeSocialMedia = (id: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: prev.socialMedia.filter(sm => sm.id !== id)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: keyof SiteSettings, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getContactsByType = (type: 'address' | 'phone' | 'email') => {
    return settings?.contacts.filter(contact => contact?.type === type);
  };

  const getIconForContactType = (type: 'address' | 'phone' | 'email') => {
    switch (type) {
      case 'address': return <MapPin className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="h-8 w-8" />
            Site Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your site configuration, appearance, and media assets
          </p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={settings?.siteName|| ""}
                  onChange={handleInputChange}
                  placeholder="Enter your site name"
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings?.siteDescription|| ""}
                  onChange={handleInputChange}
                  placeholder="Brief description of your website"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  name="siteUrl"
                  value={settings?.siteUrl|| ""}
                  onChange={handleInputChange}
                  placeholder="https://yoursite.com"
                  type="url"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>
                Search engine optimization settings for your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  value={settings?.seoDescription|| ""}
                  onChange={handleInputChange}
                  placeholder="Description for search engines"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 150-160 characters. Current: {settings?.seoDescription?.length}
                </p>
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="seoKeywords">Meta Keywords</Label>
                <Input
                  id="seoKeywords"
                  name="seoKeywords"
                  value={settings?.seoKeywords|| ""}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground">
                  Separate keywords with commas
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>
                Important settings that affect how your site functions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, visitors will see a maintenance page
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings?.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowRegistrations">Allow User Registrations</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to create accounts on your site
                  </p>
                </div>
                <Switch
                  id="allowRegistrations"
                  checked={settings?.allowRegistrations}
                  onCheckedChange={(checked) => handleSwitchChange('allowRegistrations', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your site&apos;s visual identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={settings?.logo|| ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/logo.png"
                  />
                  {settings?.logo && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="relative w-32 h-32 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        <Image
                          src={settings?.logo}
                          alt="Site logo"
                          fill
                          className="object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    value={settings?.favicon|| ""}
                    onChange={handleInputChange}
                    placeholder="https://example.com/favicon.ico"
                  />
                  {settings?.favicon && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Preview:</p>
                      <div className="relative w-16 h-16 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        <Image
                          src={settings?.favicon}
                          alt="Site favicon"
                          fill
                          className="object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      value={settings?.primaryColor|| ""}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: settings?.primaryColor }}
                    />
                  </div>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      value={settings?.secondaryColor|| ""}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                    <div 
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: settings?.secondaryColor }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How visitors can get in touch with your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {['address', 'phone', 'email']?.map((type) => (
                <div key={type} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2 capitalize">
                      {getIconForContactType(type as 'address' | 'phone' | 'email')}
                      {type === 'address' ? 'Addresses' : 
                       type === 'phone' ? 'Phone Numbers' : 'Email Addresses'}
                    </Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addContact(type as 'address' | 'phone' | 'email')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add {type === 'address' ? 'Address' : type === 'phone' ? 'Phone' : 'Email'}
                    </Button>
                  </div>
                  
                  {getContactsByType(type as 'address' | 'phone' | 'email')?.map((contact) => (
                    <div key={contact?.id} className="flex gap-2 items-start">
                      <Input
                        value={contact?.value}
                        onChange={(e) => updateContact(contact?.id, e.target.value)}
                        placeholder={`Enter ${type}`}
                        type={type === 'email' ? 'email' : 'text'}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeContact(contact?.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {getContactsByType(type as 'address' | 'phone' | 'email')?.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 border rounded-md">
                      No {type === 'address' ? 'addresses' : type === 'phone' ? 'phone numbers' : 'email addresses'} added yet.
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Links to your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Label>Social Media Profiles</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addSocialMedia}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Profile
                </Button>
              </div>
              
              {settings?.socialMedia?.map((social) => (
                <div key={social.id} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
                  <div className="col-span-12 md:col-span-3">
                    <Select
                      value={social.platform}
                      onValueChange={(value) => updateSocialMedia(social.id, 'platform', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialMediaPlatforms?.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-12 md:col-span-8">
                    <Input
                      value={social.url}
                      onChange={(e) => updateSocialMedia(social.id, 'url', e.target.value)}
                      placeholder="https://..."
                      type="url"
                    />
                  </div>
                  
                  <div className="col-span-12 md:col-span-1 flex justify-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeSocialMedia(social.id)}
                      className="shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {settings?.socialMedia?.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8 border rounded-md">
                  No social media profiles added yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Library</CardTitle>
              <CardDescription>
                Manage images and media files uploaded to your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                <Label htmlFor="image-upload" className="block mb-2 font-medium">
                  Upload New Image
                </Label>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer flex-1"
                  />
                  <Button 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: JPG, PNG, GIF, WEBP. Max size: 5MB
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : images?.length === 0 ? (
                <div className="text-center py-12 border rounded-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No images found.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your first image to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images?.map((image) => (
                    <div key={image.public_id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={image.secure_url}
                          alt={image.public_id}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => window.open(image.secure_url, '_blank')}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setImageToDelete(image.public_id);
                              setDeleteDialogOpen(true);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium truncate">
                            {image.public_id.split('/').pop()}
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted rounded-md">
                            {image.format.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1 mb-3">
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span>{formatFileSize(image.bytes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dimensions:</span>
                            <span>{image.width} × {image.height} px</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Uploaded:</span>
                            <span>{new Date(image.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={image.secure_url}
                            readOnly
                            className="text-xs h-8"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(image.secure_url)}
                            className="h-8 w-8 shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone and will permanently remove the image from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteImage(imageToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}