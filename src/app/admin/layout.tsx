'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, BookMarked, Tags, Globe, ClipboardList, Newspaper, Users, Ban, Home, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

const adminNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: Shield },
    { href: '/admin/words', label: 'Words', icon: BookMarked },
    { href: '/admin/categories', label: 'Categories', icon: Tags },
    { href: '/admin/locations', label: 'Locations', icon: Globe },
    { href: '/admin/quizzes', label: 'Quizzes', icon: ClipboardList },
    { href: '/admin/blog', label: 'Blog', icon: Newspaper },
];

const superAdminLinks = [
    { href: '/admin/users', label: 'Users', icon: Users },
];

const AdminNav = () => {
    const pathname = usePathname();
    const { isSuperAdmin } = useAuth();

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-4">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Shield className="h-6 w-6 text-primary" />
                    <span>Admin Panel</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {adminNavLinks.map(link => (
                         <Button key={link.href} variant={pathname === link.href ? 'secondary' : 'ghost'} className="justify-start" asChild>
                             <Link href={link.href}>
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Link>
                         </Button>
                    ))}
                    {isSuperAdmin && superAdminLinks.map(link => (
                         <Button key={link.href} variant={pathname === link.href ? 'secondary' : 'ghost'} className="justify-start" asChild>
                             <Link href={link.href}>
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </Link>
                         </Button>
                    ))}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                 <Button variant="ghost" className="justify-start w-full" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Lexicon
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
             <div className="flex h-screen items-center justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="container mx-auto max-w-md px-4 py-12 text-center">
                    <Card><CardHeader className="items-center"><div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2"><Ban className="h-8 w-8 text-destructive" /></div><CardTitle>Access Denied</CardTitle><CardDescription>You do not have permission to view the admin area.</CardDescription></CardHeader><CardContent><Button asChild><Link href="/">Back to Lexicon</Link></Button></CardContent></Card>
                </div>
            </div>
        );
    }
  
    return (
        <SidebarProvider>
            <Sidebar variant="sidebar" collapsible="none" className="bg-card">
                <AdminNav />
            </Sidebar>
            <div className="flex flex-col flex-1">
                <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 md:hidden">
                    <SidebarTrigger />
                    <Logo />
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
