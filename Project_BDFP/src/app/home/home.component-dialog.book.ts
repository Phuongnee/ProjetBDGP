import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Film } from 'app/models/film.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { ApiServiceService } from 'services/api-service.service';
import { FilmsService } from 'services/films.service';
import { UtilsService } from 'services/utils.service';
import { DataService } from 'services/data.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';

export interface DialogAjoutLivre {
  titreBook: string;
  dateRead: string;
  avisBook: string;
  noteBook: string;
}

@Component({
  selector: 'app-home-dialog-book',
  templateUrl: 'home.component-dialog.book.html',
  styleUrls: ['./home.component-dialog.book.scss'],
})
export class ajouterBook implements OnInit {
  titreBook!: string;
  bookError: boolean = false;
  boutonAjoutClicked: boolean = false;
  searchBooksCtrl = new FormControl();
  filteredBooksGGBook: any;
  filteredBooksOpenLib: any;
  isLoading = false;
  errorMsgBookExists = false;
  minLengthTerm = 1;
  selectedBook!: any;
  OPENLIBSelected: boolean = false;
  messError: boolean = false;
  searchControlNote = new FormControl('', Validators.pattern('^[0-5]$'));
  searchControlDate = new FormControl(
    '',
    Validators.pattern('^19[0-9]{2}|2[0-9]{3}$')
  );

  constructor(
    public dialogRef: MatDialogRef<ajouterBook>,
    private filmService: FilmsService,
    private api: ApiServiceService,
    private utilService: UtilsService,
    private router: Router,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogAjoutLivre
  ) {}

  async ngOnInit(): Promise<void> {
    this.GGBookInit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.clickButtonChooseAPIINIT();
    }
  }

  changeBoolTrue() {
    this.OPENLIBSelected = true;
    this.OPENLIBInit();
  }

  changeBoolFalse() {
    this.OPENLIBSelected = false;
    this.GGBookInit();
  }

  clickButtonChooseAPIINIT() {
    if (this.OPENLIBSelected) {
      this.ajoutFilmFromOMDB();
    } else {
      this.ajoutBookFromGGBook();
    }
  }

  removeError() {
    this.errorMsgBookExists = false;
    this.bookError = false;
  }

  //OMDB
  OPENLIBInit() {
    this.OPENLIBSelected = true;
  }

  //TMDB
  GGBookInit() {
    this.OPENLIBSelected = false;
    this.selectedBook = '';
    this.filteredBooksGGBook = null;
    this.searchBooksCtrl.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.filteredBooksGGBook = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.api.getBooksGGBookTitleSearch(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        if (data['items'] == undefined) {
          this.messError = true;
          this.filteredBooksGGBook = [];
        } else {
          this.messError = false;
          this.filteredBooksGGBook = data['items'];
        }
      });
    this.messError = false;
  }

  onSelected() {
    this.selectedBook = this.selectedBook;
    this.titreBook = this.selectedBook.volumeInfo.title;
    if (this.titreBook) {
      this.data.titreBook = this.titreBook;
    }
  }

  displayWith(value: any) {
    return value ? value.volumeInfo.title : '';
  }

  clearSelection() {
    this.selectedBook = '';
    this.filteredBooksOpenLib = [];
    this.filteredBooksGGBook = [];
    this.messError = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this.snack.open(message, '', {
      duration: 3000,
    });
  }

  async ajoutFilmFromOMDB() {
    this.boutonAjoutClicked = true;
    setTimeout(() => {
      this.boutonAjoutClicked = false;
    }, 3000);
    this.bookError = false;
    let isbnID = this.selectedBook.volumeInfo.industryIdentifiers[0].identifier;
    if (
      isbnID &&
      this.selectedBook.Title &&
      !(await this.checkIfBookExistsInList(isbnID))
    ) {
      this.filmService
        .addBookToList(
          this.selectedBook.Title,
          isbnID,
          '',
          this.utilService.getUserId(),
          this.data.dateRead,
          this.data.avisBook
        )
        .subscribe((book) => {
          this.openSnackBar(
            this.selectedBook.Title + ' à été ajouté à votre liste'
          );
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => {
              this.router.navigateByUrl('/home');
              this.dialogRef.close();
            });
        });
    } else if (await this.checkIfBookExistsInList(isbnID)) {
      this.errorMsgBookExists = true;
    } else {
      this.bookError = true;
    }
  }

  async ajoutBookFromGGBook() {
    this.boutonAjoutClicked = true;
    setTimeout(() => {
      this.boutonAjoutClicked = false;
    }, 3000);
    this.bookError = false;
    let id = this.selectedBook.id;
    console.log(id);
    this.api.getBookGGBookID(id).subscribe(async (movieTMDB: any) => {
      let imdb_id = movieTMDB.id;
      if (
        imdb_id &&
        this.selectedBook.volumeInfo.title &&
        !(await this.checkIfBookExistsInList(imdb_id))
      ) {
        let title = this.selectedBook.volumeInfo.title;
        console.log(title);

        this.filmService
          .addBookToList(
            this.titreBook,
            id,
            this.utilService.getUserId(),
            this.data.dateRead,
            this.data.avisBook,
            this.data.noteBook
          )
          .subscribe((film) => {
            this.openSnackBar(
              this.selectedBook.title + ' à été ajouté à votre liste'
            );
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigateByUrl('/home');
                this.dialogRef.close();
              });
          });
      } else if (await this.checkIfBookExistsInList(imdb_id)) {
        this.errorMsgBookExists = true;
      } else {
        this.bookError = true;
      }
    });
  }

  async checkIfBookExistsInList(bookID: any) {
    let bool = await this.filmService.isBookInDatabase(
      this.utilService.getUserId(),
      bookID
    );
    return bool;
  }

  async getMovieTranslations(movieId: string) {
    try {
      let translations = await this.api.getMovieTranslations(movieId);
      const titleFrench =
        translations['translations'].find(
          (translation: { [x: string]: string }) =>
            translation['iso_3166_1'] === 'FR' &&
            translation['iso_639_1'] === 'fr'
        )?.data?.title || '';
      return titleFrench;
    } catch (error) {
      console.error(error);
    }
  }
}
