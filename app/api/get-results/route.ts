import { NextResponse } from 'next/server';

const transformName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')  // Add space before uppercase letters
    .replace(/^\w/, c => c.toUpperCase());  // Capitalize the first letter
};

export async function GET() {
  const url = process.env.MAGIC_LOOP_RESULTS_URL || "";

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch data from Magic Loops API' }, { status: response.status });
    }

    const responseJson = await response.json();
    console.log(responseJson);
    const { names, ratings } = responseJson.loopOutput;

    console.log('STATUS:', responseJson.status);
    console.log('OUTPUT:', responseJson.loopOutput);

    return NextResponse.json({ names: names.map(transformName), ratings });
  } catch (error) {
    console.error('Error fetching data from Magic Loops API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
