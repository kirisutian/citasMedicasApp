import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UsuarioResponse } from '../../models/Usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DescripcionRoles, Roles } from '../../constants/Roles';
import Swal from 'sweetalert2';

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
  roles: string[] = Object.values(Roles);
  isEditMode: boolean = false;
  selectedUsuario: UsuarioResponse | null = null;

  @ViewChild('usuarioModalRef')
  usuarioModalEl!: ElementRef;

  private modalInstance!: any;

  constructor(private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)] ],
      password: ['', [Validators.required, Validators.minLength(8)] ],
      roles: [[], [Validators.required] ]
    });
  }

  ngOnInit(): void {
    this.llenarLista();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.usuarioModalEl.nativeElement, { keyboard: false} );
    this.usuarioModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  llenarLista(): void {
    this.usuarios = [
      { username: 'admin', roles: ['ROLE_ADMIN'] },
      { username: 'usuario', roles: ['ROLE_USER'] }
    ];
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Usuario';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedUsuario = null;
    this.usuarioForm.reset();
  }

  editarUsuario(usuario: UsuarioResponse): void {
    this.isEditMode = true;
    this.selectedUsuario = usuario;
    this.textoModal = 'Editando Usuario: ' + usuario.username;

    this.usuarioForm.patchValue({...usuario});
    this.modalInstance.show();
  }

  transformarRol(rol: string): string {
    return DescripcionRoles[rol as Roles] || 'Desconocido';
  }

  onSubmit(): void {
    //console.info('Valor del formulario: ', this.usuarioForm.value);
    if(this.usuarioForm.invalid) return;

    const usuarioData: UsuarioResponse = this.usuarioForm.value;

    this.usuarios.push(usuarioData);
    Swal.fire('Registrado', 'Usuario registrado correctamente', 'success');
    this.modalInstance.hide();
  }

  deleteUsuario(username: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El usuario ${username} será eliminado permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed) {
        this.usuarios = this.usuarios.filter(u => u.username !== username);
        Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success');
      }
    });
  }

}
