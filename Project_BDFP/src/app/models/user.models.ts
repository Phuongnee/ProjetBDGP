import { ListBook } from "./listBook.model";
import { ListFilm } from "./listFilm.models";

export class User {
    _id!: string;
    email!: string;
    mdp!: string;
    listFilm!: ListFilm;
    listBook!: ListBook;
}