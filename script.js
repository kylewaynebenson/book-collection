const csvFileInput = document.getElementById('csvFile');
const loadButton = document.getElementById('loadButton');
const bookList = document.getElementById('bookList');

loadButton.addEventListener('click', () => {
    const file = csvFileInput.files[0];
    if (file) {
        parseCSV(file);
    }
});

function parseCSV(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvText = event.target.result;
        const books = parseCSVText(csvText);
        displayBooks(books);
        fetchBookCovers(books);
    };
    reader.readAsText(file);
}

function parseCSVText(csvText) {
    const parsedData = Papa.parse(csvText, { header: true });
    const books = [];

    for (const row of parsedData.data) {
        const title = row.Title?.trim() || '';
        const author = row.Author?.trim() || '';
        let isbn = row.ISBN?.trim() || '';

        if (isbn) {
            // Clean up ISBN by removing non-numeric characters and extra formatting
            isbn = isbn.replace(/[^0-9Xx]/g, '').replace(/^"=""|""$/g, '');
        }

        if (title && author && isbn) {
            books.push({ title, author, isbn });
        }
    }

    return books;
}




// Fetch book covers using the Open Library Covers API
function fetchBookCovers(books) {
    books.forEach(book => {
        const isbn = book.isbn;
        const bookCover = document.createElement('img');
        bookCover.src = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
        bookCover.alt = `${book.title} Cover`;
        book.cover.appendChild(bookCover);
    });
}

// Display books in the bookList
function displayBooks(books) {
    // Clear existing book list
    bookList.innerHTML = '';

    // Display the parsed book data
    books.forEach(book => {
        const li = document.createElement('li');
        li.classList.add('book');
        li.innerHTML = `
            <div class="book-cover"></div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
				<p class="book-isbn">${book.isbn}</p>
            </div>
        `;
        bookList.appendChild(li);
        book.cover = li.querySelector('.book-cover'); // Save a reference for adding the cover later
    });
}
