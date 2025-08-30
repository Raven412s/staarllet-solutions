'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ContactInfo {
  id: string;
  value: string;
  type: 'address' | 'phone' | 'email';
}

interface SiteSettings {
  siteName: string;
  contacts: ContactInfo[];
  logo: string;
  favicon: string;
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

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    contacts: [],
    logo: '',
    favicon: ''
  });
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string>('');

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
        console.log('Settings saved successfully');
      } else {
        console.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
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
      }
    } catch (error) {
      console.error('Error deleting image:', error);
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
      contacts: prev.contacts.map(contact =>
        contact.id === id ? { ...contact, value } : contact
      )
    }));
  };

  const removeContact = (id: string) => {
    setSettings(prev => ({
      ...prev,
      contacts: prev.contacts.filter(contact => contact.id !== id)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getContactsByType = (type: 'address' | 'phone' | 'email') => {
    return settings.contacts.filter(contact => contact.type === type);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage site settings and uploaded images
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="images">Image Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Update your site details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                />
              </div>
              
              {/* Addresses Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Addresses</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addContact('address')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
                
                {getContactsByType('address').map((contact) => (
                  <div key={contact.id} className="flex gap-2 items-start">
                    <Input
                      value={contact.value}
                      onChange={(e) => updateContact(contact.id, e.target.value)}
                      placeholder="Enter address"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {getContactsByType('address').length === 0 && (
                  <p className="text-sm text-muted-foreground">No addresses added yet.</p>
                )}
              </div>
              
              {/* Phone Numbers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Phone Numbers</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addContact('phone')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Phone
                  </Button>
                </div>
                
                {getContactsByType('phone').map((contact) => (
                  <div key={contact.id} className="flex gap-2 items-start">
                    <Input
                      value={contact.value}
                      onChange={(e) => updateContact(contact.id, e.target.value)}
                      placeholder="Enter phone number"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {getContactsByType('phone').length === 0 && (
                  <p className="text-sm text-muted-foreground">No phone numbers added yet.</p>
                )}
              </div>
              
              {/* Email Addresses Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Addresses</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addContact('email')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </div>
                
                {getContactsByType('email').map((contact) => (
                  <div key={contact.id} className="flex gap-2 items-start">
                    <Input
                      type="email"
                      value={contact.value}
                      onChange={(e) => updateContact(contact.id, e.target.value)}
                      placeholder="Enter email address"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeContact(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {getContactsByType('email').length === 0 && (
                  <p className="text-sm text-muted-foreground">No email addresses added yet.</p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  name="logo"
                  value={settings.logo}
                  onChange={handleInputChange}
                />
                {settings.logo && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Logo Preview:</p>
                    <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                      <Image
                        src={settings.logo}
                        alt="Site logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  name="favicon"
                  value={settings.favicon}
                  onChange={handleInputChange}
                />
                {settings.favicon && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Favicon Preview:</p>
                    <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                      <Image
                        src={settings.favicon}
                        alt="Site favicon"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <Button onClick={saveSettings} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>
                View and manage all images uploaded to Cloudinary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="image-upload" className="block mb-2">
                  Upload New Image
                </Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No images found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <div key={image.public_id} className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-square">
                        <Image
                          src={image.secure_url}
                          alt={image.public_id}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium truncate">
                            {image.public_id.split('/').pop()}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setImageToDelete(image.public_id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>{image.format.toUpperCase()} • {formatFileSize(image.bytes)}</div>
                          <div>{image.width} × {image.height} px</div>
                          <div>
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Input
                            value={image.secure_url}
                            readOnly
                            className="text-xs h-8"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(image.secure_url)}
                            className="h-8 w-8"
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image from Cloudinary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteImage(imageToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}