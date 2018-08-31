import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineGamefieldComponent } from './engine-gamefield.component';

describe('EngineGamefieldComponent', () => {
  let component: EngineGamefieldComponent;
  let fixture: ComponentFixture<EngineGamefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EngineGamefieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EngineGamefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
