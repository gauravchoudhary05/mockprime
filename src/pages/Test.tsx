import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertCircle,
  Send,
  ArrowLeft,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Question {
  id: number;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  marks: number;
  negative_marks: number;
  question_image?: string;
  option_1_image?: string;
  option_2_image?: string;
  option_3_image?: string;
  option_4_image?: string;
}

type ImageType = "both" | "question" | "options";

const sscGDImageConfig: Record<string, Record<number, ImageType>> = {
  "SSC GD English Mock 1": { 2: "both", 5: "both", 11: "both", 20: "both", 15: "options" },
  "SSC GD English Mock 2": { 3: "both", 14: "both", 17: "both", 5: "question", 11: "options" },
  "SSC GD English Mock 3": { 3: "both", 6: "both", 19: "both", 2: "options", 4: "question" },
  "SSC GD English Mock 4": { 1: "both", 14: "both", 20: "both", 3: "options", 17: "question" },
  "SSC GD English Mock 5": { 4: "both", 6: "both", 11: "both", 18: "options", 20: "question" },
  "SSC GD English Mock 6": {
    6: "both",
    11: "both",
    14: "both",
    15: "both",
    16: "both",
    12: "question",
    17: "options",
  },
  "SSC GD English Mock 7": { 7: "both", 17: "both", 18: "both", 2: "question", 16: "options" },
  "SSC GD English Mock 8": { 1: "both", 16: "both", 17: "both", 9: "question" },
  "SSC GD English Mock 9": { 12: "both", 16: "both", 17: "both", 5: "question" },
  "SSC GD English Mock 10": {
    8: "both",
    14: "both",
    15: "both",
    16: "both",
    9: "question",
  },
  "SSC GD Hindi Mock 1": { 11: "both", 15: "both", 6: "question", 14: "question", 18: "options" },
  "SSC GD Hindi Mock 2": { 3: "both", 10: "both", 18: "both", 19: "both", 16: "options" },
  "SSC GD Hindi Mock 3": { 1: "both", 2: "both", 4: "both", 17: "both", 19: "options" },
  "SSC GD Hindi Mock 4": { 5: "both", 9: "both", 15: "both", 14: "options", 16: "question" },
  "SSC GD Hindi Mock 5": { 9: "both", 16: "both", 19: "both", 7: "question", 8: "options" },
  "SSC GD Hindi Mock 6": { 8: "both", 11: "both", 17: "both", 3: "options", 10: "question" },
  "SSC GD Hindi Mock 7": { 1: "both", 8: "both", 14: "both", 2: "options", 7: "question" },
  "SSC GD Hindi Mock 8": { 9: "both", 11: "both", 14: "both", 20: "both", 16: "options" },
  "SSC GD Hindi Mock 9": { 5: "both", 12: "both", 19: "both", 10: "question", 18: "options" },
  "SSC GD Hindi Mock 10": { 2: "both", 17: "both", 19: "both", 14: "options", 15: "question" },
};

const getSSCGDImageConfig = (
  testName: string,
): { bucket: string; mockFolder: string } | null => {
  const hindiMatch = testName.match(/^SSC GD Hindi Mock (\d+)$/);
  if (hindiMatch) {
    return { bucket: "SSC GD Hindi", mockFolder: `Mock ${hindiMatch[1]}` };
  }

  const englishMatch = testName.match(/^SSC GD English Mock (\d+)$/);
  if (englishMatch) {
    return { bucket: "SSC GD English", mockFolder: `Mock ${englishMatch[1]}` };
  }

  return null;
};

// Fixed URL generator matching the exact storage structure
const getStorageUrl = (bucket: string, mockFolder: string, questionNum: number, imageType: string, optionNum?: number): string => {
  let path = "";
  
  if (imageType === "question") {
    path = `${mockFolder}/Question ${questionNum}/Question Image/question.jpeg`;
  } else if (imageType === "option") {
    const optionFolder = `Option ${optionNum} Image`;
    path = `${mockFolder}/Question ${questionNum}/${optionFolder}/${optionNum}.jpeg`;
  }
  
  const safePath = encodeURIComponent(path).replace(/%2F/g, "/");
  return `https://qlqmqhitorpwhbevjfra.supabase.co/storage/v1/object/public/${bucket}/${safePath}`;
};

const getTestDuration = (testName: string): number => {
  if (testName.includes("SSC GD")) return 60 * 60;
  return 90 * 60;
};

type AnswerStatus = "unanswered" | "answered" | "marked";

interface UserAnswer {
  questionId: number;
  selectedOption: number | null;
  status: AnswerStatus;
}

