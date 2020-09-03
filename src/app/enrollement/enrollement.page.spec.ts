import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnrollementPage } from './enrollement.page';

describe('EnrollementPage', () => {
  let component: EnrollementPage;
  let fixture: ComponentFixture<EnrollementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
