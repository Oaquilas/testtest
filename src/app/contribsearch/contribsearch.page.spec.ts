import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContribsearchPage } from './contribsearch.page';

describe('ContribsearchPage', () => {
  let component: ContribsearchPage;
  let fixture: ComponentFixture<ContribsearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribsearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContribsearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
