export default function AddressPage({ params }: { params: { address: string } }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Wallet Analysis</h1>
      <p className="text-gray-400">Address: {params.address}</p>
      <p className="text-sm text-gray-500 mt-2">
        Transaction fetching logic is implemented in lib/chains.ts
      </p>
    </div>
  );
}
