import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolloComponent } from './rollo.component';

describe('RolloComponent', () => {
  let component: RolloComponent;
  let fixture: ComponentFixture<RolloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
