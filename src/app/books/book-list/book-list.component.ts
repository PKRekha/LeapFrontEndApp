import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../book.model';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  private booksSub: Subscription;

  constructor(public BooksService: BooksService) {}

  ngOnInit() {
    this.BooksService.getBooks();
    this.booksSub = this.BooksService.getBookUpdateListener()
      .subscribe((books: Book[]) => {
        this.books = books;
      });
  }

  onDelete(bookId: string) {
    this.BooksService.deleteBook(bookId);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }
}
