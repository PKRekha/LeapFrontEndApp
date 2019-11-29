import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { BooksService } from '../books.service';
import { Book } from '../book.model';


@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  book: Book;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private bookId: string;

  constructor(
    public booksService: BooksService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required]
      }),
      authors: new FormControl(null, {validators:[Validators.required]})
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('bookId')) {
        this.mode = 'edit';
        this.bookId = paramMap.get('bookId');
        this.booksService.getBook(this.bookId).subscribe(bookData => {
          this.book = {
            id: bookData._id,
            title: bookData.title,
            description: bookData.description,
            imagePath: bookData.imagePath,
            authors: bookData.authors
          };
          this.form.setValue({
            title: this.book.title,
            description: this.book.description,
            image: this.book.imagePath,
            authors: this.book.authors
          });
        });
      } else {
        this.mode = 'create';
        this.bookId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveBook() {
    if (this.form.invalid) {
      return;
    }
     if (this.mode === 'create') {
      this.booksService.addBook(
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.authors
      );
    } else {
      this.booksService.updateBook(
        this.bookId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.authors
      );
    }
    this.form.reset();
  }
}
