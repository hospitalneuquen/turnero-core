import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentanillaComponent } from './ventanilla.component';

describe('VentanillaComponent', () => {
  let component: VentanillaComponent;
  let fixture: ComponentFixture<VentanillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentanillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
