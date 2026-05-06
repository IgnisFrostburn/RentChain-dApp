


export default function WalletModal({
    availableWallets,
    onClose,
    onSelectWallet
}: {
    availableWallets: string[]
    onClose: () => void
    onSelectWallet: (walletName: string) => void
}) {

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Select Wallet</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {availableWallets.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No wallets detected</p>
                ) : (
                    <div className="space-y-2">
                        {availableWallets.map((w) => (
                            console.log("Available Wallet:", w),
                            <button
                                key={w}
                                onClick={() => {
                                    onClose();
                                    onSelectWallet(w);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition"
                            >
                                <span className="font-medium text-gray-800">{w}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}