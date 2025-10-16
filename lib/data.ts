'use server';

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
console.log('Resolved DATA_DIR:', DATA_DIR);

export async function getBookData(version: 'sinaiticus', bookId: string) {
  const filePath = path.join(DATA_DIR, version, `${bookId}.json`);
  console.log(`Attempting to read file: ${filePath}`);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading book data for ${version}/${bookId} at ${filePath}:`, error);
    return null;
  }
}

export async function getAllBookIds(version: 'sinaiticus') {
  const dirPath = path.join(DATA_DIR, version);
  console.log(`Attempting to read directory: ${dirPath}`);
  try {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => file.endsWith('.json')).map(file => file.replace('.json', ''));
  } catch (error) {
    console.error(`Error reading book IDs for ${version} at ${dirPath}:`, error);
    return [];
  }
}

export async function getVerse(version: 'sinaiticus', bookId: string, chapter: number, verse: number) {
  const bookData = await getBookData(version, bookId);
  if (!bookData) return null;
  const chapterData = bookData.chapters.find((c: any) => c.chapter === chapter);
  if (!chapterData) return null;
  const verseData = chapterData.verses.find((v: any) => v.verse === verse);
  return verseData || null;
}

export async function getChapter(version: 'sinaiticus', bookId: string, chapter: number) {
  const bookData = await getBookData(version, bookId);
  if (!bookData) return null;
  return bookData.chapters.find((c: any) => c.chapter === chapter) || null;
}

export async function getBook(version: 'sinaiticus', bookId: string) {
  return await getBookData(version, bookId);
}

export async function getSearchResults(query: string) {
  // This is a placeholder. In a real application, you would implement a more
  // robust search mechanism, possibly using a dedicated search engine like
  // Elasticsearch or a library like Fuse.js for client-side search.
  console.log(`Search query: ${query}`);
  return [];
}
