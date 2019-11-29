import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookListComponent } from './books/book-list/book-list.component';
import { BookCreateComponent } from './books/book-create/book-create.component';

const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'create', component: BookCreateComponent },
  { path: 'edit/:bookId', component: BookCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
