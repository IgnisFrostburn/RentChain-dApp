import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { properties } from '@/data/mockData';

interface PropertyDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
    const { id } = await params;
    const property = properties.find((p) => p.id === parseInt(id));

    if (!property) {
        return (
            <>
                <Navbar />
                <main className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
                        <Link href="/listings" className="text-blue-600 hover:text-blue-700 mt-4">
                            Back to Listings
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Link href="/listings" className="text-blue-600 hover:text-blue-700 mb-6 inline-block">
                        ← Back to Listings
                    </Link>

                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="p-8">
                            <div className="mb-6">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                    {property.title}
                                </h1>
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${property.status === 'Available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {property.status}
                                </span>
                            </div>

                            <p className="text-xl text-gray-600 mb-8">{property.location}</p>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-700 text-lg">{property.description}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <p className="text-gray-600 mb-2">Rent per Month</p>
                                    <p className="text-3xl font-bold text-blue-600">{property.rentADA} ADA</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <p className="text-gray-600 mb-2">Security Deposit</p>
                                    <p className="text-3xl font-bold text-orange-600">{property.depositADA} ADA</p>
                                </div>
                            </div>

                            <div className="mb-8 p-6 bg-gray-100 rounded-lg">
                                <p className="text-gray-600 mb-2">Landlord Wallet Address</p>
                                <p className="text-lg font-mono text-gray-800">{property.landlordAddress}</p>
                            </div>

                            <div className="space-y-4">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition">
                                    Connect Wallet to Rent
                                </button>
                                <button disabled className="w-full bg-gray-300 text-gray-600 font-bold py-3 px-6 rounded-lg cursor-not-allowed">
                                    Pay Deposit & Sign Agreement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
