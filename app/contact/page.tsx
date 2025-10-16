import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="reader-pane min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-primary mb-6">Contact Us</h1>
      <div className="text-left max-w-2xl mx-auto">
        <p className="mb-4">
          We'd love to hear from you! Whether you have questions, feedback, or suggestions,
          please don't hesitate to reach out.
        </p>
        <div className="space-y-4 mt-6">
          <p className="text-lg">
            <strong>Email:</strong>{' '}
            <a href="mailto:s.kobese@gmail.com" className="text-accent hover:underline">s.kobese@gmail.com</a>
          </p>
          <p className="text-lg">
            <strong>Phone:</strong>{' '}
            <a href="tel:+27729539397" className="text-accent hover:underline">+27729539397</a>
          </p>
        </div>
      </div>
      <Link href="/" className="btn-primary text-lg mt-8">
        Back to Home
      </Link>
    </div>
  );
}
