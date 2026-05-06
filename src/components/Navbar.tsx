'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Home, List, ShieldCheck, PlusCircle } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/listings', label: 'Listings', icon: List },
        { href: '/my-rentals', label: 'My Rentals', icon: ShieldCheck },
        { href: '/list-property', label: 'List Property', icon: PlusCircle },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:rotate-12 transition-transform">
                            R
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                            RentChain
                        </span>
                    </Link>
                    
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 hover:bg-white/50",
                                        isActive 
                                            ? "text-blue-600 bg-blue-50/50" 
                                            : "text-gray-600 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 rounded-full">
                            Support
                        </Button>
                        <Link href="/listings">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-200 px-6 active:scale-95 transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
