import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AffichageBooksComponent } from './affichage-books.component';

describe('AffichageBooksComponent', () => {
  let component: AffichageBooksComponent;
  let fixture: ComponentFixture<AffichageBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffichageBooksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffichageBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});