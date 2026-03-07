export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Kreditor.az</h1>
          <p className="mt-2 text-sm text-gray-500">
            Bir müraciətlə birdən çox banka kredit ərizəsi göndərin
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Mobil nömrə
            </label>
            <input
              type="tel"
              placeholder="+994 50 000 00 00"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              FİN kod
            </label>
            <input
              type="text"
              placeholder="Şəxsiyyət vəsiqəsinin FİN kodu"
              maxLength={7}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm uppercase outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Bank seçin
            </label>
            <p className="text-xs text-gray-400">Banklar tezliklə əlavə ediləcək</p>
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
          >
            Müraciət göndər
          </button>
        </form>
      </div>
    </main>
  );
}
