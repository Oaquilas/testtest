import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChoixEquipementsPage } from './choix-equipements.page';

describe('ChoixEquipementsPage', () => {
  let component: ChoixEquipementsPage;
  let fixture: ComponentFixture<ChoixEquipementsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoixEquipementsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChoixEquipementsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
