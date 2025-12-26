import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../integrations/supabase/client';
import { Navbar } from '../components/layout/Navbar';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  ArrowLeft,
  Loader2,
  AlertCircle,
  BookOpen
} from 'lucide-react';

interface Question {
  id: number;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  correct_option: string | number;
  marks: number;
  negative_marks: number;
  question_image?: string;
  option_1_image?: string;
  option_2_image?: string;
  option_3_image?: string;
  option_4_image?: string;
}

// SSC GD Image question mappings - detailed per-question image config
// 'both': question + option images, 'question': question only, 'options': options only
type ImageType = 'both' | 'question' | 'options';
const sscGDImageConfig: Record<string, Record<number, ImageType>> = {
  // English Mocks
  'SSC GD English Mock 1': { 2: 'both', 5: 'both', 11: 'both', 20: 'both', 15: 'options' },
  'SSC GD English Mock 2': { 3: 'both', 14: 'both', 17: 'both', 5: 'question', 11: 'options' },
  'SSC GD English Mock 3': { 3: 'both', 6: 'both', 19: 'both', 2: 'options', 4: 'question' },
  'SSC GD English Mock 4': { 1: 'both', 14: 'both', 20: 'both', 3: 'options', 17: 'question' },
  'SSC GD English Mock 5': { 4: 'both', 6: 'both', 11: 'both', 18: 'options', 20: 'question' },
  'SSC GD English Mock 6': { 6: 'both', 11: 'both', 14: 'both', 15: 'both', 16: 'both', 12: 'question', 17: 'options' },
  'SSC GD English Mock 7': { 7: 'both', 17: 'both', 18: 'both', 2: 'question', 16: 'options' },
  'SSC GD English Mock 8': { 1: 'both', 16: 'both', 17: 'both', 9: 'question' },
  'SSC GD English Mock 9': { 12: 'both', 16: 'both', 17: 'both', 5: 'question' },
  'SSC GD English Mock 10': { 8: 'both', 14: 'both', 15: 'both', 16: 'both', 9: 'question' },
  // Hindi Mocks
  'SSC GD Hindi Mock 1': { 11: 'both', 15: 'both', 6: 'question', 14: 'question', 18: 'options' },
  'SSC GD Hindi Mock 2': { 3: 'both', 10: 'both', 18: 'both', 19: 'both', 16: 'options' },
  'SSC GD Hindi Mock 3': { 1: 'both', 2: 'both', 4: 'both', 17: 'both', 19: 'options' },
  'SSC GD Hindi Mock 4': { 5: 'both', 9: 'both', 15: 'both', 14: 'options', 16: 'question' },
  'SSC GD Hindi Mock 5': { 9: 'both', 16: 'both', 19: 'both', 7: 'question', 8: 'options' },
  'SSC GD Hindi Mock 6': { 8: 'both', 11: 'both', 17: 'both', 3: 'options', 10: 'question' },
  'SSC GD Hindi Mock 7': { 1: 'both', 8: 'both', 14: 'both', 2: 'options', 7: 'question' },
  'SSC GD Hindi Mock 8': { 9: 'both', 11: 'both', 14: 'both', 20: 'both', 16: 'options' },
  'SSC GD Hindi Mock 9': { 5: 'both', 12: 'both', 19: 'both', 10: 'question', 18: 'options' },
  'SSC GD Hindi Mock 10': { 2: 'both', 17: 'both', 19: 'both', 14: 'options', 15: 'question' },
};

// Helper function to get SSC GD bucket and folder info
const getSSCGDImageConfig = (testName: string): { bucket: string; mockFolder: string } | null => {
  // Match SSC GD Hindi Mock X
  const hindiMatch = testName.match(/^SSC GD Hindi Mock (\d+)$/);
  if (hindiMatch) {
    return { bucket: 'SSC GD Hindi', mockFolder: `Mock ${hindiMatch[1]}` };
  }
  
  // Match SSC GD English Mock X
  const englishMatch = testName.match(/^SSC GD English Mock (\d+)$/);
  if (englishMatch) {
    return { bucket: 'SSC GD English', mockFolder: `Mock ${englishMatch[1]}` };
  }
  
  return null;
};

// Helper function to construct storage URL
const getStorageUrl = (bucket: string, path: string): string => {
  return `https://qlqmqhitorpwhbevjfra.supabase.co/storage/v1/object/public/${bucket}/${encodeURIComponent(path).replace(/%2F/g, '/')}.jpeg`;
};

