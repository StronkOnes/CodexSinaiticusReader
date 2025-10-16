import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="reader-pane min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-primary mb-6">About the Codex Sinaiticus Reader</h1>
      <div className="text-left max-w-2xl mx-auto">
        <p className="mb-4">
          The Codex Sinaiticus is one of the most important books in the world. Handwritten more than 1,600 years ago,
          the manuscript contains the Christian Bible in Greek, including the oldest complete copy of the New Testament.
          Its pages are of immense value to the study of the Bible and the history of Christianity.
        </p>
        <p className="mb-4">
          This digital reader aims to make this historical treasure more accessible. Our platform allows you to explore
          the text of the Codex Sinaiticus with modern readability features, offering insights into its unique readings
          and historical context.
        </p>
        <h2 className="text-2xl font-semibold text-accent mb-3">Discovery and Translation:</h2>
        <p className="mb-4">
          The Codex Sinaiticus was discovered by Constantin von Tischendorf in the mid-19th century at Saint Catherine's Monastery
          at the foot of Mount Sinai in Egypt. Tischendorf, a German biblical scholar, made three visits to the monastery,
          eventually securing the majority of the manuscript's pages.
        </p>
        <p className="mb-4">
          The manuscript's journey from the monastery to the Russian Imperial Library, and eventually to the British Library,
          is a fascinating tale of scholarly pursuit and international diplomacy. Its translation and study have been ongoing
          since its discovery, continually enriching our understanding of early biblical texts.
        </p>
        <h2 className="text-2xl font-semibold text-accent mb-3">Our Mission:</h2>
        <p className="mb-4">
          We believe that ancient texts like the Codex Sinaiticus should be available to everyone. Our mission is to provide
          a user-friendly, aesthetically pleasing, and accurate digital platform for studying this monumental work.
        </p>
      </div>
      <Link href="/" className="btn-primary text-lg mt-8">
        Back to Home
      </Link>
    </div>
  );
}
