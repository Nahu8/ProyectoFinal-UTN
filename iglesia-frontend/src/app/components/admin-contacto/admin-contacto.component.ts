import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Interfaces extendidas
interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  socialMedia?: SocialMedia;
  schedules?: Schedules;
  departments?: Departments;
  mapEmbed?: string;
  additionalInfo?: string;
}

interface SocialMedia {
  facebook: string;
  instagram: string;
  youtube: string;
  whatsapp: string;
  tiktok: string;
  twitter: string;
}

interface Schedules {
  sunday: string;
  wednesday: string;
  friday: string;
  officeHours: string;
  emergencyHours: string;
}

interface Departments {
  youth: string;
  kids: string;
  music: string;
  prayer: string;
  volunteer: string;
}

interface SocialPlatform {
  id: keyof SocialMedia;
  name: string;
  icon: string;
  color: string;
  placeholder: string;
  baseUrl?: string;
}

interface ScheduleItem {
  id: keyof Schedules;
  title: string;
  icon: string;
  description: string;
  color: string;
}

interface DepartmentItem {
  id: keyof Departments;
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-contacto.component.html',
  styleUrls: ['./admin-contacto.component.css']
})
export class AdminContactoComponent implements OnInit {
  // Formularios
  basicInfoForm: FormGroup;
  socialMediaForm: FormGroup;
  schedulesForm: FormGroup;
  departmentsForm: FormGroup;

  // Estado
  activeTab: string = 'basic';
  isEditing: boolean = false;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  // Datos
  contactInfo: ContactInfo = this.getDefaultContact();

