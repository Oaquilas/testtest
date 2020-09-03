import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EticketingPage } from './eticketing.page';

describe('EticketingPage', () => {
  let component: EticketingPage;
  let fixture: ComponentFixture<EticketingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EticketingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EticketingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
