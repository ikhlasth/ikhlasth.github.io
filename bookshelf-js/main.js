// ==========================
// Helper functions
// ==========================
function generateId() {
  return +new Date();
}

function saveToStorage(books) {
  localStorage.setItem('bookshelf', JSON.stringify(books));
}

function loadFromStorage() {
  const data = localStorage.getItem('bookshelf');
  return data ? JSON.parse(data) : [];
}

// ==========================
// Elements
// ==========================
const incompleteList = document.getElementById('incompleteBookList');
const completeList = document.getElementById('completeBookList');
const fab = document.getElementById('fab');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');
const bookForm = document.getElementById('bookForm');

const searchInput = document.querySelector('[data-testid="searchBookFormTitleInput"]');
const searchForm = document.getElementById('searchBook');

// ==========================
// State
// ==========================
let books = loadFromStorage();
let editingBook = null;

// ==========================
// Render books
// ==========================
function createBookElement(book) {
  const bookEl = document.createElement('div');
  bookEl.setAttribute('data-bookid', book.id);
  bookEl.setAttribute('data-testid', 'bookItem');

  bookEl.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">
        ${book.isComplete 
          ? '<i class="fas fa-undo undo-icon"></i>Belum selesai dibaca' 
          : '<i class="fas fa-check check-icon"></i>Selesai dibaca'}
      </button>
      <button data-testid="bookItemEditButton">
        <i class="fas fa-edit edit-icon"></i> Edit
      </button>
      <button data-testid="bookItemDeleteButton">
        <i class="fas fa-trash delete-icon"></i>Hapus
      </button>
    </div>
  `;

// Tombol
  bookEl.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
    book.isComplete = !book.isComplete;
    saveToStorage(books);
    renderBooks(books);
  });

  bookEl.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => {
    openModal(book);
  });

  bookEl.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => {
    if (confirm(`Hapus buku "${book.title}"?`)) {
      books = books.filter(b => b.id !== book.id);
      saveToStorage(books);
      renderBooks(books);
    }
  });

  return bookEl;
}

// ==========================
// Render buku
// ==========================
function renderBooks(list) {
  incompleteList.innerHTML = '';
  completeList.innerHTML = '';

  const incompleteBooks = list.filter(b => !b.isComplete);
  const completeBooks = list.filter(b => b.isComplete);

  // Incomplete
  if (incompleteBooks.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Rak buku ini masih kosong';
    p.style.color = 'rgba(52,73,94,0.6)';
    p.style.textAlign = 'center';
    p.style.padding = '2.2rem 0';
    incompleteList.appendChild(p);
  } else {
    incompleteBooks.forEach(book => {
      incompleteList.appendChild(createBookElement(book));
    });
  }

  // Complete
  if (completeBooks.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Rak buku ini masih kosong';
    p.style.color = 'rgba(52,73,94,0.6)';
    p.style.textAlign = 'center';
    p.style.padding = '2.2rem 0';
    completeList.appendChild(p);
  } else {
    completeBooks.forEach(book => {
      completeList.appendChild(createBookElement(book));
    });
  }
}

// ==========================
// Modal
// ==========================
function openModal(book = null) {
  modal.classList.remove('hidden');
  editingBook = book;

  // Set values
  document.getElementById('bookFormTitle').value = book ? book.title : '';
  document.getElementById('bookFormAuthor').value = book ? book.author : '';
  document.getElementById('bookFormYear').value = book ? book.year : '';
  document.getElementById('bookFormIsComplete').checked = book ? book.isComplete : false;
}

function closeModal() {
  modal.classList.add('hidden');
  editingBook = null;
}

// Event listeners modal
fab.addEventListener('click', () => openModal());
closeModalBtn.addEventListener('click', closeModal);

// ==========================
// Form submit
// ==========================
bookForm.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('bookFormTitle').value.trim();
  const author = document.getElementById('bookFormAuthor').value.trim();
  const year = parseInt(document.getElementById('bookFormYear').value);
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  if (!title || !author || !year) return;

  if (editingBook) {
    editingBook.title = title;
    editingBook.author = author;
    editingBook.year = year;
    editingBook.isComplete = isComplete;
  } else {
    books.push({
      id: generateId(),
      title,
      author,
      year,
      isComplete
    });
  }

  saveToStorage(books);
  renderBooks(books);
  closeModal();
});

// ==========================
// Search realtime
// ==========================
searchInput.addEventListener('input', () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = books.filter(b => b.title.toLowerCase().includes(keyword));
  renderBooks(filtered);
});

// prevent form submit reload
searchForm.addEventListener('submit', e => e.preventDefault());

// ==========================
// Initial render
// ==========================
renderBooks(books);
