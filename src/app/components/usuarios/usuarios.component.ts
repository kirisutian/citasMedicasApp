import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuarioResponse } from '../../models/Usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  textoModal: string = 'Registrar Usuario';
  usuarios: UsuarioResponse[] = [];
  usuarioForm: FormGroup;

  @ViewChild('usuarioModalRef')
  usuarioModalEl!: ElementRef;

  private modalInstance!: any;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roles: [[], ]
    });
  }

  ngOnInit(): void {
    this.llenarLista();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.usuarioModalEl.nativeElement, { keyboard: false} );
    this.usuarioModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {

    });
  }

  llenarLista(): void {
    this.usuarios = [
      { username: 'admin', roles: ['ROLE_ADMIN'] },
      { username: 'usuario', roles: ['ROLE_USER'] }
    ];
  }

  toggleForm(): void {
    this.textoModal = 'Registrar Usuario';
    this.modalInstance.show();
  }

  onSubmit(): void {

  }

  deleteUsuario(username: string): void {
    this.usuarios = this.usuarios.filter(u => u.username !== username);
  }

}
