'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Verse {
  verse: number;
  text: string; // KJV text
  sinaiticus?: {
    text: string;
    notes?: string;
  };
  fragment?: boolean; // Indicates if Sinaiticus text is missing/fragmented
  notes?: string; // General notes for the verse
}

interface Chapter {
  chapter: number;
  verses: Verse[];
}

interface BookData {
  id: string;
  name: string;
  chapters: Chapter[];
}

interface BookReaderProps {
  book: BookData;
  version: 'kjv' | 'sinaiticus'; // The version of the book being displayed (e.g., 'sinaiticus' for the primary text)
  highlightChapter?: number; // New prop for highlighting
  highlightVerse?: number;   // New prop for highlighting
}

export default function BookReader({ book, version, highlightChapter, highlightVerse }: BookReaderProps) {
  const verseRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({}); // Ref for verses

  useEffect(() => {
    if (highlightChapter && highlightVerse) {
      const verseId = `verse-${highlightChapter}-${highlightVerse}`;
      const element = verseRefs.current[verseId];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Optional: Add a temporary highlight class that fades out
        element.classList.add('bg-yellow-200', 'dark:bg-yellow-700', 'rounded', 'p-1');
        const timer = setTimeout(() => {
          element.classList.remove('bg-yellow-200', 'dark:bg-yellow-700', 'rounded', 'p-1');
        }, 3000); // Remove highlight after 3 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [highlightChapter, highlightVerse, book]); // Re-run when book changes too

  if (!book || book.chapters.length === 0) {
    return <p>No chapters found for this book.</p>;
  }

  return (
    <div className="reader-pane"> {/* Applied reader-pane class */}
      <h2 className="text-2xl font-semibold mb-2">{book.name} ({version === 'sinaiticus' ? 'Sinaiticus' : 'KJV'})</h2>

      {book.chapters.map((chapter, index) => (
        <div key={`${chapter.chapter}-${index}`} className="mb-4">
          <h3 className="text-lg font-medium mb-2">Chapter {chapter.chapter}</h3>
          {chapter.verses.map((verse, index) => {
            const isHighlighted = highlightChapter === chapter.chapter && highlightVerse === verse.verse;
            const verseId = `verse-${chapter.chapter}-${verse.verse}`;
            return (
              <p
                key={`${verseId}-${index}`}
                id={verseId}
                ref={(el: HTMLParagraphElement | null) => {
                  verseRefs.current[verseId] = el;
                }}
                className={`verse ${isHighlighted ? 'bg-yellow-200 dark:bg-yellow-700 rounded p-1' : ''}`}
              >
                <span className="verse-number">{verse.verse}</span>{' '}
                {version === 'sinaiticus' && verse.sinaiticus?.text ? (
                  <>
                    {verse.sinaiticus.text}
                    {verse.fragment && <span className="text-red-500 ml-1">[missing]</span>}
                    {verse.sinaiticus.notes && <span className="text-blue-500 ml-1">({verse.sinaiticus.notes})</span>}
                  </>
                ) : (
                  <>
                    {verse.text}
                  </>
                )}
              </p>
            );
          })}
        </div>
      ))}
    </div>
  );
}
