import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export default function CreateQuizPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <div className="mb-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/quizzes">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Quizzes
                    </Link>
                </Button>
                </div>
                <Card>
                <CardHeader>
                    <CardTitle>Create New Quiz</CardTitle>
                    <CardDescription>
                    This feature is under construction. In the future, you'll be able to build and schedule quizzes from this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Quiz Creation Form Coming Soon!</p>
                    </div>
                </CardContent>
                </Card>
            </div>
        </div>
    );
}
