"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ViolinChart from '@/components/violin-chart';

const ResultsPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-results');
        const result = await response.json();
        setData(result);
        console.log(result);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
        <main className="container mx-auto max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </main>
      </div>
    );
  }

  let numRatings = 0;
  for (const rating of data.ratings) {
    if (rating.length > numRatings) {
      numRatings = rating.length
    }
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 md:p-6">
      <main className="container mx-auto max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold">Here are the current results!</h1>
        <p className="text-lg">
          (So far we've had {numRatings} ratings)
        </p>
        <ViolinChart data={data} />
        <div className="flex flex-col">
          <Link href="/" className="mt-6 inline-block bg-muted text-white font-semibold py-2 px-4 rounded-md transition duration-200 hover:bg-muted-foreground">
            Back to ranking form
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
