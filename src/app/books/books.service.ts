import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Book } from './book.model';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private books: Book[] = [];
  private booksUpdated = new Subject<Book[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getBooks() {
    this.http
      .get<{ message: string; books: any }>('http://localhost:3000/books')
      .pipe(
        map(bookData => {
          return bookData.books.map(book => {
            return {
              title: book.title,
              description: book.description,
              id: book._id,
              imagePath: book.imagePath,
              authors: book.authors
            };
          });
        })
      )
      .subscribe(transformedbooks => {
        this.books = transformedbooks;
        this.booksUpdated.next([...this.books]);
      });
  }

  getBookUpdateListener() {
    return this.booksUpdated.asObservable();
  }

  getBook(id: string) {
    return this.http.get<{ _id: string, title: string, description: string, imagePath: string, authors: any }>(
      'http://localhost:3000/books/' + id
    );
  }

  addBook(title: string, description: string, image: File, authors: any) {
    const bookData = new FormData();
    bookData.append('title', title);
    bookData.append('description', description);
    bookData.append('image', image, title);
    bookData.append('authors', authors);
    this.http
      .post<{ message: string; book: Book }>(
        'http://localhost:3000/books',
        bookData
      )
      .subscribe(responseData => {
        const book: Book = {
          id: responseData.book.id,
          title: title,
          description: description,
          imagePath: responseData.book.imagePath,
          authors: authors
        };
        this.books.push(book);
        this.booksUpdated.next([...this.books]);
        this.router.navigate(['/']);
      });
  }

  updateBook(id: string, title: string, description: string, image: File | string, authors: any) {
    let bookData: Book | FormData;
    if (typeof image === 'object') {
      bookData = new FormData();
      bookData.append('id', id);
      bookData.append('title', title);
      bookData.append('description', description);
      bookData.append('image', image, title);
      bookData.append('authors', authors);
    } else {
      bookData = {
        id: id,
        title: title,
        description: description,
        imagePath: image,
        authors: authors
      };
    }
    this.http
      .put('http://localhost:3000/books/' + id, bookData)
      .subscribe(response => {
        const updatedBooks = [...this.books];
        const oldBookIndex = updatedBooks.findIndex(b => b.id === id);
        const book: Book = {
          id: id,
          title: title,
          description: description,
          imagePath: '',
          authors: authors
        };
        updatedBooks[oldBookIndex] = book;
        this.books = updatedBooks;
        this.booksUpdated.next([...this.books]);
        this.router.navigate(['/']);
      });
  }

  deleteBook(bookId: string) {
    this.http
      .delete('http://localhost:3000/books/' + bookId)
      .subscribe(() => {
        const updatedBooks = this.books.filter(book => book.id !== bookId);
        this.books = updatedBooks;
        this.booksUpdated.next([...this.books]);
      });
  }
}
