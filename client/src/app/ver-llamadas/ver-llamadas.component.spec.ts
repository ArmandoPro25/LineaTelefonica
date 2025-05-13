import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerLlamadasComponent } from './ver-llamadas.component';

describe('VerLlamadasComponent', () => {
  let component: VerLlamadasComponent;
  let fixture: ComponentFixture<VerLlamadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerLlamadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerLlamadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
