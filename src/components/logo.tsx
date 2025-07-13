import Link from 'next/link';

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2" aria-label="Tamil Lexicon Home">
            <span className="font-headline text-xl font-bold text-primary">Tamil</span>
            <span className="font-headline text-xl font-semibold text-foreground">Lexicon</span>
        </Link>
    )
}
