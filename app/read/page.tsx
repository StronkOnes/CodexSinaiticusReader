'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookReader from '../components/BookReader';
import { getBookData } from '@/lib/data';

export default function ReadPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId') || 'mat'; // Default to Matthew
  const chapter = searchParams.get('chapter');
  const verse = searchParams.get('verse');

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBook() {
      setLoading(true);
      setError(null);
      try {
        const fetchedBook = await getBookData('sinaiticus', bookId);
        setBook(fetchedBook);
      } catch (err) {
        console.error("Failed to fetch book data:", err);
        setError("Failed to load book. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [bookId]); // Re-fetch when bookId changes

  if (loading) {
    return <div className="reader-pane">Loading book...</div>;
  }

  if (error) {
    return <div className="reader-pane text-red-500">{error}</div>;
  }

  if (!book) {
    return <div className="reader-pane">Book not found.</div>;
  }

  return (
    <Suspense fallback={<div className="reader-pane">Loading reader...</div>}>
      <BookReader
        book={book}
        version="sinaiticus"
        highlightChapter={chapter ? parseInt(chapter) : undefined}
        highlightVerse={verse ? parseInt(verse) : undefined}
      />
    </Suspense>
  );
}