export default function Solutions() {
  const { testName } = useParams<{ testName: string }>();
  const { user, loading: authLoading } = useAuth();
  const { isPremium, loading: profileLoading } = useProfile();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Free test check - Delhi Police Mock 1 is free
  const isFreeTest = testName === 'Delhi Police Mock 1';

  const fetchQuestions = useCallback(async () => {
    if (!testName || !user) return;

    try {
      setLoading(true);
      
      // Check if this is an SSC GD test that needs images
      const bucketConfig = getSSCGDImageConfig(testName);
      const questionImageConfig = sscGDImageConfig[testName] || {};
      
      // Use secure server-side function that only returns answers if user completed the test
      const { data, error } = await supabase.rpc('get_test_solutions', {
        p_user_id: user.id,
        p_test_name: testName,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const normalizedQuestions: Question[] = data.map((item: any) => {
          const questionId = item.id;
          
          // Parse correct option - handle (a), (b), (c), (d) format
          let correctOption = item.correct_option || 1;
          if (typeof correctOption === 'string') {
            const cleaned = correctOption.replace(/[()]/g, '').trim().toUpperCase();
            const letterMap: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
            if (letterMap[cleaned]) {
              correctOption = letterMap[cleaned];
            }
          }
          
          const question: Question = {
            id: questionId,
            question_text: item.question_text || `Question ${questionId}`,
            option_1: item.option_1 || '',
            option_2: item.option_2 || '',
            option_3: item.option_3 || '',
            option_4: item.option_4 || '',
            correct_option: correctOption,
            marks: item.marks || 1,
            negative_marks: item.negative_marks || 0.25,
          };
          
          // If SSC GD test with image config and this question has images
          const imageType = questionImageConfig[questionId];
          if (bucketConfig && imageType) {
            const questionFolder = `${bucketConfig.mockFolder}/Question ${questionId}`;
            
            // Add question image if type is 'both' or 'question'
            if (imageType === 'both' || imageType === 'question') {
              question.question_image = getStorageUrl(bucketConfig.bucket, `${questionFolder}/Question Image`);
            }
            
            // Add option images if type is 'both' or 'options'
            if (imageType === 'both' || imageType === 'options') {
              question.option_1_image = getStorageUrl(bucketConfig.bucket, `${questionFolder}/Option 1 Image`);
              question.option_2_image = getStorageUrl(bucketConfig.bucket, `${questionFolder}/Option 2 Image`);
              question.option_3_image = getStorageUrl(bucketConfig.bucket, `${questionFolder}/Option 3 Image`);
              question.option_4_image = getStorageUrl(bucketConfig.bucket, `${questionFolder}/Option 4 Image`);
            }
          }
          
          return question;
        });

        setQuestions(normalizedQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [testName, user]);

  useEffect(() => {
    if (user && testName && (isFreeTest || isPremium)) {
      fetchQuestions();
    }
  }, [user, testName, isPremium, fetchQuestions, isFreeTest]);

  const getCorrectOptionIndex = (correctOption: string | number): number => {
    if (typeof correctOption === 'string') {
      // Handle (a), (b), (c), (d) format
      const cleaned = correctOption.replace(/[()]/g, '').trim().toUpperCase();
      const letterMap: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
      return letterMap[cleaned] || parseInt(correctOption) || 1;
    }
    return correctOption;
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // Redirect non-premium users trying to access paid test solutions
  if (!isFreeTest && !isPremium) {
    return <Navigate to="/upgrade" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading solutions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No Solutions Found</h2>
              <p className="text-muted-foreground mb-4">Solutions are not available for this test.</p>
              <Link to="/mock-tests">
                <Button>Go Back</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const correctIndex = getCorrectOptionIndex(currentQuestion.correct_option);

  const options = [
    { index: 1, text: currentQuestion.option_1, image: currentQuestion.option_1_image },
    { index: 2, text: currentQuestion.option_2, image: currentQuestion.option_2_image },
    { index: 3, text: currentQuestion.option_3, image: currentQuestion.option_3_image },
    { index: 4, text: currentQuestion.option_4, image: currentQuestion.option_4_image },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/mock-tests">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display font-bold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Solutions: {testName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Card className="shadow-card border-0">
            <CardContent className="p-4 md:p-6">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">Q{currentIndex + 1}</Badge>
                  <Badge variant="outline" className="text-success border-success/20">
                    +{currentQuestion.marks} marks
                  </Badge>
                </div>
                <p className="text-base md:text-lg leading-relaxed">{currentQuestion.question_text}</p>
                {currentQuestion.question_image && (
                  <img 
                    src={currentQuestion.question_image} 
                    alt="Question illustration" 
                    className="mt-4 max-w-xs h-auto rounded-lg border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* Options with correct answer highlighted */}
              <div className="space-y-3">
                {options.map(option => {
                  const isCorrect = option.index === correctIndex;
                  return (
                    <div
                      key={option.index}
                      className={`w-full p-3 md:p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? 'border-success bg-success/10'
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                          isCorrect
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted'
                        }`}>
                          {String.fromCharCode(64 + option.index)}
                        </div>
                        <div className="flex-1">
                          {option.text && <span className="text-sm md:text-base">{option.text}</span>}
                          {option.image && (
                            <img 
                              src={option.image} 
                              alt={`Option ${String.fromCharCode(64 + option.index)}`}
                              className="mt-2 max-w-[150px] h-auto rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        {isCorrect && (
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Correct Answer Badge */}
              <div className="mt-6 p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm font-medium text-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Correct Answer: Option {String.fromCharCode(64 + correctIndex)}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} / {questions.length}
                </span>
                <Button
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Question Navigator */}
        <div className="w-72 hidden lg:block">
          <Card className="shadow-card border-0 sticky top-24">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      index === currentIndex
                        ? 'ring-2 ring-primary ring-offset-2 bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
