import re
import json
import os

# Define book order, short ID, and section for Codex Sinaiticus (New Testament + additional texts)
SINAITICUS_BOOKS = [
    ("According to Matthew", "mat", "New Testament"),
    ("According to Mark", "mar", "New Testament"),
    ("According to Luke", "luk", "New Testament"),
    ("According to John", "joh", "New Testament"),
    ("Acts of the Apostles", "act", "New Testament"),
    ("Acts 29, Sonnini Manuscript", "act29", "Early Christian Writings"),
    ("Paul to the Romans", "rom", "New Testament"),
    ("Paul to the Corinthians 1", "1co", "New Testament"),
    ("Paul to the Corinthians 2", "2co", "New Testament"),
    ("Paul to the Galatians", "gal", "New Testament"),
    ("Paul to the Ephesians", "eph", "New Testament"),
    ("Paul to the Philippians", "phi", "New Testament"),
    ("Paul to the Colossians", "col", "New Testament"),
    ("Paul to the Thessalonians 1", "1th", "New Testament"),
    ("Paul to the Thessalonians 2", "2th", "New Testament"),
    ("Paul to Timothy 1", "1ti", "New Testament"),
    ("Paul to Timothy 2", "2ti", "New Testament"),
    ("Paul to Titus", "tit", "New Testament"),
    ("Paul to Philemon", "phm", "New Testament"),
    ("Epistle of Hebrews", "heb", "New Testament"),
    ("Epistle of James", "jam", "New Testament"),
    ("Epistle of Peter 1", "1pe", "New Testament"),
    ("Epistle of Peter 2", "2pe", "New Testament"),
    ("Epistle of John 1", "1jo", "New Testament"),
    ("Epistle of John 2", "2jo", "New Testament"),
    ("Epistle of John 3", "3jo", "New Testament"),
    ("Epistle of Jude", "jud", "New Testament"),
    ("Revelation of Jesus Christ", "rev", "New Testament"),
    ("Epistle of Barnabas", "bar", "Early Christian Writings"),
    ("The Shepherd of Hermas", "her", "Early Christian Writings"),
    ("Didachē or Teaching of the Twelve", "did", "Early Christian Writings"),
]

