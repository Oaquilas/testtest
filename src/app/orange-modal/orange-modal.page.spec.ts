import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrangeModalPage } from './orange-modal.page';

describe('OrangeModalPage', () => {
  let component: OrangeModalPage;
  let fixture: ComponentFixture<OrangeModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrangeModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrangeModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
