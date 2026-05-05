'use client';

import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="text-2xl font-bold">
                        RentChain
                    </Link>
                    <div className="flex space-x-6">
                        <Link href="/" className="hover:text-blue-100 transition">
                            Home
                        </Link>
                        <Link href="/listings" className="hover:text-blue-100 transition">
                            Listings
                        </Link>
                        <Link href="/my-rentals" className="hover:text-blue-100 transition">
                            My Rentals
                        </Link>
                        <Link href="/list-property" className="hover:text-blue-100 transition">
                            List Property
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
