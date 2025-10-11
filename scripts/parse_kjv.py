
import re
import json
import os

# Define book order, short ID, and section
KJV_BOOKS = [
    ("Gospel According to Saint Matthew", "mat", "New Testament"),
    ("Gospel According To Saint Mark", "mar", "New Testament"),
    ("Gospel According To Saint Luke", "luk", "New Testament"),
    ("Gospel According To Saint John", "joh", "New Testament"),
    ("Acts of the Apostles", "act", "New Testament"),
    ("Epistle of Paul the Apostle to the Romans", "rom", "New Testament"),
    ("First Epistle of Paul the Apostle to the Corinthians", "1co", "New Testament"),
    ("Second Epistle of Paul the Apostle to the Corinthians", "2co", "New Testament"),
    ("Epistle of Paul the Apostle to the Galatians", "gal", "New Testament"),
    ("Epistle of Paul the Apostle to the Ephesians", "eph", "New Testament"),
    ("Epistle of Paul the Apostle to the Philippians", "phi", "New Testament"),
    ("Epistle of Paul the Apostle to the Colossians", "col", "New Testament"),
    ("First Epistle of Paul the Apostle to the Thessalonians", "1th", "New Testament"),
    ("Second Epistle of Paul the Apostle to the Thessalonians", "2th", "New Testament"),
    ("First Epistle of Paul the Apostle to Timothy", "1ti", "New Testament"),
    ("Second Epistle of Paul the Apostle to Timothy", "2ti", "New Testament"),
    ("Epistle of Paul the Apostle to Titus", "tit", "New Testament"),
    ("Epistle of Paul the Apostle to Philemon", "phm", "New Testament"),
    ("Epistle of Paul the Apostle to the Hebrews", "heb", "New Testament"),
    ("General Epistle of James", "jam", "New Testament"),
    ("First Epistle General of Peter", "1pe", "New Testament"),
    ("Second General Epistle of Peter", "2pe", "New Testament"),
    ("First Epistle General of John", "1jo", "New Testament"),
    ("Second Epistle General of John", "2jo", "New Testament"),
    ("Third Epistle General of John", "3jo", "New Testament"),
    ("General Epistle of Jude", "jud", "New Testament"),
    ("Revelation of Saint John the Divine", "rev", "New Testament"),
]

KJV_BOOK_MAP = {book_name: (book_id, book_section) for book_name, book_id, book_section in KJV_BOOKS}

def parse_kjv_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove Project Gutenberg header and footer
    start_marker = "*** START OF THE PROJECT GUTENBERG EBOOK THE KING JAMES VERSION OF THE BIBLE ***"
    end_marker = "*** END OF THE PROJECT GUTENBERG EBOOK THE KING JAMES VERSION OF THE BIBLE ***"

    start_index = content.find(start_marker)
    end_index = content.find(end_marker)

    if start_index != -1 and end_index != -1:
        content = content[start_index + len(start_marker):end_index].strip()
    elif start_index != -1: # If only start marker is found, take everything after it
        content = content[start_index + len(start_marker):].strip()
    elif end_index != -1: # If only end marker is found, take everything before it
        content = content[:end_index].strip()

    # Find the true start of scripture by looking for the second occurrence of "The Old Testament..."
    # This is because the first occurrence is part of the book list, and the actual text starts after the second.
    ot_marker = "The Old Testament of the King James Version of the Bible"
    first_ot_index = content.find(ot_marker)
    if first_ot_index != -1:
        second_ot_index = content.find(ot_marker, first_ot_index + len(ot_marker))
        if second_ot_index != -1:
            content = content[second_ot_index:].strip()
        else:
            print(f"Warning: Could not find the second occurrence of '{ot_marker}'. Parsing might be incomplete.")
    else:
        print(f"Warning: Could not find '{ot_marker}'. Parsing might be incomplete.")

    # Normalize line endings and remove extra newlines
    content = content.replace('\r\n', '\n').replace('\r', '\n')
    lines = [line.strip() for line in content.split('\n') if line.strip()]

    parsed_books = []
    current_book = None
    current_chapter = None
    current_verses = []
    book_order_counter = 0 # Use a counter for order, not index

    # Regex to match "Chapter:Verse" pattern at the beginning of a line
    verse_pattern = re.compile(r'(\d+):(\d+)\s*(.*)')
    
    # Regex to match book titles. Need to be careful with "First Book of Samuel" vs "The First Book of Moses: Called Genesis"
    # The book list has "First Book of Samuel" and "The First Book of Moses: Called Genesis"
    # I will use the full name from KJV_BOOKS to match.
    book_title_patterns = [
        (re.compile(r'\b' + re.escape(book_name) + r'\b', re.IGNORECASE), book_name)
        for book_name, _, _ in KJV_BOOKS # Only need book_name for matching
    ]

    for line in lines:
        # Check for book title
        book_matched = False
        for pattern, book_full_name in book_title_patterns:
            if pattern.search(line):
                if book_full_name not in KJV_BOOK_MAP: # Only process if it's a filtered book
                    continue

                if current_book:
                    # Save previous book
                    if current_chapter:
                        current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
                    parsed_books.append(current_book)

                book_id, book_section = KJV_BOOK_MAP[book_full_name]
                book_order_counter += 1

                current_book = {
                    "id": book_id,
                    "name": book_full_name,
                    "order": book_order_counter,
                    "section": book_section,
                    "folios": [], # Not applicable for KJV
                    "chapters": []
                }
                current_chapter = None
                current_verses = []
                book_matched = True
                break
        
        if book_matched:
            continue

        # Check for verse pattern
        verse_matches = list(re.finditer(verse_pattern, line))
        if verse_matches and current_book:
            for match in verse_matches:
                chapter_num = int(match.group(1))
                verse_num = int(match.group(2))
                verse_text = match.group(3).strip()
                # Add the last book
    if current_book:
        if current_chapter:
            current_book["chapters"].append({"chapter": current_chapter, "verses": current_verses})
        parsed_books.append(current_book)

    return parsed_books

if __name__ == "__main__":
    kjv_file_path = "/home/kobese/Projects - Personal/Codex_Sinaticus_Reader/The King James Version of the Bible.txt"
    output_dir = "/home/kobese/Projects - Personal/Codex_Sinaticus_Reader/data/kjv"

    os.makedirs(output_dir, exist_ok=True)

    parsed_data = parse_kjv_text(kjv_file_path)

    for book_data in parsed_data:
        output_file = os.path.join(output_dir, f"{book_data['id']}.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(book_data, f, ensure_ascii=False, indent=2)
        print(f"Saved {book_data['name']} to {output_file}")