def parse_sinaiticus_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pre-processing: Remove header/footer and normalize line endings
    # Find the start of the content after the initial prefaces/TOC
    start_marker = "CONTENTS"
    start_index = content.find(start_marker)
    if start_index != -1:
        content = content[start_index + len(start_marker):].strip()

    # Find the true start of scripture (e.g., "Matthew 1")
    matthew_start_marker = "Matthew 1"
    matthew_start_index = content.find(matthew_start_marker)
    if matthew_start_index != -1:
        content = content[matthew_start_index:].strip()
    else:
        print(f"Warning: Could not find '{matthew_start_marker}' in the Sinaiticus text. Parsing might be incomplete.")

    content = content.replace('\r\n', '\n').replace('\r', '\n')
    lines = [line.strip() for line in content.split('\n') if line.strip()]

    parsed_books = []
    current_book = None
    current_chapter = None
    current_verses = []
    book_order_index = 0

    # Regex to match "VerseNumber Text" pattern at the beginning of a line
    verse_pattern = re.compile(r'^(\d+)\s*(.*)')

    # Regex to match book titles (e.g., "Matthew 1") - this is now used to identify new books
    # and also to extract the book name from chapter lines.
    # This pattern is not directly used for matching, but for understanding the structure.
    # chapter_book_name_pattern = re.compile(r'^(\d*\\s*[a-zA-Z]+(?:\\s[a-zA-Z]+)*)')


    for line in lines:
        # Skip lines containing "Codex Sinaiticus", "The H. T. Anderson New Testament" or just page numbers
        if "Codex Sinaiticus" in line or "The H. T. Anderson New Testament" in line or re.match(r'^\d+$', line.strip()):
            continue

        # --- Book Title Detection (more robust) ---
        book_matched = False
        for idx, (book_name_from_list, book_id, book_section) in enumerate(SINAITICUS_BOOKS):
            # Check for exact match or common alternative names
            if (book_name_from_list.lower() == line.lower() or
                (book_id == "2jo" and line.lower() == "2 john") or
                (book_id == "3jo" and line.lower() == "3 john") or
                (book_id == "jud" and line.lower() == "jude")):
                
                if not current_book or current_book['id'] != book_id:
                    if current_book:
                        if current_chapter:
                            current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
                        parsed_books.append(current_book)

                    current_book = {
                        "id": book_id,
                        "name": book_name_from_list,
                        "order": idx + 1,
                        "section": book_section,
                        "folios": [],
                        "chapters": []
                    }
                    current_chapter = None # Reset chapter for new book
                    current_verses = []
                print(f"DEBUG: Matched book title: {line.strip()} -> ID: {book_id}, Name: {book_name_from_list}")
                book_matched = True
                break
        
        if book_matched:
            continue

        # --- Chapter Title Detection (for books with explicit chapter lines like Matthew 1) ---
        chapter_match = re.match(r'^(.*?)\s+(\d+)$', line) # More general chapter pattern
        if chapter_match:
            full_book_name_from_line = chapter_match.group(1).strip()
            chapter_num = int(chapter_match.group(2))

            matched_book_info = None
            for idx, (book_name_from_list, book_id, book_section) in enumerate(SINAITICUS_BOOKS):
                if book_name_from_list.lower() in full_book_name_from_line.lower() or \
                   full_book_name_from_line.lower() in book_name_from_list.lower():
                    matched_book_info = (book_name_from_list, book_id, book_section, idx)
                    break
            
            if matched_book_info:
                book_name_from_list, book_id, book_section, book_order_idx = matched_book_info

                if not current_book or current_book['id'] != book_id:
                    if current_book:
                        if current_chapter:
                            current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
                        parsed_books.append(current_book)

                    current_book = {
                        "id": book_id,
                        "name": book_name_from_list,
                        "order": book_order_idx + 1,
                        "section": book_section,
                        "folios": [],
                        "chapters": []
                    }
                    current_chapter = None
                    current_verses = []
                
                print(f"DEBUG: Matched chapter title: {line.strip()} for book {current_book['name']}")
                if current_chapter is None or chapter_num != current_chapter:
                    if current_chapter is not None:
                        current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
                    current_chapter = chapter_num
                    current_verses = []
                continue

        # --- Verse Detection ---
        verse_match = verse_pattern.match(line)
        if verse_match and current_book: # current_book must be set
            verse_num = int(verse_match.group(1))
            verse_text = verse_match.group(2).strip()

            # If current_chapter is None, assume it's chapter 1 for books like 2 John
            if current_chapter is None:
                current_chapter = 1
                print(f"DEBUG: Assuming Chapter 1 for book {current_book['name']} due to first verse.")
            
            # If a new chapter starts with verse 1 (e.g., after a book title without explicit chapter line)
            # This condition needs to be more robust to handle cases where a book has multiple chapters
            # and a new chapter starts with verse 1.
            if verse_num == 1 and current_verses and current_verses[-1]['verse'] != 1: # Check if previous verse was not 1
                # This means we've encountered a new chapter (starting with verse 1) within the same book.
                if current_chapter is not None:
                    current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
                current_chapter += 1 # Increment chapter for new chapter starting with verse 1
                current_verses = []
                print(f"DEBUG: New chapter {current_chapter} started with verse 1 for book {current_book['name']}.")


            print(f"DEBUG: Matched verse: {verse_num} - {verse_text} for book {current_book['name']}, chapter {current_chapter}")
            
            notes = None
            fragment = False

            if "[no verse]" in verse_text:
                fragment = True
                notes = "[no verse]"
                verse_text = verse_text.replace("[no verse]", "").strip()
            
            note_matches = re.findall(r'(\(.*?\)| \[.*?\])', verse_text)
            if note_matches:
                if notes:
                    notes += "; " + "; ".join(note_matches)
                else:
                    notes = "; " + "; ".join(note_matches)
                for nm in note_matches:
                    verse_text = verse_text.replace(nm, "").strip()

            current_verses.append({
                "verse": verse_num,
                "sinaiticus": {"text": verse_text},
                "text": verse_text,
                "fragment": fragment,
                "notes": notes,
                "fulltext_links": []
            })
            continue
        elif current_book and current_chapter and current_verses:
            # Append to the last verse if it's a continuation line AND no new verse pattern is found
            # Ensure it's not a book or chapter title, or a page number
            if not (re.match(r'^\d+$', line.strip())):
                if current_verses:
                    print(f"DEBUG: Appending continuation line to verse {current_verses[-1]['verse']} in book {current_book['name']}, chapter {current_chapter}")
                    current_verses[-1]["sinaiticus"]["text"] += " " + line.strip()
                    current_verses[-1]["text"] += " " + line.strip()

    # Add the last book
    if current_book:
        print(f"DEBUG: Final save for book: {current_book['name']} with {len(current_book['chapters'])} chapters.")
        if current_chapter:
            print(f"DEBUG: Final save for current chapter {current_chapter} with {len(current_verses)} verses to book {current_book['name']}")
            current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
        parsed_books.append(current_book)

    return parsed_books

if __name__ == "__main__":
    sinaiticus_file_path = "/home/kobese/Projects - Personal/Codex_Sinaticus_Reader/CODEX SINAITICUS The New.txt"
    output_dir = "/home/kobese/Projects - Personal/Codex_Sinaticus_Reader/data/sinaiticus"

    os.makedirs(output_dir, exist_ok=True)

    parsed_data = parse_sinaiticus_text(sinaiticus_file_path)

    for book_data in parsed_data:
        output_file = os.path.join(output_dir, f"{book_data['id']}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(book_data, f, ensure_ascii=False, indent=2)
        print(f"Saved {book_data['name']} to {output_file}")