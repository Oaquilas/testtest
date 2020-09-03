import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DoublonsContribuablePage } from './doublons-contribuable.page';

describe('DoublonsContribuablePage', () => {
  let component: DoublonsContribuablePage;
  let fixture: ComponentFixture<DoublonsContribuablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoublonsContribuablePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DoublonsContribuablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
