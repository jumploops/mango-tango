"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const MangoDisplay = ({ score }) => {
  const numberOfMangos = Math.floor((score ?? 0) / 2) || 1;

  const mangoes = Array.from({ length: numberOfMangos }, (_, index) => (
    <span key={index} role="img" aria-label="mango">
      {score > 1 ? "🥭" : "💩"}
    </span>
  ));

  return <div>{mangoes}</div>;
};

export function MangoRankingForm() {
  const router = useRouter();
  const [ratings, setRatings] = useState({
    Taralay: null,
    Zill: null,
    Bombay: null,
    Keitt: null,
    "Bailey's Marvel": null,
    Kent: null,
    "Tommy Atkins": null,
    "Valencia Pride": null,
    Irwin: null,
    Osteen: null,
  });
  const [name, setName] = useState("");
  const [visibleSliders, setVisibleSliders] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (mango: string, value: number[]) => {
    const ranking = value[0];
    setRatings({
      ...ratings,
      [mango]: ranking,
    });
  };

  const handleRowClick = (mango: string) => {
    if (!visibleSliders.includes(mango)) {
      setVisibleSliders((prev) => [...prev, mango]);
      if (ratings[mango] === null) {
        setRatings((prevRatings) => ({
          ...prevRatings,
          [mango]: 4,
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasRatedAtLeastOneMango = Object.values(ratings).some((rating) => rating !== null);
    if (!name || !hasRatedAtLeastOneMango) {
      // Add some form feedback here if necessary
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit-mango-rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, ratings }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit mango rankings");
      }

      const result = await response.json();
      console.log("Response received:", result);

      // Handle success (e.g., show a success message or redirect)
      router.push('/thank-you'); // Assuming you have a thank-you page
    } catch (error) {
      console.error("Error submitting mango rankings:", error);
      // Handle the error (e.g., show an error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingsArray = Object.entries(ratings);

  const hasRatedAtLeastOneMango = Object.values(ratings).some((rating) => rating !== null);
  const isSubmitDisabled = !name || !hasRatedAtLeastOneMango || isSubmitting;

  return (
    <div className="w-full min-h-screen bg-background text-foreground p-4 md:p-6">
      <main className="container mx-auto max-w-md space-y-3">
        <h1 className="text-3xl text-center font-bold">Welcome to the 7th Annual</h1>
        <h1 className="text-3xl text-center font-bold pb-8">🥭 Mango Tango! 💃</h1>
        <h2 className="text-xl text-center font-bold">Please rank each mango as you eat them, high scores to the right!</h2>
        <div className="pt-8 space-y-4">
          {ratingsArray.map(([mango, rating], index) => (
            <div
              key={mango}
              className={`p-4 h-[105px] rounded-lg ${rating !== null
                ? rating <= 1
                  ? "bg-muted-foreground"
                  : rating <= 2
                    ? "bg-green-600"
                    : rating <= 3
                      ? "bg-green-500"
                      : rating <= 4
                        ? "bg-yellow-300"
                        : rating <= 5
                          ? "bg-yellow-400"
                          : rating <= 6
                            ? "bg-red-400"
                            : rating <= 7
                              ? "bg-red-500"
                              : "bg-red-600"
                : "bg-muted"
                }`}
              onClick={() => handleRowClick(mango)}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">
                  #{index + 1} {mango}
                </h2>
                {rating !== null ? (
                  <span className="text-sm font-medium bg-muted text-muted-foreground px-2 py-1 rounded-md">
                    Score: <MangoDisplay score={rating} />
                  </span>
                ) : (
                  <span className="text-sm font-medium">Tap to rate</span>
                )}
              </div>
              {visibleSliders.includes(mango) && rating !== null && (
                <Slider
                  value={[rating]}
                  onValueChange={(value) => handleRatingChange(mango, value)}
                  min={1}
                  max={10}
                  step={1}
                  className={`w-full ${rating <= 2 ? "bg-red-500" : rating <= 4 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-4">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full flex justify-center items-center" disabled={isSubmitDisabled}>
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8zm2 5.292A7.953 7.953 0 014 12H2c0 2.21.896 4.21 2.292 5.708l.708-.416z"
                ></path>
              </svg>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
