const lunr = require('lunr');
const Fuse = require('fuse.js');
const fs = require('fs');
const path = require('path');

const SINAITICUS_DATA_DIR = path.join(__dirname, '../data/sinaiticus');
const OUTPUT_DIR = path.join(__dirname, '../data/search_indices');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

function loadJsonFiles(directory) {
    const files = fs.readdirSync(directory);
    const allData = [];
    for (const file of files) {
        if (file.endsWith('.json')) {
            const filePath = path.join(directory, file);
            const content = fs.readFileSync(filePath, 'utf8');
            allData.push(JSON.parse(content));
        }
    }
    return allData;
}

function generateLunrIndex(data) {
    return lunr(function () {
        this.ref('id');
        this.field('name');
        this.field('text');
        this.field('chapter');
        this.field('verse');

        data.forEach(book => {
            book.chapters.forEach(chapter => {
                chapter.verses.forEach(verse => {
                    this.add({
                        id: `${book.id}-${chapter.chapter}-${verse.verse}`,
                        name: book.name,
                        text: verse.text,
                        chapter: chapter.chapter,
                        verse: verse.verse
                    });
                });
            });
        });
    });
}

// This function is now specific to Sinaiticus data structure
function generateFuseIndexForSinaiticus(data) {
    const options = {
        keys: [
            'name',
            'chapters.verses.text',
            'chapters.verses.notes',
        ],
        includeScore: true,
        threshold: 0.3, // Adjust as needed for fuzziness
    };

    const flattenedData = [];
    data.forEach(book => {
        book.chapters.forEach(chapter => {
            chapter.verses.forEach(verse => {
                flattenedData.push({
                    id: `${book.id}-${chapter.chapter}-${verse.verse}`,
                    name: book.name,
                    text: verse.text,
                    chapter: chapter.chapter,
                    verse: verse.verse,
                    notes: verse.notes,
                    book_id: book.id,
                    version: 'sinaiticus' // Explicitly add version for Fuse results
                });
            });
        });
    });

    const fuseInstance = new Fuse(flattenedData, options);
    return { fuseInstance, flattenedData, options }; // Return all three
}

async function main() {
    console.log('Loading Sinaiticus data...');
    const sinaiticusData = loadJsonFiles(SINAITICUS_DATA_DIR);
    console.log(`Loaded ${sinaiticusData.length} Sinaiticus books.`);

    console.log('Generating Lunr index for Sinaiticus...');
    const lunrSinaiticusIndex = generateLunrIndex(sinaiticusData);
    fs.writeFileSync(path.join(OUTPUT_DIR, 'lunr_sinaiticus_index.json'), JSON.stringify(lunrSinaiticusIndex));
    console.log('Lunr Sinaiticus index generated.');

    console.log('Generating Fuse index for Sinaiticus...');
    const { fuseInstance, flattenedData, options } = generateFuseIndexForSinaiticus(sinaiticusData); // Get flattenedData and options
    fs.writeFileSync(path.join(OUTPUT_DIR, 'fuse_sinaiticus_data.json'), JSON.stringify(flattenedData)); // Use flattenedData
    fs.writeFileSync(path.join(OUTPUT_DIR, 'fuse_sinaiticus_options.json'), JSON.stringify(options)); // Use options
    console.log('Fuse Sinaiticus data and options generated.');

    console.log('Search indices generation complete.');
}

main();
