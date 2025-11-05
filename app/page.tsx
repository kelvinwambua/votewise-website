"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  FileText,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const router = useRouter();
  const modules = useQuery(api.admin.getModules);
  const resources = useQuery(api.admin.getResources);
  const createModule = useMutation(api.admin.createModule);
  const updateModule = useMutation(api.admin.updateModule);
  const deleteModule = useMutation(api.admin.deleteModule);
  const createResource = useMutation(api.admin.createResource);
  const updateResource = useMutation(api.admin.updateResource);
  const deleteResource = useMutation(api.admin.deleteResource);

  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [editingResource, setEditingResource] = useState<any>(null);

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    status: "published" as "published" | "coming_soon" | "locked",
    order: 0,
    duration: 0,
    category: "",
    badgeIcon: "",
    badgeText: "",
    isPublished: true,
  });

  const [resourceForm, setResourceForm] = useState({
    title: "",
    description: "",
    url: "",
    type: "",
    category: "",
    order: 0,
    isActive: true,
  });

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingModule) {
        await updateModule({
          moduleId: editingModule._id,
          ...moduleForm,
        });
      } else {
        await createModule(moduleForm);
      }
      setIsModuleDialogOpen(false);
      resetModuleForm();
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingResource) {
        await updateResource({
          resourceId: editingResource._id,
          ...resourceForm,
        });
      } else {
        await createResource(resourceForm);
      }
      setIsResourceDialogOpen(false);
      resetResourceForm();
    } catch (error) {
      console.error("Error saving resource:", error);
    }
  };

  const handleDeleteModule = async (id: Id<"modules">) => {
    if (confirm("Are you sure you want to delete this module?")) {
      await deleteModule({ moduleId: id });
    }
  };

  const handleDeleteResource = async (id: Id<"resources">) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      await deleteResource({ resourceId: id });
    }
  };

  const resetModuleForm = () => {
    setModuleForm({
      title: "",
      description: "",
      content: "",
      imageUrl: "",
      status: "published",
      order: 0,
      duration: 0,
      category: "",
      badgeIcon: "",
      badgeText: "",
      isPublished: true,
    });
    setEditingModule(null);
  };

  const resetResourceForm = () => {
    setResourceForm({
      title: "",
      description: "",
      url: "",
      type: "",
      category: "",
      order: 0,
      isActive: true,
    });
    setEditingResource(null);
  };

  const openEditModule = (module: any) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description,
      content: module.content,
      imageUrl: module.imageUrl || "",
      status: module.status,
      order: module.order,
      duration: module.duration || 0,
      category: module.category || "",
      badgeIcon: module.badgeIcon || "",
      badgeText: module.badgeText || "",
      isPublished: module.isPublished,
    });
    setIsModuleDialogOpen(true);
  };

  const openEditResource = (resource: any) => {
    setEditingResource(resource);
    setResourceForm({
      title: resource.title,
      description: resource.description || "",
      url: resource.url || "",
      type: resource.type,
      category: resource.category || "",
      order: resource.order,
      isActive: resource.isActive,
    });
    setIsResourceDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Learning Platform Admin</h1>
        <p className="text-muted-foreground">
          Manage your modules, resources, and content
        </p>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Modules</h2>
            <Dialog
              open={isModuleDialogOpen}
              onOpenChange={(open) => {
                setIsModuleDialogOpen(open);
                if (!open) resetModuleForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingModule ? "Edit Module" : "Create New Module"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for the module
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleModuleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={moduleForm.title}
                      onChange={(e) =>
                        setModuleForm({ ...moduleForm, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={moduleForm.description}
                      onChange={(e) =>
                        setModuleForm({
                          ...moduleForm,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={moduleForm.content}
                      onChange={(e) =>
                        setModuleForm({
                          ...moduleForm,
                          content: e.target.value,
                        })
                      }
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={moduleForm.imageUrl}
                        onChange={(e) =>
                          setModuleForm({
                            ...moduleForm,
                            imageUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={moduleForm.status}
                        onValueChange={(value: any) =>
                          setModuleForm({ ...moduleForm, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="coming_soon">
                            Coming Soon
                          </SelectItem>
                          <SelectItem value="locked">Locked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order">Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={moduleForm.order}
                        onChange={(e) =>
                          setModuleForm({
                            ...moduleForm,
                            order: parseInt(e.target.value),
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={moduleForm.duration}
                        onChange={(e) =>
                          setModuleForm({
                            ...moduleForm,
                            duration: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={moduleForm.category}
                        onChange={(e) =>
                          setModuleForm({
                            ...moduleForm,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badgeIcon">Badge Icon</Label>
                      <Input
                        id="badgeIcon"
                        value={moduleForm.badgeIcon}
                        onChange={(e) =>
                          setModuleForm({
                            ...moduleForm,
                            badgeIcon: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="badgeText">Badge Text</Label>
                    <Input
                      id="badgeText"
                      value={moduleForm.badgeText}
                      onChange={(e) =>
                        setModuleForm({
                          ...moduleForm,
                          badgeText: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublished"
                      checked={moduleForm.isPublished}
                      onCheckedChange={(checked) =>
                        setModuleForm({ ...moduleForm, isPublished: checked })
                      }
                    />
                    <Label htmlFor="isPublished">Published</Label>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsModuleDialogOpen(false);
                        resetModuleForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingModule ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules?.map((module) => (
              <Card key={module._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{module.title}</CardTitle>
                      {module.badgeText && (
                        <Badge variant="secondary" className="mb-2">
                          {module.badgeText}
                        </Badge>
                      )}
                    </div>
                    <Badge
                      variant={
                        module.status === "published"
                          ? "default"
                          : module.status === "coming_soon"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {module.status}
                    </Badge>
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {module.category && <p>Category: {module.category}</p>}
                    {module.duration && (
                      <p>Duration: {module.duration} minutes</p>
                    )}
                    <p>Order: {module.order}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/${module._id}`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Manage
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModule(module)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteModule(module._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Resources</h2>
            <Dialog
              open={isResourceDialogOpen}
              onOpenChange={(open) => {
                setIsResourceDialogOpen(open);
                if (!open) resetResourceForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingResource ? "Edit Resource" : "Create New Resource"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for the resource
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleResourceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="res-title">Title</Label>
                    <Input
                      id="res-title"
                      value={resourceForm.title}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="res-description">Description</Label>
                    <Textarea
                      id="res-description"
                      value={resourceForm.description}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="res-url">URL</Label>
                    <Input
                      id="res-url"
                      value={resourceForm.url}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          url: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="res-type">Type</Label>
                      <Input
                        id="res-type"
                        value={resourceForm.type}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            type: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="res-category">Category</Label>
                      <Input
                        id="res-category"
                        value={resourceForm.category}
                        onChange={(e) =>
                          setResourceForm({
                            ...resourceForm,
                            category: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="res-order">Order</Label>
                    <Input
                      id="res-order"
                      type="number"
                      value={resourceForm.order}
                      onChange={(e) =>
                        setResourceForm({
                          ...resourceForm,
                          order: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="res-isActive"
                      checked={resourceForm.isActive}
                      onCheckedChange={(checked) =>
                        setResourceForm({ ...resourceForm, isActive: checked })
                      }
                    />
                    <Label htmlFor="res-isActive">Active</Label>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsResourceDialogOpen(false);
                        resetResourceForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingResource ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources?.map((resource) => (
                  <TableRow key={resource._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {resource.title}
                      </div>
                    </TableCell>
                    <TableCell>{resource.type}</TableCell>
                    <TableCell>{resource.category || "-"}</TableCell>
                    <TableCell>{resource.order}</TableCell>
                    <TableCell>
                      <Badge
                        variant={resource.isActive ? "default" : "outline"}
                      >
                        {resource.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {resource.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(resource.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditResource(resource)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteResource(resource._id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
