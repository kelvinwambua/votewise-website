"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  CreditCard,
  ListChecks,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ModulePage({
  params,
}: {
  params: { moduleId: Id<"modules"> };
}) {
  const router = useRouter();
  const module = useQuery(api.admin.getModule, { moduleId: params.moduleId });
  const flashcards = useQuery(api.admin.getFlashcardsByModule, {
    moduleId: params.moduleId,
  });
  const multipleChoice = useQuery(api.admin.getMultipleChoiceByModule, {
    moduleId: params.moduleId,
  });

  const createFlashcard = useMutation(api.admin.createFlashcard);
  const updateFlashcard = useMutation(api.admin.updateFlashcard);
  const deleteFlashcard = useMutation(api.admin.deleteFlashcard);
  const createMultipleChoice = useMutation(api.admin.createMultipleChoice);
  const updateMultipleChoice = useMutation(api.admin.updateMultipleChoice);
  const deleteMultipleChoice = useMutation(api.admin.deleteMultipleChoice);

  const [isFlashcardDialogOpen, setIsFlashcardDialogOpen] = useState(false);
  const [isMultipleChoiceDialogOpen, setIsMultipleChoiceDialogOpen] =
    useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<any>(null);
  const [editingMultipleChoice, setEditingMultipleChoice] = useState<any>(null);

  const [flashcardForm, setFlashcardForm] = useState({
    question: "",
    answer: "",
    order: 0,
  });

  const [multipleChoiceForm, setMultipleChoiceForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
    order: 0,
  });

  const handleFlashcardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFlashcard) {
        await updateFlashcard({
          flashcardId: editingFlashcard._id,
          ...flashcardForm,
        });
      } else {
        await createFlashcard({
          moduleId: params.moduleId,
          ...flashcardForm,
        });
      }
      setIsFlashcardDialogOpen(false);
      resetFlashcardForm();
    } catch (error) {
      console.error("Error saving flashcard:", error);
    }
  };

  const handleMultipleChoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMultipleChoice) {
        await updateMultipleChoice({
          questionId: editingMultipleChoice._id,
          ...multipleChoiceForm,
        });
      } else {
        await createMultipleChoice({
          moduleId: params.moduleId,
          ...multipleChoiceForm,
        });
      }
      setIsMultipleChoiceDialogOpen(false);
      resetMultipleChoiceForm();
    } catch (error) {
      console.error("Error saving multiple choice:", error);
    }
  };

  const handleDeleteFlashcard = async (id: Id<"flashcards">) => {
    if (confirm("Are you sure you want to delete this flashcard?")) {
      await deleteFlashcard({ flashcardId: id });
    }
  };

  const handleDeleteMultipleChoice = async (
    id: Id<"multipleChoiceQuestions">,
  ) => {
    if (confirm("Are you sure you want to delete this question?")) {
      await deleteMultipleChoice({ questionId: id });
    }
  };

  const resetFlashcardForm = () => {
    setFlashcardForm({
      question: "",
      answer: "",
      order: 0,
    });
    setEditingFlashcard(null);
  };

  const resetMultipleChoiceForm = () => {
    setMultipleChoiceForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      order: 0,
    });
    setEditingMultipleChoice(null);
  };

  const openEditFlashcard = (flashcard: any) => {
    setEditingFlashcard(flashcard);
    setFlashcardForm({
      question: flashcard.question,
      answer: flashcard.answer,
      order: flashcard.order,
    });
    setIsFlashcardDialogOpen(true);
  };

  const openEditMultipleChoice = (question: any) => {
    setEditingMultipleChoice(question);
    setMultipleChoiceForm({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
      order: question.order,
    });
    setIsMultipleChoiceDialogOpen(true);
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...multipleChoiceForm.options];
    newOptions[index] = value;
    setMultipleChoiceForm({ ...multipleChoiceForm, options: newOptions });
  };

  if (!module) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Modules
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{module.title}</h1>
            <p className="text-muted-foreground">{module.description}</p>
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
      </div>

      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="multiplechoice">Multiple Choice</TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Flashcards</h2>
              <p className="text-sm text-muted-foreground">
                {flashcards?.length || 0} flashcards
              </p>
            </div>
            <Dialog
              open={isFlashcardDialogOpen}
              onOpenChange={(open) => {
                setIsFlashcardDialogOpen(open);
                if (!open) resetFlashcardForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Flashcard
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingFlashcard
                      ? "Edit Flashcard"
                      : "Create New Flashcard"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the question and answer for the flashcard
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFlashcardSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fc-question">Question</Label>
                    <Textarea
                      id="fc-question"
                      value={flashcardForm.question}
                      onChange={(e) =>
                        setFlashcardForm({
                          ...flashcardForm,
                          question: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fc-answer">Answer</Label>
                    <Textarea
                      id="fc-answer"
                      value={flashcardForm.answer}
                      onChange={(e) =>
                        setFlashcardForm({
                          ...flashcardForm,
                          answer: e.target.value,
                        })
                      }
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fc-order">Order</Label>
                    <Input
                      id="fc-order"
                      type="number"
                      value={flashcardForm.order}
                      onChange={(e) =>
                        setFlashcardForm({
                          ...flashcardForm,
                          order: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsFlashcardDialogOpen(false);
                        resetFlashcardForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingFlashcard ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flashcards?.map((flashcard) => (
              <Card key={flashcard._id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <Badge variant="outline">Order: {flashcard.order}</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {flashcard.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Answer:</p>
                      <p className="text-sm text-muted-foreground">
                        {flashcard.answer}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditFlashcard(flashcard)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFlashcard(flashcard._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="multiplechoice" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                Multiple Choice Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                {multipleChoice?.length || 0} questions
              </p>
            </div>
            <Dialog
              open={isMultipleChoiceDialogOpen}
              onOpenChange={(open) => {
                setIsMultipleChoiceDialogOpen(open);
                if (!open) resetMultipleChoiceForm();
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingMultipleChoice
                      ? "Edit Multiple Choice Question"
                      : "Create New Multiple Choice Question"}
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the question and answer options
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleMultipleChoiceSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="mc-question">Question</Label>
                    <Textarea
                      id="mc-question"
                      value={multipleChoiceForm.question}
                      onChange={(e) =>
                        setMultipleChoiceForm({
                          ...multipleChoiceForm,
                          question: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    {multipleChoiceForm.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="w-8 justify-center">
                          {String.fromCharCode(65 + index)}
                        </Badge>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mc-correct">Correct Answer</Label>
                    <div className="flex gap-2">
                      {multipleChoiceForm.options.map((_, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant={
                            multipleChoiceForm.correctAnswer === index
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setMultipleChoiceForm({
                              ...multipleChoiceForm,
                              correctAnswer: index,
                            })
                          }
                          className="flex-1"
                        >
                          {String.fromCharCode(65 + index)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mc-explanation">
                      Explanation (Optional)
                    </Label>
                    <Textarea
                      id="mc-explanation"
                      value={multipleChoiceForm.explanation}
                      onChange={(e) =>
                        setMultipleChoiceForm({
                          ...multipleChoiceForm,
                          explanation: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mc-order">Order</Label>
                    <Input
                      id="mc-order"
                      type="number"
                      value={multipleChoiceForm.order}
                      onChange={(e) =>
                        setMultipleChoiceForm({
                          ...multipleChoiceForm,
                          order: parseInt(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsMultipleChoiceDialogOpen(false);
                        resetMultipleChoiceForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingMultipleChoice ? "Update" : "Create"}
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
                  <TableHead>Order</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {multipleChoice?.map((question) => (
                  <TableRow key={question._id}>
                    <TableCell>
                      <Badge variant="outline">{question.order}</Badge>
                    </TableCell>
                    <TableCell className="font-medium max-w-md">
                      <div className="flex items-start gap-2">
                        <ListChecks className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {question.question}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge>
                        {String.fromCharCode(65 + question.correctAnswer)}:{" "}
                        {question.options[question.correctAnswer]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditMultipleChoice(question)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDeleteMultipleChoice(question._id)
                          }
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
