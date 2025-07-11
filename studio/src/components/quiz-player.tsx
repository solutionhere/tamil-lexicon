'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Quiz, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QuizResults } from './quiz-results';
import { cn } from '@/lib/utils';
import { Check, X, Loader2 } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  user: User;
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect';

export function QuizPlayer({ quiz, user }: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered');
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const handleNextQuestion = useCallback(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setAnswerState('unanswered');
          setSelectedAnswerIndex(null);
      } else {
          setIsFinished(true);
      }
  }, [currentQuestionIndex, quiz.questions.length]);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (answerState !== 'unanswered') return;

    setSelectedAnswerIndex(answerIndex);
    if (answerIndex === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
      setAnswerState('correct');
    } else {
      setAnswerState('incorrect');
    }
    
    setTimeout(() => {
      handleNextQuestion();
    }, 2000); // Wait 2 seconds before moving to the next question
  }, [answerState, currentQuestion, handleNextQuestion]);

  useEffect(() => {
    if (isFinished || answerState !== 'unanswered' || !currentQuestion) return;
    
    setTimeLeft(currentQuestion.timeLimitSeconds);
    
    const timer = setInterval(() => {
        setTimeLeft(t => {
            if (t <= 1) {
                clearInterval(timer);
                handleAnswer(-1); // Timeout
                return 0;
            }
            return t - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isFinished, answerState, currentQuestion, handleAnswer]);
  
  if (isFinished) {
      return <QuizResults score={score} totalQuestions={quiz.questions.length} quizId={quiz.id} user={user} />;
  }
  
  if (!currentQuestion) {
      return <div className="flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const timeProgress = (timeLeft / currentQuestion.timeLimitSeconds) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
            <CardDescription>Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardDescription>
            <CardDescription>Score: {score}</CardDescription>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <CardTitle className="pt-4 text-center text-2xl md:text-3xl">{currentQuestion.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-1">
            <Progress value={timeProgress} className="h-1 absolute top-0 left-0 right-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswerIndex === index;
                const isCorrect = currentQuestion.correctAnswerIndex === index;
                
                return (
                    <Button
                        key={index}
                        size="lg"
                        variant="outline"
                        className={cn("h-auto justify-between items-center p-4 text-left text-base whitespace-normal",
                            answerState !== 'unanswered' && isCorrect && 'bg-green-500/20 border-green-500 hover:bg-green-500/20 text-foreground',
                            answerState === 'incorrect' && isSelected && 'bg-red-500/20 border-red-500 hover:bg-red-500/20 text-foreground',
                        )}
                        onClick={() => handleAnswer(index)}
                        disabled={answerState !== 'unanswered'}
                    >
                        <span className="flex-1 mr-4">{option}</span>
                        {answerState !== 'unanswered' && isSelected && (isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-red-600" />)}
                        {answerState !== 'unanswered' && !isSelected && isCorrect && <Check className="h-5 w-5 text-green-600" />}

                    </Button>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
