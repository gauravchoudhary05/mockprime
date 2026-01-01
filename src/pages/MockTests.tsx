import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { Navbar } from '../components/layout/Navbar';
import { TestCard } from '../components/TestCard';
import { Badge } from '../components/ui/badge';
import { Crown, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function MockTests() {
  const { user, loading } = useAuth();
  const { isPremium, loading: profileLoading } = useProfile();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  // Free test always first ✅ FIXED table name
  const freeTest = {
    id: 'free',
    name: 'Delhi Police 2026 – Full Mock Test 1',
    table: 'Delhi Police Mock 1', // ✅ Exact Supabase table name
    questions: 100,
    duration: 90,
    difficulty: 'Medium',
    isFree: true,
  };

  // Pro mock tests ✅ ALL FIXED - Exact Supabase table names
 const mockTests = [
  { id: 2, name: 'Delhi Police Mock Test 2', table: 'Delhi Police Mock 2', questions: 100, duration: 90, difficulty: 'Medium' },
  { id: 3, name: 'Delhi Police Mock Test 3', table: 'Delhi Police Mock 3', questions: 100, duration: 90, difficulty: 'Hard' },
  { id: 4, name: 'Delhi Police Mock Test 4', table: 'Delhi Police Mock 4', questions: 100, duration: 90, difficulty: 'Hard' },
  { id: 5, name: 'Delhi Police Mock Test 5', table: 'Delhi Police Mock 5', questions: 100, duration: 90, difficulty: 'Expert' },
];

  // SSC GD Tests - 10 Hindi + 10 English ✅ Already correct
  const sscGDHindiTests = [
    { id: 'ssc-gd-hindi-1', name: 'SSC GD Hindi Mock 1', table: 'SSC GD Hindi Mock 1', questions: 80, duration: 60, difficulty: 'Medium', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-2', name: 'SSC GD Hindi Mock 2', table: 'SSC GD Hindi Mock 2', questions: 80, duration: 60, difficulty: 'Medium', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-3', name: 'SSC GD Hindi Mock 3', table: 'SSC GD Hindi Mock 3', questions: 80, duration: 60, difficulty: 'Medium', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-4', name: 'SSC GD Hindi Mock 4', table: 'SSC GD Hindi Mock 4', questions: 80, duration: 60, difficulty: 'Hard', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-5', name: 'SSC GD Hindi Mock 5', table: 'SSC GD Hindi Mock 5', questions: 80, duration: 60, difficulty: 'Hard', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-6', name: 'SSC GD Hindi Mock 6', table: 'SSC GD Hindi Mock 6', questions: 80, duration: 60, difficulty: 'Hard', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-7', name: 'SSC GD Hindi Mock 7', table: 'SSC GD Hindi Mock 7', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-8', name: 'SSC GD Hindi Mock 8', table: 'SSC GD Hindi Mock 8', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-9', name: 'SSC GD Hindi Mock 9', table: 'SSC GD Hindi Mock 9', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD Hindi' },
    { id: 'ssc-gd-hindi-10', name: 'SSC GD Hindi Mock 10', table: 'SSC GD Hindi Mock 10', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD Hindi' },
  ];

  const sscGDEnglishTests = [
    { id: 'ssc-gd-english-1', name: 'SSC GD English Mock 1', table: 'SSC GD English Mock 1', questions: 80, duration: 60, difficulty: 'Medium', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-2', name: 'SSC GD English Mock 2', table: 'SSC GD English Mock 2', questions: 80, duration: 60, difficulty: 'Medium', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-3', name: 'SSC GD English Mock 3', table: 'SSC GD English Mock 3', questions: 80, duration: 60, difficulty: 'Medium', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-4', name: 'SSC GD English Mock 4', table: 'SSC GD English Mock 4', questions: 80, duration: 60, difficulty: 'Hard', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-5', name: 'SSC GD English Mock 5', table: 'SSC GD English Mock 5', questions: 80, duration: 60, difficulty: 'Hard', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-6', name: 'SSC GD English Mock 6', table: 'SSC GD English Mock 6', questions: 80, duration: 60, difficulty: 'Hard', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-7', name: 'SSC GD English Mock 7', table: 'SSC GD English Mock 7', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-8', name: 'SSC GD English Mock 8', table: 'SSC GD English Mock 8', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-9', name: 'SSC GD English Mock 9', table: 'SSC GD English Mock 9', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD English' },
    { id: 'ssc-gd-english-10', name: 'SSC GD English Mock 10', table: 'SSC GD English Mock 10', questions: 80, duration: 60, difficulty: 'Expert', bucket: 'SSC GD English' },
  ];

  // Subject-wise tests ✅ FIXED Reasoning 4 spacing
  const reasoningTests = [
    { id: 'r1', name: 'Reasoning Set 1', table: 'Reasoning 1', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'r2', name: 'Reasoning Set 2', table: 'Reasoning 2', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'r3', name: 'Reasoning Set 3', table: 'Reasoning 3', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'r4', name: 'Reasoning Set 4', table: 'Reasoning 4', questions: 25, duration: 30, difficulty: 'Hard' }, // ✅ Fixed spacing
    { id: 'r5', name: 'Reasoning Set 5', table: 'Reasoning 5', questions: 25, duration: 30, difficulty: 'Expert' },
  ];

  const mathsTests = [
    { id: 'm1', name: 'Maths Set 1', table: 'Maths 1', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'm2', name: 'Maths Set 2', table: 'Maths 2', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'm3', name: 'Maths Set 3', table: 'Maths 3', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'm4', name: 'Maths Set 4', table: 'Maths 4', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'm5', name: 'Maths Set 5', table: 'Maths 5', questions: 25, duration: 30, difficulty: 'Expert' },
  ];

  const computerTests = [
    { id: 'c1', name: 'Computer Set 1', table: 'Computer 1', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'c2', name: 'Computer Set 2', table: 'Computer 2', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'c3', name: 'Computer Set 3', table: 'Computer 3', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'c4', name: 'Computer Set 4', table: 'Computer 4', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'c5', name: 'Computer Set 5', table: 'Computer 5', questions: 25, duration: 30, difficulty: 'Expert' },
  ];

  const gaTests = [
    { id: 'ga1', name: 'General Awareness Set 1', table: 'General Awareness 1', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'ga2', name: 'General Awareness Set 2', table: 'General Awareness 2', questions: 25, duration: 30, difficulty: 'Medium' },
    { id: 'ga3', name: 'General Awareness Set 3', table: 'General Awareness 3', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'ga4', name: 'General Awareness Set 4', table: 'General Awareness 4', questions: 25, duration: 30, difficulty: 'Hard' },
    { id: 'ga5', name: 'General Awareness Set 5', table: 'General Awareness 5', questions: 25, duration: 30, difficulty: 'Expert' },
  ];

  const previousYearPapers = [
    { id: 'dp2023', name: 'Delhi Police 2023', table: 'Delhi Police 2023', questions: 100, duration: 90, badge: 'Official' }, // ✅ Fixed typo: Dehli → Delhi
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">Mock Tests</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Full-length mock tests simulating the actual Delhi Police exam
              </p>
            </div>
            {!isPremium && (
              <Link to="/upgrade">
                <Button className="gradient-primary w-full sm:w-auto">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Free Test - Always First */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-success/10 text-success border-success/20">Free Access</Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <TestCard
              {...freeTest}
              isPremium={isPremium}
              isLocked={false}
              index={0}
            />
          </div>
        </div>

        {/* Full Mock Tests */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="gradient-primary text-primary-foreground border-0">
              <Crown className="w-3 h-3 mr-1" />
              Full Mock Tests
            </Badge>
            {!isPremium && (
              <span className="text-xs text-muted-foreground">Unlock all with Premium</span>
            )}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {mockTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index + 1}
              />
            ))}
          </div>
        </div>

        {/* Reasoning Tests */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Reasoning Tests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {reasoningTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Maths Tests */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Mathematics Tests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {mathsTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Computer Tests */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Computer Tests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {computerTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* General Awareness Tests */}
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">General Awareness Tests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {gaTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Previous Year Papers */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-display font-bold mb-4">Previous Year Papers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {previousYearPapers.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                duration={90}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* SSC GD Section - New Dedicated Section */}
        <div className="border-t-4 border-orange-500/30 pt-8 mt-8">
          <div className="mb-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-display font-bold">SSC GD Constable 2025</h1>
                  <Badge className="bg-orange-500 text-white border-0">New</Badge>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">
                  Full-length mock tests for SSC GD Constable exam - Available in Hindi & English
                </p>
              </div>
              {!isPremium && (
                <Link to="/upgrade">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
                    <Crown className="w-4 h-4 mr-2" />
                    Unlock All SSC GD Tests
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* All SSC GD Tests Combined */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {/* Hindi Tests */}
            {sscGDHindiTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index}
              />
            ))}
            {/* English Tests */}
            {sscGDEnglishTests.map((test, index) => (
              <TestCard
                key={test.id}
                {...test}
                isPremium={isPremium}
                isLocked={!isPremium}
                index={index + sscGDHindiTests.length}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
