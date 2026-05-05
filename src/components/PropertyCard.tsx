'use client';

import Link from 'next/link';

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
    const statusColor = status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                        {status}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{location}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Rent per month:</span>
                        <span className="font-semibold text-gray-800">{rentADA} ADA</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Security Deposit:</span>
                        <span className="font-semibold text-gray-800">{depositADA} ADA</span>
                    </div>
                </div>

                <Link
                    href={`/listings/${id}`}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
