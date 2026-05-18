'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { useWallet } from '@/contexts/WalletContext';
import {
    Home,
    List,
    ShieldCheck,
    PlusCircle,
    Wallet2,
    ChevronDown,
    LogOut,
    User,
    ArrowRight,
    X
} from 'lucide-react';
import { Card } from './ui/Card';

export default function Navbar() {
    const pathname = usePathname();
    const {
        connectedWalletName,
        walletAddress,
        connectWallet,
        disconnectWallet,
        availableWallets,
        showWalletModal,
        setShowWalletModal
    } = useWallet();
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);

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

                        {!connectedWalletName ? (
                            <Button
                                onClick={() => setShowWalletModal(true)}
                                className="bg-white text-black hover:bg-gray-200 rounded-xl px-6 font-black transition-all shadow-lg shadow-white/5 active:scale-95"
                            >
                                <Wallet2 className="w-4 h-4 mr-2" />
                                Connect
                            </Button>
                        ) : (
                            <div className="relative">
                                <Button
                                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl px-6 font-black transition-all flex items-center gap-2"
                                >
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <div className="flex flex-col items-start leading-none ml-1">
                                        <span className="capitalize text-xs font-black">{connectedWalletName}</span>
                                        {walletAddress && (
                                            <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                                                {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 4)}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown className={cn("w-3 h-3 transition-transform ml-1 opacity-50", showAccountDropdown && "rotate-180")} />
                                </Button>

                                {showAccountDropdown && (
                                    <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-white/5 mb-2">
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network</p>
                                            <p className="text-white text-sm font-bold">Cardano Mainnet</p>
                                        </div>
                                        <button className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 transition-colors">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-white text-sm font-bold">View Portfolio</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowAccountDropdown(false);
                                                setShowWalletModal(true);
                                            }}
                                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 text-blue-500" />
                                            <span className="text-white text-sm font-bold">Switch Wallet</span>
                                        </button>
                                        <button
                                            onClick={disconnectWallet}
                                            className="w-full px-4 py-3 text-left hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 text-red-500" />
                                            <span className="text-white text-sm font-bold">Disconnect</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Wallet Selection Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
                    <Card className="w-full max-w-xl rounded-[3rem] border-white/10 bg-[#0a0a0a] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)]">
                        <div className="p-12 space-y-10">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">PROVIDER_SELECT</h2>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Authorize connection to terminal</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowWalletModal(false)}
                                    className="rounded-full hover:bg-white/5 text-gray-500"
                                >
                                    <X className="w-8 h-8" />
                                </Button>
                            </div>

                            <div className="grid gap-4">
                                {availableWallets.length === 0 ? (
                                    <div className="text-center py-16 space-y-6">
                                        <Wallet2 className="w-16 h-16 text-white/5 mx-auto" />
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active providers detected</p>
                                        <Button className="bg-white/5 text-white border-white/10">Install Extension</Button>
                                    </div>
                                ) : (
                                    availableWallets.map((w) => (
                                        <button
                                            key={w}
                                            onClick={() => connectWallet(w)}
                                            className="w-full flex items-center justify-between p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-blue-500/50 transition-all group"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-black">
                                                    <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-inner" />
                                                </div>
                                                <span className="font-black text-white text-2xl uppercase tracking-tighter">{w}</span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-400 transition-all">
                                                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-white" />
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </nav>
    );
}
