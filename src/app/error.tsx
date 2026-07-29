"use client";

import { useEffect } from "react";
import { Button } from "@base-ui/react/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-red-600">Application Error</h1>
        <p className="mb-6 text-gray-600">
          {error.message || "Something went wrong while loading this page"}
        </p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}
