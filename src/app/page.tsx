import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
                {/* Hero Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                            RentChain
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8">
                            Trustless Peer-to-Peer Rentals on Cardano
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/listings"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
                            >
                                Browse Listings
                            </Link>
                            <Link
                                href="/list-property"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition"
                            >
                                List Your Property
                            </Link>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-gray-100 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                            How It Works
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="bg-white rounded-lg p-8 shadow-md">
                                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-4">
                                    1
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Connect Wallet
                                </h3>
                                <p className="text-gray-600">
                                    Connect your Cardano wallet to browse listings and make payments securely.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="bg-white rounded-lg p-8 shadow-md">
                                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-4">
                                    2
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Sign Agreement
                                </h3>
                                <p className="text-gray-600">
                                    Review and sign the rental agreement using your wallet.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="bg-white rounded-lg p-8 shadow-md">
                                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold mb-4">
                                    3
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Pay in ADA
                                </h3>
                                <p className="text-gray-600">
                                    Pay rent and deposit in ADA. Security deposit is held in escrow on-chain.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p>&copy; 2024 RentChain. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </>
    );
}
