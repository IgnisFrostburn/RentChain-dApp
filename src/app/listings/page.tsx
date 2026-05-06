import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ListingsPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Available <span className="text-blue-600">Spaces.</span>
                        </h1>
                        <p className="text-gray-500 font-medium">Explore hand-picked properties across the Philippines.</p>
                    </div>
                    
                    <div className="w-full md:w-auto flex items-center gap-3">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input 
                                placeholder="Search by location..." 
                                className="pl-10 h-12 bg-white/50 border-gray-200 rounded-xl focus:ring-blue-600/20 transition-all"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-gray-200 bg-white/50">
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <div key={property.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${property.id * 100}ms` }}>
                            <PropertyCard
                                id={property.id}
                                title={property.title}
                                location={property.location}
                                rentADA={property.rentADA}
                                depositADA={property.depositADA}
                                status={property.status as 'Available' | 'Rented'}
                            />
                        </div>
                    ))}
                </div>

                {/* Pagination Placeholder */}
                <div className="mt-16 flex justify-center">
                    <Button variant="ghost" className="text-gray-500 font-bold hover:text-blue-600">
                        View More Properties
                    </Button>
                </div>
            </main>
        </div>
    );
}
