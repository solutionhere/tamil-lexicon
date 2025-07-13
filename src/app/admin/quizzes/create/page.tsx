'use client';

import { QuizCreationForm } from '@/components/quiz-creation-form';
import { createQuizAction } from '../actions';

export default function CreateQuizPage() {
    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary">Create a New Quiz</h1>
                <p className="mt-2 text-muted-foreground">Build a new quiz to challenge the community.</p>
            </div>
            <QuizCreationForm formAction={createQuizAction} />
        </div>
    );
}
