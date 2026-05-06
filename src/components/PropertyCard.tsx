'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, ArrowUpRight, Coins } from 'lucide-react';

interface PropertyCardProps {
    id: number;
    title: string;
    location: string;
    rentADA: number;
    depositADA: number;
    status: 'Available' | 'Rented';
}

export default function PropertyCard({
    id,
    title,
    location,
    rentADA,
    depositADA,
    status,
}: PropertyCardProps) {
    return (
        <Card className="group overflow-hidden border-white/5 bg-white/5 backdrop-blur-xl hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 rounded-[2rem]">
            <div className="relative h-56 w-full bg-[#0a0a0a] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:scale-110 transition-transform duration-700" />
                
                {/* Visual Placeholder Pattern */}
                <div className="absolute inset-0 crypto-grid opacity-30" />
                
                <div className="absolute top-4 left-4 z-10">
                    <Badge variant={status === 'Available' ? 'success' : 'warning'} className="bg-black/60 backdrop-blur-md border-white/10 font-black px-4 py-1 text-[10px] tracking-widest uppercase">
                        {status}
                    </Badge>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-400 transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
            </div>
            
            <CardHeader className="p-6 pb-2">
                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                    <Coins className="w-3 h-3" />
                    Verified Asset
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors line-clamp-1 tracking-tight">{title}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    {location}
                </div>
            </CardHeader>

            <CardContent className="p-6 pt-2">
                <div className="flex gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                    <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-1">Rent</p>
                        <p className="text-xl font-black text-white">{rentADA} <span className="text-xs font-medium text-gray-500">ADA</span></p>
                    </div>
                    <div className="w-px bg-white/5" />
                    <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-1">Deposit</p>
                        <p className="text-xl font-black text-white">{depositADA} <span className="text-xs font-medium text-gray-500">ADA</span></p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
                <Link href={`/listings/${id}`} className="w-full">
                    <Button className="w-full h-12 bg-white text-black hover:bg-blue-500 hover:text-white rounded-xl font-black transition-all active:scale-95">
                        Inspect Lease
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
