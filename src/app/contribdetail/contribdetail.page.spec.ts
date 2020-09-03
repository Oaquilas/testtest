import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContribdetailPage } from './contribdetail.page';

describe('ContribdetailPage', () => {
  let component: ContribdetailPage;
  let fixture: ComponentFixture<ContribdetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContribdetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContribdetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
