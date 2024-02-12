import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-affichage-books',
    templateUrl: './affichage-books.component.html',
    styleUrls: ['./affichage-books.component.scss']
})
export class AffichageBooksComponent implements OnInit {
    noBooks: boolean = true; // Change this based on whether there are books to display
    selectedCategory: string = 'book';
    searchText: string = '';

    constructor() { }

    ngOnInit(): void {
        // Add any initialization logic here
    }

    onCategoryChange(): void {
        // Handle category change here
    }
}