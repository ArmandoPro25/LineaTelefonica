import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarTelefonoComponent } from './registrar-telefono.component';

describe('RegistrarTelefonoComponent', () => {
  let component: RegistrarTelefonoComponent;
  let fixture: ComponentFixture<RegistrarTelefonoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarTelefonoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarTelefonoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
