'use client';

import Navbar from '@/components/Navbar';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Building2, MapPin, Coins, Info, ArrowRight } from 'lucide-react';

export default function ListPropertyPage() {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        alert("Listing submission logic would go here. In this demo, listings are static mock data.");
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    {/* Left: Info */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                List your <span className="text-blue-600">Property.</span>
                            </h1>
                            <p className="text-xl text-gray-600 font-medium">
                                Join the decentralized rental revolution and reach thousands of global tenants.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { icon: Building2, title: "Total Control", desc: "No property managers taking a cut. You own the contract." },
                                { icon: Coins, title: "Instant Settlements", desc: "Receive rent and deposits directly in ADA, verified instantly." },
                                { icon: Info, title: "Zero Disputes", desc: "Terms are locked on-chain. Trust is built into the protocol." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <Card className="flex-[1.2] w-full rounded-[2.5rem] border-none shadow-2xl shadow-blue-200/50 overflow-hidden">
                        <CardHeader className="p-10 pb-0">
                            <CardTitle className="text-2xl font-bold">Property Details</CardTitle>
                            <CardDescription>Fill in the details to create your on-chain listing.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-gray-400">Property Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Modern Studio in IT Park"
                                        className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-bold uppercase tracking-wider text-gray-400">Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="location"
                                            placeholder="Cebu City, Philippines"
                                            className="h-12 pl-10 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="rent" className="text-sm font-bold uppercase tracking-wider text-gray-400">Monthly Rent (ADA)</Label>
                                        <Input
                                            id="rent"
                                            type="number"
                                            placeholder="200"
                                            className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deposit" className="text-sm font-bold uppercase tracking-wider text-gray-400">Deposit (ADA)</Label>
                                        <Input
                                            id="deposit"
                                            type="number"
                                            placeholder="400"
                                            className="h-12 rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-gray-400">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the amenities, view, and nearby locations..."
                                        rows={4}
                                        className="rounded-xl border-gray-100 bg-gray-50/50 focus:bg-white transition-all"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold shadow-xl shadow-blue-200 group transition-all">
                                    Create Listing
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
