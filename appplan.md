# App Development Plan: Codex Sinaiticus App

This document outlines the plan for developing the Codex Sinaiticus app, with a particular focus on strategies for handling large textual documents and data.

## 1. Project Setup & Core Data Handling

### 1.1 Monorepo Initialization
- Initialize a monorepo using a tool like Lerna or Nx to manage both the Next.js web application and the React Native (with Expo) mobile application.
- Establish a clear directory structure for shared components, utilities, and data processing scripts.

### 1.2 Data Ingestion Pipeline
- **Objective:** Process raw text data from Codex Sinaiticus into the specified JSON format.
- **Strategy for Large Documents:**
    - **Local Files:** For translation files provided locally (e.g., `CODEX SINAITICUS The New.txt`), use `read_file` and `read_many_files` to ingest content. Implement streaming or chunk-based reading if files exceed typical memory limits.
    - **Text Extraction & Cleaning:** Develop scripts to extract only the relevant textual content, remove headers, footers, and other non-content elements. Standardize text encoding (e.g., UTF-8).
    - **Metadata Extraction:** Extract book, chapter, verse information, and any other relevant metadata from the raw texts.

### 1.3 Data Model Implementation
- Implement the JSON schema described in the `Codex Sinaiticus App — Billion‑dollar Spec & Json Package.pdf` for Sinaiticus fragments.

### 1.4 Build-Time Data Processing
- **JSON Compression:** Implement a build step to compress the generated JSON files (e.g., using Gzip or Brotli) to reduce the app's footprint, especially for mobile.
- **Search Index Generation:**
    - Utilize Fuse.js for client-side search indexing.
    - Develop a build script to generate the search indices from the processed JSON data. This process must be optimized to handle the entire corpus efficiently.

## 2. Basic UI & Navigation (MVP) - Sinaiticus Reader with Search

### 2.1 Core Reading View
- Implement a clean reading interface with large, readable type for the Sinaiticus text.
- Display Sinaiticus text fragments, clearly marking missing text with `[missing]` or `[...]` and showing provenance metadata (folio, sigla) on hover/tap.

### 2.2 Search Functionality
- Implement a quick search bar that searches across Sinaiticus fragments.
- Display search snippets with highlighting and allow users to click on results to navigate to the specific verse.

### 2.3 Navigation
- Implement intuitive navigation by Book, Chapter, and Verse.
- Allow swipe gestures for chapter navigation.

## 3. Future Enhancements (Phase 2)

### 3.1 KJV Comparison Feature
- Develop a toggle to switch between "Sinaiticus-only" and "Sinaiticus + KJV Comparison" views.
- When "KJV Comparison" is enabled, display the King James Version for corresponding verses, faded or in a different color to distinguish it from the original Sinaiticus text. This will include side-by-side comparison.

### 3.2 Advanced Search (Lunr.js)
- Integrate Lunr.js for more advanced full-text indexing and search capabilities.

### 3.3 User Features
- Implement bookmarking functionality.
- Allow users to highlight text.
- Enable copying and sharing of text snippets.

### 3.4 Accessibility
- Implement screen reader semantics.
- Provide adjustable font sizes and high-contrast themes.

## 4. Polish & Deployment

### 4.1 UI/UX Refinement
- Adhere to the UX/UI patterns described in the specification, including margin notes and fragment indicators.

### 4.2 Legal & Attribution
- Create `LICENSES.md` to list all used translations, source URLs, editions, and proof of public domain status.
- Develop an "ABOUT" screen explaining project goals, "no doctrinal claims," and providing contact information.
- Include necessary copyright and attribution notices for Codex Sinaiticus.org images/data and public-domain translations.

### 4.3 CI/CD Setup
- **Web:** Configure GitHub Actions for continuous integration and deployment to Vercel or a static host.
- **Mobile:** Set up Expo Application Services (EAS) for building and deploying Android apps to the Play Store and for internal testing via Google Play Console.

## Strategy for Handling Large Documents (Detailed)

### Data Ingestion and Processing:
- **Iterative Reading:** When dealing with very large local files, use the `offset` and `limit` parameters of `read_file` to read content in manageable chunks (e.g., 1000 lines at a time). This prevents memory overload.
- **Targeted Scraping:** For external web content, use `firecrawl_scrape` with `onlyMainContent: true` and `formats: ["markdown"]` to focus on relevant text and reduce the amount of data fetched. For multiple pages, use `firecrawl_crawl` with carefully chosen `maxDiscoveryDepth` and `limit` to avoid excessive data.
- **Structured Extraction:** If specific data points are needed from web pages, consider `firecrawl_extract` with a defined `schema` to get structured output directly.
- **Pre-processing Scripts:** Develop Python or Node.js scripts to automate the cleaning, parsing, and transformation of raw text into the final JSON data model. These scripts will run as part of the build process.

### Data Storage and Access:
- **Optimized JSON:** Ensure the generated JSON files are as lean as possible, containing only necessary data. Consider minification.
- **SQLite for Mobile:** For the React Native app, leverage SQLite (via `expo-sqlite` or `react-native-sqlite-storage`) for storing the processed text and search indices. This allows for efficient querying and offline access without loading the entire dataset into memory.
- **IndexedDB for Web:** For the Next.js web app, use IndexedDB (with a wrapper) for client-side storage of text and indices, providing similar benefits to SQLite for offline capabilities and performance.

### Search Indexing:
- **Build-Time Indexing:** The search indices (Fuse.js) will be generated during the application's build process. This ensures that the client-side applications receive pre-built, optimized indices, reducing client-side processing.
- **Incremental Indexing (Future Consideration):** For extremely large datasets or frequent updates, explore strategies for incremental index updates rather than full rebuilds, though this is a future optimization.

### Version Control and Data Management:
- **Git for Canonical Data:** The canonical source texts (raw and processed JSON) will be stored in a Git repository. This provides version control, history, and a single source of truth for the data.
- **CI/CD Integration:** The data processing and index generation scripts will be integrated into the CI/CD pipeline, ensuring that every deployment uses the latest processed data and indices.
