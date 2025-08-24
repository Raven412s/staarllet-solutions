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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  CheckCircle,
  Edit,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  Trash2,
  User
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface IBlog {
  _id: string;
  slug: string;
  title: string;
  description: string;
  coverImg: string;
  blogId: string;
  content: string | object;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  approved: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ViewBlogs() {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<IBlog[]>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionBlog, setActionBlog] = useState<IBlog | null>(null);

  

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        console.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBlogs = () => {
    let result = blogs;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(term) || 
        blog.description.toLowerCase().includes(term) ||
        blog.slug.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        result = result.filter(blog => blog.approved && blog.published);
      } else if (statusFilter === 'pending') {
        result = result.filter(blog => !blog.approved);
      } else if (statusFilter === 'draft') {
        result = result.filter(blog => blog.approved && !blog.published);
      }
    }

    setFilteredBlogs(result);
  };

  const toggleBlogSelection = (blogId: string) => {
    setSelectedBlogs(prev => 
      prev.includes(blogId) 
        ? prev.filter(id => id !== blogId) 
        : [...prev, blogId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedBlogs.length === filteredBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(filteredBlogs.map(blog => blog._id));
    }
  };

  const handleBlogAction = async (action: 'approve' | 'publish' | 'delete', blog: IBlog, value?: boolean) => {
    try {
      let endpoint = '';
      let method = 'PATCH';
      let body = {};

      switch (action) {
        case 'approve':
          endpoint = `/api/admin/blogs/${blog._id}/approve`;
          body = { approved: value };
          break;
        case 'publish':
          endpoint = `/api/admin/blogs/${blog._id}/publish`;
          body = { published: value };
          break;
        case 'delete':
          endpoint = `/api/admin/blogs/${blog._id}`;
          method = 'DELETE';
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        ...(method !== 'DELETE' && { body: JSON.stringify(body) }),
      });
      
      if (response.ok) {
        // Refresh the blog list
        fetchBlogs();
        // Clear selections if deleting
        if (action === 'delete') {
          setSelectedBlogs(prev => prev.filter(id => id !== blog._id));
        }
      } else {
        console.error(`Failed to ${action} blog`);
      }
    } catch (error) {
      console.error(`Error ${action} blog:`, error);
    } finally {
      setActionBlog(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleBulkAction = async (action: 'approve' | 'publish') => {
    if (selectedBlogs.length === 0) return;
    
    try {
      const response = await fetch('/api/admin/blogs/bulk-action', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogIds: selectedBlogs,
          action: action,
          value: action === 'approve' ? true : true // Set to true for approve/publish
        }),
      });
      
      if (response.ok) {
        // Refresh the blog list
        fetchBlogs();
        setSelectedBlogs([]);
      } else {
        console.error(`Failed to ${action} blogs in bulk`);
      }
    } catch (error) {
      console.error(`Error ${action} blogs in bulk:`, error);
    }
  };

  const getStatusBadgeVariant = (blog: IBlog) => {
    if (!blog.approved) return 'secondary';
    if (blog.approved && !blog.published) return 'outline';
    if (blog.approved && blog.published) return 'default';
    return 'secondary';
  };

  const getStatusText = (blog: IBlog) => {
    if (!blog.approved) return 'Pending Approval';
    if (blog.approved && !blog.published) return 'Approved (Draft)';
    if (blog.approved && blog.published) return 'Published';
    return 'Unknown';
  };

  const viewBlog = (blog: IBlog) => {
    window.open(`/blog/${blog.slug}`, '_blank');
  };



  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-muted-foreground">
            Manage all blog posts in the system
          </p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Create New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>
                View and manage all blog posts
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search blogs..."
                  className="w-full sm:w-64 pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedBlogs.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedBlogs.length} blog(s) selected
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('approve')}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve Selected
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleBulkAction('publish')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Publish Selected
              </Button>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="flex items-center">
                    <Checkbox
                      checked={selectedBlogs.length === filteredBlogs.length && filteredBlogs.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </div>
                </TableHead>
                <TableHead>Blog Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBlogs.includes(blog._id)}
                        onCheckedChange={() => toggleBlogSelection(blog._id)}
                        aria-label={`Select ${blog.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {blog.coverImg ? (
                          <div className="relative h-10 w-10 rounded-md overflow-hidden ">
                         <Image 
                            fill
                            src={blog.coverImg}
                            alt={blog.title}
                            className="object-cover"
                          />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium line-clamp-1">{blog.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {blog.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{blog.createdBy.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(blog)}>
                        {getStatusText(blog)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor={`approve-${blog._id}`} className="text-xs">
                            Approve
                          </Label>
                          <Switch
                            id={`approve-${blog._id}`}
                            checked={blog.approved}
                            onCheckedChange={(checked) => handleBlogAction('approve', blog, checked)}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Label htmlFor={`publish-${blog._id}`} className="text-xs">
                            Publish
                          </Label>
                          <Switch
                            id={`publish-${blog._id}`}
                            checked={blog.published}
                            onCheckedChange={(checked) => handleBlogAction('publish', blog, checked)}
                            disabled={!blog.approved}
                          />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => viewBlog(blog)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Blog
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Blog
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setActionBlog(blog);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Blog
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog
              post &quot;{actionBlog?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actionBlog && handleBlogAction('delete', actionBlog)}
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