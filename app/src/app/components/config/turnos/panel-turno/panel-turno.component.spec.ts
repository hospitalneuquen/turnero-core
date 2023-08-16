import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelTurnoComponent } from './panel-turno.component';

describe('PanelTurnoComponent', () => {
  let component: PanelTurnoComponent;
  let fixture: ComponentFixture<PanelTurnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelTurnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
