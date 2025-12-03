import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: '',
    ministry: ''
  };

  ministries = [
    { id: 'general', name: 'Consulta General' },
    { id: 'youth', name: 'Ministerio de Jóvenes' },
    { id: 'kids', name: 'Ministerio de Niños' },
    { id: 'music', name: 'Ministerio de Música' },
    { id: 'prayer', name: 'Ministerio de Oración' },
    { id: 'volunteer', name: 'Voluntariado' },
    { id: 'events', name: 'Eventos Especiales' },
    { id: 'donations', name: 'Donaciones' }
  ];

  contactInfo = {
    address: 'Av. Principal 1234, Ciudad, País',
    phone: '+1 (555) 123-4567',
    email: 'contacto@iglesiaadonai.com',
    officeHours: 'Lunes a Viernes: 9:00 AM - 5:00 PM',
    emergency: '+1 (555) 987-6543'
  };

  socialLinks = [
    { icon: '🎯', name: 'Facebook', url: '#', color: 'from-blue-600 to-blue-800' },
    { icon: '📸', name: 'Instagram', url: '#', color: 'from-purple-600 to-pink-600' },
    { icon: '🎵', name: 'YouTube', url: '#', color: 'from-red-600 to-red-800' },
    { icon: '💬', name: 'WhatsApp', url: '#', color: 'from-green-600 to-green-800' }
  ];

  isSubmitting = false;
  submitted = false;

  ngOnInit() {
    // Inicialización si es necesaria
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    // Simulación de envío
    console.log('Formulario enviado:', this.formData);

    setTimeout(() => {
      this.submitted = true;
      this.isSubmitting = false;

      // Resetear formulario después de 5 segundos
      setTimeout(() => {
        this.resetForm();
      }, 5000);
    }, 1500);
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: '',
      ministry: ''
    };
    this.submitted = false;
  }

  // Método para manejar clic en redes sociales
  onSocialClick(platform: string) {
    console.log(`Navegando a ${platform}`);
    // Aquí puedes agregar lógica para abrir enlaces externos
  }
}