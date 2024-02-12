import { Component, OnInit, ViewChild } from '@angular/core';
import { Film } from 'app/models/film.model';
import { InitService } from 'services/init.service';
import { UtilsService } from 'services/utils.service';
import {FilmsService} from 'services/films.service';
import { DataService } from 'services/data.service';


@Component({
  selector: 'app-affichage-films',
  templateUrl: './affichage-films.component.html',
  styleUrls: ['./affichage-films.component.scss'],
})
export class AffichageFilmsComponent implements OnInit {
  films: Film[] = [];

  filmsWithAPI: any[] = [];

  movies: Map<any, any> = new Map();
  singleFilm: Map<any, string> = new Map();
  idActor: number = 0;
  moviesNumber: number = 0;
  noPoster: boolean = false;
  fromTMDB: boolean = true;
  searchText!: any;
  spinner : boolean = false
  noMovies!: any;



  constructor(
    private init: InitService,
    private filmService: FilmsService,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {
    this.initialisation();
    this.dataService.setSelectedCategory(this.selectedCategory);
  }

  async initialisation(){
    this.spinner = true
    this.movies = await this.init.initAffichageFilms()
    this.noMovies = this.movies.size == 0 ? true: false
    this.spinner = false
  }

  get spinnerStyle() { return {color: 'Orange'} }

  selectedCategory: string = 'film';
   //Menu deroulant 
  onCategoryChange() {
    this.dataService.setSelectedCategory(this.selectedCategory);
  }

  get filteredMovies() {
    if (!this.searchText) {
      return this.movies;
    }
    return new Map([...this.movies].filter(([key, movie]) => {
      const titleMatch = movie.title.toLowerCase().includes(this.searchText.toLowerCase());
      const releaseDateMatch = movie.release_date.includes(this.searchText);
      if (this.selectedCategory === 'film') {
        return titleMatch || releaseDateMatch;
     } else if (this.selectedCategory === 'livre') {
        // Add logic for filtering books if needed
        // Example: const authorMatch = movie.author.toLowerCase().includes(this.searchText.toLowerCase());
        // return titleMatch || releaseDateMatch || authorMatch;
        return false; // Placeholder, modify according to your data structure
     }
    }));
  }

}
