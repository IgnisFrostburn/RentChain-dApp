import Navbar from '@/components/Navbar';

export default function MyRentalsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">My Rentals</h1>

                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <p className="text-xl text-gray-600 mb-6">
                            Connect your wallet to view your rentals
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
