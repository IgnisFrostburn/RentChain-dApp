import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/mockData';

export default function ListingsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        Available Properties
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                id={property.id}
                                title={property.title}
                                location={property.location}
                                rentADA={property.rentADA}
                                depositADA={property.depositADA}
                                status={property.status as 'Available' | 'Rented'}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
