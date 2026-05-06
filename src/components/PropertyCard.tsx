'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, ArrowUpRight } from 'lucide-react';

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
        <Card className="group overflow-hidden border-blue-100/50 bg-white/70 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300">
            <div className="relative h-48 w-full bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/0 transition-colors" />
                <div className="absolute top-3 left-3 z-10">
                    <Badge variant={status === 'Available' ? 'success' : 'warning'} className="backdrop-blur-md shadow-sm">
                        {status}
                    </Badge>
                </div>
                {/* Decorative element representing a house/structure */}
                <div className="absolute bottom-4 right-4 text-blue-200/50 group-hover:text-blue-400/30 transition-colors">
                    <ArrowUpRight className="w-24 h-24 rotate-45" />
                </div>
            </div>
            
            <CardHeader className="p-5 pb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{title}</h3>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {location}
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-2">
                <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Monthly Rent</p>
                        <p className="text-lg font-black text-blue-700">{rentADA} <span className="text-xs font-medium">ADA</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-orange-400">Deposit</p>
                        <p className="text-lg font-black text-orange-700">{depositADA} <span className="text-xs font-medium">ADA</span></p>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0">
                <Link href={`/listings/${id}`} className="w-full">
                    <Button variant="outline" className="w-full h-11 border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all group/btn">
                        Details
                        <ArrowUpRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
