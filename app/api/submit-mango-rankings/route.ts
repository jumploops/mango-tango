import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate the incoming data
    const { name, ratings } = data;
    if (!name || typeof name !== 'string' || !ratings || typeof ratings !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Define the URL for the Magic Loop
    const url = process.env.MAGIC_LOOP_SUBMIT_URL || "";

    // Call the Magic Loop
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, ratings }),
    });

    if (!response.ok) {
      throw new Error('Failed to call Magic Loop');
    }

    const responseJson = await response.json();
    console.log('STATUS:', responseJson.status);
    console.log('OUTPUT:', responseJson.loopOutput);

    // Respond with the Magic Loop output
    return NextResponse.json({ message: 'Mango rankings processed successfully', data: responseJson.loopOutput });
  } catch (error) {
    console.error('Error handling request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