  // Opciones - usando tipos específicos
  socialPlatforms: SocialPlatform[] = [
    { id: 'facebook', name: 'Facebook', icon: '📘', color: 'from-blue-600 to-blue-800', placeholder: 'https://facebook.com/iglesia', baseUrl: 'https://facebook.com/' },
    { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-purple-600 to-pink-600', placeholder: 'https://instagram.com/iglesia', baseUrl: 'https://instagram.com/' },
    { id: 'youtube', name: 'YouTube', icon: '🎬', color: 'from-red-600 to-red-800', placeholder: 'https://youtube.com/iglesia', baseUrl: 'https://youtube.com/' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: 'from-green-600 to-green-800', placeholder: '+1234567890', baseUrl: 'https://wa.me/' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-gray-800 to-gray-900', placeholder: 'https://tiktok.com/@iglesia', baseUrl: 'https://tiktok.com/@' },
    { id: 'twitter', name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-600', placeholder: 'https://twitter.com/iglesia', baseUrl: 'https://twitter.com/' }
  ];

  scheduleItems: ScheduleItem[] = [
    { id: 'sunday', title: 'Servicio Dominical', icon: '🙏', description: 'Culto principal de adoración', color: 'from-blue-500 to-cyan-500' },
    { id: 'wednesday', title: 'Estudio Bíblico', icon: '📚', description: 'Estudio profundo de la Palabra', color: 'from-purple-500 to-pink-500' },
    { id: 'friday', title: 'Jóvenes', icon: '👥', description: 'Reunión especial para jóvenes', color: 'from-yellow-500 to-orange-500' },
    { id: 'officeHours', title: 'Horario de Oficina', icon: '🏢', description: 'Atención administrativa', color: 'from-green-500 to-emerald-500' },
    { id: 'emergencyHours', title: 'Horario de Emergencia', icon: '🚨', description: 'Para necesidades urgentes', color: 'from-red-500 to-rose-500' }
  ];

  departmentsList: DepartmentItem[] = [
    { id: 'youth', name: 'Ministerio de Jóvenes', icon: '👥', color: 'from-blue-400 to-blue-600' },
    { id: 'kids', name: 'Ministerio de Niños', icon: '👶', color: 'from-purple-400 to-pink-600' },
    { id: 'music', name: 'Ministerio de Música', icon: '🎵', color: 'from-yellow-400 to-orange-600' },
    { id: 'prayer', name: 'Ministerio de Oración', icon: '🙏', color: 'from-green-400 to-emerald-600' },
    { id: 'volunteer', name: 'Voluntariado', icon: '🤝', color: 'from-indigo-400 to-purple-600' }
  ];

  constructor(private fb: FormBuilder) {
    // Formulario de Información Básica
    this.basicInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      mapEmbed: ['']
    });

    // Formulario de Redes Sociales
    this.socialMediaForm = this.fb.group({
      facebook: [''],
      instagram: [''],
      youtube: [''],
      whatsapp: [''],
      tiktok: [''],
      twitter: ['']
    });

    // Formulario de Horarios
    this.schedulesForm = this.fb.group({
      sunday: ['10:00 AM - 12:00 PM', Validators.required],
      wednesday: ['7:00 PM - 9:00 PM', Validators.required],
      friday: ['7:00 PM - 9:00 PM', Validators.required],
      officeHours: ['Lunes a Viernes: 9:00 AM - 5:00 PM', Validators.required],
      emergencyHours: ['24/7 - Línea de emergencia', Validators.required]
    });

    // Formulario de Departamentos
    this.departmentsForm = this.fb.group({
      youth: ['Pastor de Jóvenes: Juan Pérez - jovenes@iglesia.com', Validators.required],
      kids: ['Directora: María González - ninos@iglesia.com', Validators.required],
      music: ['Director: Carlos Rodríguez - musica@iglesia.com', Validators.required],
      prayer: ['Coordinador: Ana Martínez - oracion@iglesia.com', Validators.required],
      volunteer: ['Coordinador: Luis Fernández - voluntarios@iglesia.com', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadContactData();
  }

  loadContactData(): void {
    const stored = localStorage.getItem('contactoAdminData');
    if (stored) {
      try {
        this.contactInfo = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading contact data:', error);
        this.contactInfo = this.getDefaultContact();
      }
    }

    // Cargar formularios con los datos
    this.loadForms();
  }

  loadForms(): void {
    // Información básica
    this.basicInfoForm.patchValue({
      email: this.contactInfo.email,
      phone: this.contactInfo.phone,
      address: this.contactInfo.address,
      city: this.contactInfo.city,
      mapEmbed: this.contactInfo.mapEmbed || ''
    });

    // Redes sociales
    if (this.contactInfo.socialMedia) {
      this.socialMediaForm.patchValue(this.contactInfo.socialMedia);
    }

    // Horarios
    if (this.contactInfo.schedules) {
      this.schedulesForm.patchValue(this.contactInfo.schedules);
    }

    // Departamentos
    if (this.contactInfo.departments) {
      this.departmentsForm.patchValue(this.contactInfo.departments);
    }
  }

  getDefaultContact(): ContactInfo {
    return {
      id: '1',
      email: 'contacto@iglesiaadonai.com',
      phone: '+1 (555) 123-4567',
      address: 'Av. Principal 1234',
      city: 'Ciudad, País 12345',
      socialMedia: {
        facebook: 'https://facebook.com/iglesiaadonai',
        instagram: 'https://instagram.com/iglesiaadonai',
        youtube: 'https://youtube.com/iglesiaadonai',
        whatsapp: '+15551234567',
        tiktok: 'https://tiktok.com/@iglesiaadonai',
        twitter: 'https://twitter.com/iglesiaadonai'
      },
      schedules: {
        sunday: '10:00 AM - 12:00 PM',
        wednesday: '7:00 PM - 9:00 PM',
        friday: '7:00 PM - 9:00 PM',
        officeHours: 'Lunes a Viernes: 9:00 AM - 5:00 PM',
        emergencyHours: '24/7 - Línea de emergencia'
      },
      departments: {
        youth: 'Pastor de Jóvenes: Juan Pérez - jovenes@iglesia.com',
        kids: 'Directora: María González - ninos@iglesia.com',
        music: 'Director: Carlos Rodríguez - musica@iglesia.com',
        prayer: 'Coordinador: Ana Martínez - oracion@iglesia.com',
        volunteer: 'Coordinador: Luis Fernández - voluntarios@iglesia.com'
      },
      mapEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a21c3ff3b5d%3A0x2f2b5b5b5b5b5b5b!2s123%20Main%20St%2C%20Brooklyn%2C%20NY%2011201!5e0!3m2!1sen!2sus!4v1617225317444!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
      additionalInfo: 'Estamos aquí para servirte. No dudes en contactarnos para cualquier necesidad espiritual o administrativa.'
    };
  }

  // Métodos para copiar al portapapeles (actualizados)
  copySocialMediaToClipboard(platform: SocialPlatform): void {
    const value = this.getSocialMediaValue(platform.id);
    if (value) {
      navigator.clipboard.writeText(value).then(() => {
        this.showToastMessage(`📋 ${platform.name} copiado al portapapeles`, 'success');
      });
    }
  }

  copyScheduleToClipboard(schedule: ScheduleItem): void {
    const value = this.getScheduleValue(schedule.id);
    if (value) {
      navigator.clipboard.writeText(value).then(() => {
        this.showToastMessage(`📋 ${schedule.title} copiado al portapapeles`, 'success');
      });
    }
  }

  copyDepartmentToClipboard(department: DepartmentItem): void {
    const value = this.getDepartmentValue(department.id);
    if (value) {
      navigator.clipboard.writeText(value).then(() => {
        this.showToastMessage(`📋 ${department.name} copiado al portapapeles`, 'success');
      });
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.loadForms();
    }
  }

  saveAll(): void {
    try {
      // Recolectar datos de todos los formularios
      const updatedContact: ContactInfo = {
        ...this.contactInfo,
        ...this.basicInfoForm.value,
        socialMedia: this.socialMediaForm.value,
        schedules: this.schedulesForm.value,
        departments: this.departmentsForm.value,
        mapEmbed: this.basicInfoForm.value.mapEmbed
      };

      // Guardar en localStorage
      localStorage.setItem('contactoAdminData', JSON.stringify(updatedContact));

      // Actualizar contacto local
      this.contactInfo = updatedContact;

      // Salir del modo edición
      this.isEditing = false;

      // Mostrar toast
      this.showToastMessage('✅ Información de contacto guardada exitosamente', 'success');

    } catch (error) {
      this.showToastMessage('❌ Error al guardar los cambios', 'error');
      console.error('Error saving contact data:', error);
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadContactData();
    this.showToastMessage('Cambios cancelados', 'info');
  }

  resetToDefaults(): void {
    if (confirm('¿Estás seguro de restablecer todos los datos de contacto a los valores por defecto? Esto no se puede deshacer.')) {
      this.contactInfo = this.getDefaultContact();
      localStorage.removeItem('contactoAdminData');
      this.loadForms();
      this.showToastMessage('Datos restablecidos a valores por defecto', 'info');
    }
  }

  exportData(): void {
    const dataStr = JSON.stringify(this.contactInfo, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileName = `contacto-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();

    this.showToastMessage('Datos exportados exitosamente', 'success');
  }

  importData(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          this.contactInfo = data;
          localStorage.setItem('contactoAdminData', JSON.stringify(data));
          this.loadForms();
          this.showToastMessage('Datos importados exitosamente', 'success');
        } catch (error) {
          this.showToastMessage('Error al importar el archivo', 'error');
          console.error('Import error:', error);
        }
      };

      reader.readAsText(file);
    }
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Métodos auxiliares

  getSocialMediaValue(platformId: keyof SocialMedia): string {
    if (!this.contactInfo.socialMedia) return '';
    return this.contactInfo.socialMedia[platformId] || '';
  }

  getScheduleValue(scheduleId: keyof Schedules): string {
    if (!this.contactInfo.schedules) return '';
    return this.contactInfo.schedules[scheduleId] || '';
  }

  getDepartmentValue(departmentId: keyof Departments): string {
    if (!this.contactInfo.departments) return '';
    return this.contactInfo.departments[departmentId] || '';
  }
  getSocialUrl(platform: SocialPlatform, value: string): string {
    if (!value) return '#';

    if (platform.baseUrl && !value.startsWith('http')) {
      return platform.baseUrl + value.replace(/[^\d+]/g, '');
    }

    return value.startsWith('http') ? value : 'https://' + value;
  }

  previewSocialUrl(platform: SocialPlatform): string {
    const value = this.getSocialMediaValue(platform.id);
    if (!value) return 'No configurado';

    if (platform.id === 'whatsapp' && value.includes('+')) {
      return `WhatsApp: ${value}`;
    }

    return value.length > 30 ? value.substring(0, 30) + '...' : value;
  }

  getSocialIcon(platformId: string): string {
    const platform = this.socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.icon : '🔗';
  }

  getSocialColor(platformId: string): string {
    const platform = this.socialPlatforms.find(p => p.id === platformId);
    return platform ? platform.color : 'from-gray-600 to-gray-800';
  }

  getScheduleIcon(scheduleId: string): string {
    const schedule = this.scheduleItems.find(s => s.id === scheduleId);
    return schedule ? schedule.icon : '⏰';
  }

  getScheduleColor(scheduleId: string): string {
    const schedule = this.scheduleItems.find(s => s.id === scheduleId);
    return schedule ? schedule.color : 'from-gray-600 to-gray-800';
  }

  getScheduleTitle(scheduleId: string): string {
    const schedule = this.scheduleItems.find(s => s.id === scheduleId);
    return schedule ? schedule.title : scheduleId;
  }

  getDepartmentIcon(departmentId: string): string {
    const department = this.departmentsList.find(d => d.id === departmentId);
    return department ? department.icon : '🏢';
  }

  getDepartmentColor(departmentId: string): string {
    const department = this.departmentsList.find(d => d.id === departmentId);
    return department ? department.color : 'from-gray-600 to-gray-800';
  }

  // Método para generar vista previa del mapa
  getMapPreview(): string {
    const mapEmbed = this.basicInfoForm.get('mapEmbed')?.value || this.contactInfo.mapEmbed;
    return mapEmbed || '';
  }

  // Método para validar URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Método para copiar al portapapeles
  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.showToastMessage(`📋 ${label} copiado al portapapeles`, 'success');
    }).catch(() => {
      this.showToastMessage('❌ Error al copiar', 'error');
    });
  }

  getPreviewSocialUrl(platform: SocialPlatform): string {
    const value = this.getSocialMediaValue(platform.id);
    if (!value) return '#';

    if (platform.baseUrl && !value.startsWith('http')) {
      return platform.baseUrl + value.replace(/[^\d+]/g, '');
    }

    return value.startsWith('http') ? value : 'https://' + value;
  }
}