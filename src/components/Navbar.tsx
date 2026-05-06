'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Home, List, ShieldCheck, PlusCircle, Wallet2 } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/listings', label: 'Listings', icon: List },
        { href: '/my-rentals', label: 'Rentals', icon: ShieldCheck },
        { href: '/list-property', label: 'List', icon: PlusCircle },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                                R
                            </div>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white uppercase group-hover:text-blue-400 transition-colors">
                            RentChain
                        </span>
                    </Link>
                    
                    <div className="hidden md:flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                        isActive 
                                            ? "text-white bg-white/10 shadow-sm" 
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-gray-500")} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 font-bold hidden sm:flex">
                            Docs
                        </Button>
                        <Button className="bg-white text-black hover:bg-gray-200 rounded-xl px-6 font-black transition-all shadow-lg shadow-white/5 active:scale-95">
                            <Wallet2 className="w-4 h-4 mr-2" />
                            Connect
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
