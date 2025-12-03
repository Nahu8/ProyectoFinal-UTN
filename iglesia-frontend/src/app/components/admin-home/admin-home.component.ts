import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  homeForm: FormGroup;
  celebrationsForm: FormGroup;
  meetingDaysForm: FormGroup;
  ministriesForm: FormGroup;

  videoPreview: string | null = null;

  // Propiedades para el toast
  showToast: boolean = false;
  toastMessage: string = '';

  // Opciones de íconos para ministerios
  iconOptions = [
    { value: 'book', label: 'Libro' },
    { value: 'people', label: 'Personas' },
    { value: 'spark', label: 'Chispa' },
    { value: 'network', label: 'Red' }
  ];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // Formulario principal para Hero - ACTUALIZADO
    this.homeForm = this.fb.group({
      heroTitle: ['', Validators.required],
      heroButton1Text: ['', Validators.required],
      heroButton1Link: ['', Validators.required],
      heroButton2Text: ['', Validators.required],
      heroButton2Link: ['', Validators.required],
      heroVideoUrl: [''],
    });

    // Formulario para Celebrations
    this.celebrationsForm = this.fb.group({
      celebrations: this.fb.array([])
    });

    // Formulario para Días de Reunión (resumen)
    this.meetingDaysForm = this.fb.group({
      sectionTitle: ['', Validators.required],
      sectionSubtitle: [''],
      meetings: this.fb.array([])
    });

    // Formulario para Ministerios (resumen)
    this.ministriesForm = this.fb.group({
      sectionTitle: ['', Validators.required],
      sectionSubtitle: [''],
      ministries: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    const homeData = this.dataService.getHomeData();

    // Hero Section - ACTUALIZADO con manejo seguro de campos
    this.homeForm.patchValue({
      heroTitle: homeData.heroTitle || '',
      // Usa cualquier para acceder a campos que pueden no existir aún
      heroButton1Text: (homeData as any).heroButton1Text || '',
      heroButton1Link: (homeData as any).heroButton1Link || '',
      heroButton2Text: (homeData as any).heroButton2Text || '',
      heroButton2Link: (homeData as any).heroButton2Link || '',
      heroVideoUrl: homeData.heroVideoUrl || '',
    });

    if (homeData.heroVideoUrl) {
      this.videoPreview = homeData.heroVideoUrl;
    }

    // Celebrations
    this.loadCelebrationsData(homeData);

    // Meeting Days Summary
    this.loadMeetingDaysData(homeData);

    // Ministries Summary
    this.loadMinistriesData(homeData);
  }

  loadCelebrationsData(homeData: any): void {
    const celebrations = homeData?.celebrations || [];
    const celebrationsArray = this.celebrationsForm.get('celebrations') as FormArray;
    celebrationsArray.clear();

    celebrations.forEach((celebration: any) => {
      celebrationsArray.push(this.createCelebrationForm(celebration));
    });
  }

  loadMeetingDaysData(homeData: any): void {
    const meetingDaysSummary = homeData?.meetingDaysSummary || {};

    this.meetingDaysForm.patchValue({
      sectionTitle: meetingDaysSummary.sectionTitle || 'DÍAS DE REUNIÓN',
      sectionSubtitle: meetingDaysSummary.sectionSubtitle || 'Próximas reuniones y horarios — mantente al tanto.'
    });

    const meetingsArray = this.meetingDaysForm.get('meetings') as FormArray;
    meetingsArray.clear();

    const meetings = meetingDaysSummary.meetings || [];

    meetings.forEach((meeting: any) => {
      meetingsArray.push(this.createMeetingForm(meeting));
    });
  }

  loadMinistriesData(homeData: any): void {
    const ministriesSummary = homeData?.ministriesSummary || {};

    this.ministriesForm.patchValue({
      sectionTitle: ministriesSummary.sectionTitle || 'NUESTROS MINISTERIOS',
      sectionSubtitle: ministriesSummary.sectionSubtitle || 'Descubre cómo puedes servir y crecer en nuestra comunidad.'
    });

    const ministriesArray = this.ministriesForm.get('ministries') as FormArray;
    ministriesArray.clear();

    const ministries = ministriesSummary.ministries || [];

    ministries.forEach((ministry: any) => {
      ministriesArray.push(this.createMinistryForm(ministry));
    });
  }

  // CRUD para Celebrations
  createCelebrationForm(celebration?: any): FormGroup {
    return this.fb.group({
      title: [celebration?.title || '', Validators.required],
      subtitle: [celebration?.subtitle || ''],
      description: [celebration?.description || ''],
      videoId: [celebration?.videoId || '', Validators.required],
      startTime: [celebration?.startTime || 0]
    });
  }

  get celebrationsArray(): FormArray {
    return this.celebrationsForm.get('celebrations') as FormArray;
  }

  addCelebration(): void {
    this.celebrationsArray.push(this.createCelebrationForm());
  }

  removeCelebration(index: number): void {
    this.celebrationsArray.removeAt(index);
  }

  // CRUD para Meeting Days
  createMeetingForm(meeting?: any): FormGroup {
    return this.fb.group({
      day: [meeting?.day || '', Validators.required],
      title: [meeting?.title || '', Validators.required],
      time: [meeting?.time || '', Validators.required],
      note: [meeting?.note || ''],
      colorFrom: [meeting?.colorFrom || '#4f46e5'],
      colorTo: [meeting?.colorTo || '#ec4899']
    });
  }

  get meetingsArray(): FormArray {
    return this.meetingDaysForm.get('meetings') as FormArray;
  }

  addMeeting(): void {
    this.meetingsArray.push(this.createMeetingForm());
  }

  removeMeeting(index: number): void {
    this.meetingsArray.removeAt(index);
  }

  // CRUD para Ministries
  createMinistryForm(ministry?: any): FormGroup {
    return this.fb.group({
      name: [ministry?.name || '', Validators.required],
      description: [ministry?.description || ''],
      icon: [ministry?.icon || 'book'],
      image: [ministry?.image || '']
    });
  }

  get ministriesArray(): FormArray {
    return this.ministriesForm.get('ministries') as FormArray;
  }

  addMinistry(): void {
    this.ministriesArray.push(this.createMinistryForm());
  }

  removeMinistry(index: number): void {
    this.ministriesArray.removeAt(index);
  }

  // Manejo de archivos
  onFileSelected(event: Event, field: string, formArray: FormArray, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validaciones
      const maxSize = 5 * 1024 * 1024; // 5MB para imágenes
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

      if (file.size > maxSize) {
        this.showToastMessage('La imagen es demasiado grande. Máximo 5MB.', 'error');
        return;
      }

      if (!allowedImageTypes.includes(file.type)) {
        this.showToastMessage('Formato de imagen no válido. Use JPEG, PNG, GIF o WebP.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        formArray.at(index).get('image')?.setValue(result);
        this.dataService.markChangesPending('home');
      };
      reader.readAsDataURL(file);
    }
  }

  onHeroVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

      if (file.size > maxSize) {
        this.showToastMessage('El video es demasiado grande. Máximo 10MB.', 'error');
        return;
      }

      if (!allowedVideoTypes.includes(file.type)) {
        this.showToastMessage('Formato de video no válido. Use MP4, WebM o OGG.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.homeForm.get('heroVideoUrl')?.setValue(result);
        this.videoPreview = result;
        this.dataService.markChangesPending('home');
      };
      reader.readAsDataURL(file);
    }
  }

  // Métodos para mostrar toast
  showToastMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.showToast = true;

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Métodos para guardar - ACTUALIZADOS con toast
  saveHome(): void {
    if (this.homeForm.valid) {
      const currentData = this.dataService.getHomeData();
      const updatedData = {
        ...currentData,
        ...this.homeForm.value
      };

      this.dataService.saveHomeData(updatedData);
      this.showToastMessage('Hero guardado exitosamente');
    } else {
      this.showToastMessage('Por favor complete los campos requeridos', 'error');
    }
  }

  saveCelebrations(): void {
    if (this.celebrationsForm.valid) {
      const currentData = this.dataService.getHomeData();
      const updatedData = {
        ...currentData,
        celebrations: this.celebrationsArray.value
      };

      this.dataService.saveHomeData(updatedData);
      this.showToastMessage('Celebraciones guardadas exitosamente');
    } else {
      this.showToastMessage('Por favor complete los campos requeridos', 'error');
    }
  }

  saveMeetingDays(): void {
    if (this.meetingDaysForm.valid) {
      const currentData = this.dataService.getHomeData();
      const updatedData = {
        ...currentData,
        meetingDaysSummary: this.meetingDaysForm.value
      };

      this.dataService.saveHomeData(updatedData);
      this.showToastMessage('Días de Reunión guardados exitosamente');
    } else {
      this.showToastMessage('Por favor complete los campos requeridos', 'error');
    }
  }

  saveMinistries(): void {
    if (this.ministriesForm.valid) {
      const currentData = this.dataService.getHomeData();
      const updatedData = {
        ...currentData,
        ministriesSummary: this.ministriesForm.value
      };

      this.dataService.saveHomeData(updatedData);
      this.showToastMessage('Ministerios guardados exitosamente');
    } else {
      this.showToastMessage('Por favor complete los campos requeridos', 'error');
    }
  }

  clearVideo(): void {
    this.homeForm.get('heroVideoUrl')?.setValue('');
    this.videoPreview = null;
    this.dataService.markChangesPending('home');
  }

  // Método para mostrar vista previa de imagen
  getMinistryImagePreview(index: number): string | null {
    const imageValue = this.ministriesArray.at(index).get('image')?.value;
    return imageValue || null;
  }
}