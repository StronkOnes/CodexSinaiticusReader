import { getBookData } from '@/lib/data';
import BookReader from '@/app/components/BookReader';

interface BookPageProps {
  params: Promise<{ bookId: string; }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const awaitedParams = await params;
  const { bookId } = awaitedParams;
  const book = await getBookData('sinaiticus', bookId);

  if (!book) {
    return <div className="p-4">Book not found or data is missing.</div>;
  }

  return (
    <BookReader book={book} version="sinaiticus" />
  );
}
