import Link from 'next/link';

const ResultsPage = () => {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
      <main className="container mx-auto max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold">Thank You for Participating!</h1>
        <p className="text-lg">
          Your mango rankings have been successfully submitted.
        </p>
        <div className="flex flex-col">
          <Link href="/results" className="mt-6 inline-block bg-muted-foreground text-white font-semibold py-2 px-4 rounded-md transition duration-200 hover:bg-muted">
            See Results
          </Link>
          <Link href="/" className="mt-6 inline-block bg-muted text-white font-semibold py-2 px-4 rounded-md transition duration-200 hover:bg-muted-foreground">
            Back to Rankings
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