export default function Test() {
  const { testName } = useParams<{ testName: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, UserAnswer>>(new Map());
  const [timeLeft, setTimeLeft] = useState(() => getTestDuration(testName || ""));
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    if (!testName) return;

    try {
      setLoading(true);

      const bucketConfig = getSSCGDImageConfig(testName);
      const questionImageConfig = sscGDImageConfig[testName] || {};

      const { data, error } = await supabase.rpc("get_test_questions_without_answers", {
        test_name_param: testName,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const normalizedQuestions: Question[] = data.map((item: any) => {
          const questionId = item.id;

          const question: Question = {
            id: questionId,
            question_text: item.question_text || `Question ${questionId}`,
            option_1: item.option_1 || "",
            option_2: item.option_2 || "",
            option_3: item.option_3 || "",
            option_4: item.option_4 || "",
            marks: item.marks || 1,
            negative_marks: item.negative_marks || 0.25,
          };

          // Add images based on exact storage structure
          const imageType = questionImageConfig[questionId];
          if (bucketConfig && imageType) {
            if (imageType === "both" || imageType === "question") {
              question.question_image = getStorageUrl(
                bucketConfig.bucket,
                bucketConfig.mockFolder,
                questionId,
                "question"
              );
            }

            if (imageType === "both" || imageType === "options") {
              question.option_1_image = getStorageUrl(
                bucketConfig.bucket,
                bucketConfig.mockFolder,
                questionId,
                "option",
                1
              );
              question.option_2_image = getStorageUrl(
                bucketConfig.bucket,
                bucketConfig.mockFolder,
                questionId,
                "option",
                2
              );
              question.option_3_image = getStorageUrl(
                bucketConfig.bucket,
                bucketConfig.mockFolder,
                questionId,
                "option",
                3
              );
              question.option_4_image = getStorageUrl(
                bucketConfig.bucket,
                bucketConfig.mockFolder,
                questionId,
                "option",
                4
              );
            }
          }

          return question;
        });

        setQuestions(normalizedQuestions);

        const initialAnswers = new Map<number, UserAnswer>();
        normalizedQuestions.forEach((q) => {
          initialAnswers.set(q.id, {
            questionId: q.id,
            selectedOption: null,
            status: "unanswered",
          });
        });
        setAnswers(initialAnswers);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [testName, toast]);

  useEffect(() => {
    if (user && testName) {
      fetchQuestions();
    }
  }, [user, testName, fetchQuestions]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQuestion = questions[currentIndex];
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
      status: "answered",
    });
    setAnswers(newAnswers);
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers.get(currentQuestion.id);
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, {
      ...currentAnswer!,
      status:
        currentAnswer?.status === "marked"
          ? currentAnswer.selectedOption
            ? "answered"
            : "unanswered"
          : "marked",
    });
    setAnswers(newAnswers);
  };

  const handleClearResponse = () => {
    const currentQuestion = questions[currentIndex];
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, {
      questionId: currentQuestion.id,
      selectedOption: null,
      status: "unanswered",
    });
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const testDuration = getTestDuration(testName || "");
      const timeTaken = testDuration - timeLeft;

      const answersObj: Record<string, number | null> = {};
      answers.forEach((answer, questionId) => {
        answersObj[questionId.toString()] = answer.selectedOption;
      });

      const { data, error } = await supabase.rpc("submit_test_answers", {
        p_user_id: user!.id,
        p_test_name: testName!,
        p_answers: answersObj,
        p_time_taken: timeTaken,
      });

      if (error) throw error;

      const result = data as {
        score: number;
        max_score: number;
        percentage: number;
        correct: number;
        wrong: number;
        unattempted: number;
      };

      navigate("/result", {
        state: {
          score: result.score,
          maxScore: result.max_score,
          percentage: result.percentage,
          correct: result.correct,
          wrong: result.wrong,
          unattempted: result.unattempted,
          timeTaken,
          testName,
        },
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      toast({
        title: "Error",
        description: "Failed to submit test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth?mode=login" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Questions Found</h2>
            <p className="text-muted-foreground mb-4">
              This test does not have any questions yet.
            </p>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers.get(currentQuestion.id);
  const answeredCount = Array.from(answers.values()).filter(
    (a) => a.status === "answered",
  ).length;
  const markedCount = Array.from(answers.values()).filter(
    (a) => a.status === "marked",
  ).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="container mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowExitDialog(true)}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display font-bold text-lg">Mock Test</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 300
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
            <Button onClick={() => setShowSubmitDialog(true)} className="gradient-primary">
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>
      </header>

      {/* Layout wrapper */}
      <div className="flex-1 container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Mobile question navigator */}
        <div className="lg:hidden">
          <Card className="shadow-card border-0 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Questions</h3>
                <span className="text-sm text-muted-foreground">
                  {answeredCount}/{questions.length}
                </span>
              </div>
              <Progress
                value={(answeredCount / questions.length) * 100}
                className="mb-4"
              />
              <div className="flex gap-2 overflow-x-auto pb-1">
                {questions.map((q, index) => {
                  const answer = answers.get(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`min-w-10 h-10 px-2 rounded-lg text-sm font-medium transition-all ${
                        index === currentIndex
                          ? "bg-primary text-primary-foreground border-2 border-primary"
                          : answer?.status === "answered"
                          ? "bg-success text-success-foreground"
                          : answer?.status === "marked"
                          ? "bg-warning text-warning-foreground"
                          : "bg-muted text-foreground border border-border hover:bg-muted/80"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-full">
          <Card className="shadow-card border-0">
            <CardContent className="p-4 sm:p-6">
              {/* Question */}
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">Q{currentIndex + 1}</Badge>
                  <Badge
                    variant="outline"
                    className="text-success border-success/20"
                  >
                    +{currentQuestion.marks} marks
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-destructive border-destructive/20"
                  >
                    -{currentQuestion.negative_marks} negative
                  </Badge>
                </div>
                <p className="text-base sm:text-lg leading-relaxed break-words">
                  {currentQuestion.question_text}
                </p>
                {currentQuestion.question_image && (
                  <img
                    src={currentQuestion.question_image}
                    alt="Question illustration"
                    className="mt-4 max-w-full sm:max-w-xs h-auto rounded-lg border border-border"
                    onError={(e) => {
                      console.error("Question image failed to load:", currentQuestion.question_image);
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {[
                  {
                    index: 1,
                    text: currentQuestion.option_1,
                    image: currentQuestion.option_1_image,
                  },
                  {
                    index: 2,
                    text: currentQuestion.option_2,
                    image: currentQuestion.option_2_image,
                  },
                  {
                    index: 3,
                    text: currentQuestion.option_3,
                    image: currentQuestion.option_3_image,
                  },
                  {
                    index: 4,
                    text: currentQuestion.option_4,
                    image: currentQuestion.option_4_image,
                  },
                ].map((option) => (
                  <button
                    key={option.index}
                    onClick={() => handleSelectOption(option.index)}
                    className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all break-words ${
                      currentAnswer?.selectedOption === option.index
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                          currentAnswer?.selectedOption === option.index
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {String.fromCharCode(64 + option.index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {option.text && <span className="block mb-2">{option.text}</span>}
                        {option.image && (
                          <img
                            src={option.image}
                            alt={`Option ${String.fromCharCode(64 + option.index)}`}
                            className="max-w-full sm:max-w-[150px] h-auto rounded-lg border border-border"
                            onError={(e) => {
                              console.error(`Option ${option.index} image failed to load:`, option.image);
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleClearResponse}
                    disabled={!currentAnswer?.selectedOption}
                  >
                    Clear
                  </Button>
                  <Button
                    variant={currentAnswer?.status === "marked" ? "default" : "outline"}
                    onClick={handleMarkForReview}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    {currentAnswer?.status === "marked"
                      ? "Marked"
                      : "Mark for Review"}
                  </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        Math.min(questions.length - 1, prev + 1),
                      )
                    }
                    disabled={currentIndex === questions.length - 1}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Sidebar navigator */}
        <div className="w-80 hidden lg:block">
          <Card className="shadow-card border-0 sticky top-24">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Questions</h3>
                <span className="text-sm text-muted-foreground">
                  {answeredCount}/{questions.length}
                </span>
              </div>
              <Progress
                value={(answeredCount / questions.length) * 100}
                className="mb-4"
              />

              <div className="grid grid-cols-5 gap-2 mb-4">
                {questions.map((q, index) => {
                  const answer = answers.get(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        index === currentIndex
                          ? "bg-primary text-primary-foreground border-2 border-primary"
                          : answer?.status === "answered"
                          ? "bg-success text-success-foreground"
                          : answer?.status === "marked"
                          ? "bg-warning text-warning-foreground"
                          : "bg-muted text-foreground border border-border hover:bg-muted/80"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-success" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-warning" />
                  <span>Marked ({markedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted" />
                  <span>Unanswered ({questions.length - answeredCount})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {questions.length} questions.
              {questions.length - answeredCount > 0 && (
                <span className="block mt-2 text-warning">
                  {questions.length - answeredCount} questions are still unanswered.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              className="gradient-primary"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Warning Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will not be saved. All your answers will be lost and this
              attempt will not be recorded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay & Continue</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate("/mock-tests")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
