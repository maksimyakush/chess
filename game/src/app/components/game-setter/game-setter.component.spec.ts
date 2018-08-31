import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSetterComponent } from './game-setter.component';

describe('GameSetterComponent', () => {
  let component: GameSetterComponent;
  let fixture: ComponentFixture<GameSetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameSetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
