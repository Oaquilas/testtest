import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgentmodalPage } from './agentmodal.page';

describe('AgentmodalPage', () => {
  let component: AgentmodalPage;
  let fixture: ComponentFixture<AgentmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentmodalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgentmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
