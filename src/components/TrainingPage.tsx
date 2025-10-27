import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { GraduationCap, Clock, CheckCircle2, Lock, Play, Award } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { Lesson, QuizQuestion } from '../App';

interface TrainingPageProps {
  lessons: Lesson[];
  updateLesson: (lessonId: string, updates: Partial<Lesson>) => void;
}

export function TrainingPage({ lessons, updateLesson }: TrainingPageProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);

  const completedCount = lessons.filter(l => l.completed).length;
  const progress = (completedCount / lessons.length) * 100;

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (selectedLesson && currentQuestion < selectedLesson.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      if (selectedLesson) {
        const correctAnswers = answers.filter((a, i) => a === selectedLesson.quiz[i].correct).length;
        const score = Math.round((correctAnswers / selectedLesson.quiz.length) * 100);
        
        updateLesson(selectedLesson.id, {
          completed: true,
          score: score
        });
        
        setQuizComplete(true);
        
        // Calculate XP earned
        const xpEarned = score >= 90 ? 50 : score >= 70 ? 30 : 20;
        
        if (score >= 70) {
          toast.success(`Great job! You scored ${score}% and earned ${xpEarned} XP! 🎉`);
        } else {
          toast.warning(`You scored ${score}% and earned ${xpEarned} XP. Try again to improve!`);
        }
      }
    }
  };

  const handleClose = () => {
    setSelectedLesson(null);
    setShowQuiz(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizComplete(false);
  };

  const getBadgeForCompletion = () => {
    if (completedCount === lessons.length) return { name: 'Security Expert', icon: '🏆', color: 'from-yellow-400 to-orange-500' };
    if (completedCount >= 4) return { name: 'Advanced Defender', icon: '🛡️', color: 'from-purple-400 to-pink-500' };
    if (completedCount >= 3) return { name: 'Security Champion', icon: '⭐', color: 'from-blue-400 to-cyan-500' };
    if (completedCount >= 2) return { name: 'Learning Pro', icon: '📚', color: 'from-green-400 to-teal-500' };
    if (completedCount >= 1) return { name: 'Getting Started', icon: '🌱', color: 'from-gray-400 to-gray-500' };
    return null;
  };

  const badge = getBadgeForCompletion();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Employee Training Portal</h2>
        <p className="text-gray-600">Build your cybersecurity knowledge with interactive lessons</p>
      </div>

      {/* Overall Progress */}
      <Card className="backdrop-blur-sm bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Your Training Progress</CardTitle>
          <CardDescription className="text-blue-100">
            Complete all lessons to earn badges and improve your security score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Completed</span>
                <span className="text-white">{completedCount} / {lessons.length} lessons</span>
              </div>
              <Progress value={progress} className="h-3 bg-blue-400" />
              <p className="text-blue-100 text-sm">{Math.round(progress)}% complete</p>
            </div>
            
            {badge && (
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-4xl shadow-lg mb-2`}>
                  {badge.icon}
                </div>
                <p className="text-white">{badge.name}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, index) => {
          const isLocked = index > 0 && !lessons[index - 1].completed;
          
          return (
            <Card
              key={lesson.id}
              className={`backdrop-blur-sm bg-white/90 border-0 shadow-lg hover:shadow-xl transition-all ${
                isLocked ? 'opacity-60' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <GraduationCap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      )}
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </CardDescription>
                  </div>
                  {lesson.completed && lesson.score !== undefined && (
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {lesson.score}%
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.content}</p>
                
                <Button
                  onClick={() => handleStartLesson(lesson)}
                  disabled={isLocked}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 disabled:opacity-50"
                >
                  {isLocked ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Locked
                    </>
                  ) : lesson.completed ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Review Lesson
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Lesson
                    </>
                  )}
                </Button>
                
                {isLocked && (
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Complete previous lesson to unlock
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lesson/Quiz Modal */}
      <Dialog open={selectedLesson !== null} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedLesson && !showQuiz && !quizComplete && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  {selectedLesson.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {selectedLesson.duration}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-blue-900 mb-2">Key Takeaways:</h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                      <span>Always verify the sender's identity before taking action</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                      <span>Look for suspicious indicators and red flags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                      <span>When in doubt, report it to your security team</span>
                    </li>
                  </ul>
                </div>

                <Button
                  onClick={handleStartQuiz}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  Take Quiz ({selectedLesson.quiz.length} Questions)
                </Button>
              </div>
            </>
          )}

          {selectedLesson && showQuiz && !quizComplete && (
            <>
              <DialogHeader>
                <DialogTitle>Quiz: {selectedLesson.title}</DialogTitle>
                <DialogDescription>
                  Question {currentQuestion + 1} of {selectedLesson.quiz.length}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <Progress value={((currentQuestion + 1) / selectedLesson.quiz.length) * 100} className="h-2" />

                <div className="space-y-4">
                  <h3 className="text-gray-900">
                    {selectedLesson.quiz[currentQuestion].question}
                  </h3>

                  <RadioGroup
                    value={answers[currentQuestion]?.toString() || ''}
                    onValueChange={(value) => handleAnswer(parseInt(value))}
                  >
                    {selectedLesson.quiz[currentQuestion].options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === undefined}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  {currentQuestion < selectedLesson.quiz.length - 1 ? 'Next Question' : 'Submit Quiz'}
                </Button>
              </div>
            </>
          )}

          {selectedLesson && quizComplete && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-green-600">
                  <Award className="w-5 h-5" />
                  Quiz Complete!
                </DialogTitle>
                <DialogDescription>
                  You've completed {selectedLesson.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center">
                  <div className="text-6xl mb-4">
                    {selectedLesson.score && selectedLesson.score >= 70 ? '🎉' : '📚'}
                  </div>
                  <h3 className="text-green-900 mb-2">
                    Your Score: {selectedLesson.score}%
                  </h3>
                  <p className="text-green-700">
                    {selectedLesson.score && selectedLesson.score >= 70
                      ? 'Excellent work! You\'ve mastered this topic.'
                      : 'Keep learning! Review the material and try again.'}
                  </p>
                </div>

                <div className="space-y-2">
                  {selectedLesson.quiz.map((q, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        answers[i] === q.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-sm text-gray-700">{q.question}</span>
                        {answers[i] === q.correct ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <span className="text-red-500 flex-shrink-0">✗</span>
                        )}
                      </div>
                      {answers[i] !== q.correct && (
                        <p className="text-xs text-gray-600 mt-1">
                          Correct answer: {q.options[q.correct]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                >
                  Continue Learning
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}