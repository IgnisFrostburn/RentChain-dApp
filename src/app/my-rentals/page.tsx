"use client";
import { useState, useEffect } from "react";
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import { properties } from '@/data/mockData';
import Link from "next/link";

export default function MyRentalsPage() {
    const [rentedProperties, setRentedProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const rentedIds = JSON.parse(localStorage.getItem("rentedProperties") || "[]");
        const filtered = properties.filter(p => rentedIds.includes(p.id));
        setRentedProperties(filtered);
        setIsLoading(false);
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">My Rentals</h1>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Loading your rentals...</p>
                        </div>
                    ) : rentedProperties.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                            <p className="text-xl text-gray-600 mb-6">
                                You haven&apos;t rented any properties yet.
                            </p>
                            <Link 
                                href="/listings" 
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
                            >
                                Browse Listings
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rentedProperties.map((property) => (
                                <div key={property.id} className="relative">
                                    <div className="absolute top-2 right-2 z-10">
                                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                            Rented
                                        </span>
                                    </div>
                                    <PropertyCard
                                        id={property.id}
                                        title={property.title}
                                        location={property.location}
                                        rentADA={property.rentADA}
                                        depositADA={property.depositADA}
                                        status="Rented"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
