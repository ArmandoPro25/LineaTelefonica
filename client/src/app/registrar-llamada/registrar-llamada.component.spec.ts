import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarLlamadaComponent } from './registrar-llamada.component';

describe('RegistrarLlamadaComponent', () => {
  let component: RegistrarLlamadaComponent;
  let fixture: ComponentFixture<RegistrarLlamadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarLlamadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarLlamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
