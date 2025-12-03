import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

// Interfaces para los eventos
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  type: 'reunion' | 'especial' | 'celebración' | 'estudio';
  color: string;
  icon: string;
  location: string;
  speakers?: string[];
  registrationLink?: string;
}

interface MeetingDay {
  day: string;
  title: string;
  time: string;
  note: string;
  colorFrom: string;
  colorTo: string;
}

@Component({
  selector: 'app-admin-dias-reunion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dias-reunion.component.html',
  styleUrls: ['./admin-dias-reunion.component.css']
})
export class AdminDiasReunionComponent implements OnInit {
  // Formularios principales
  calendarEventsForm: FormGroup;
  recurringMeetingsForm: FormGroup;
  eventSettingsForm: FormGroup;

  // Previews y estados
  showToast: boolean = false;
  toastMessage: string = '';

  // Opciones para selects
  eventTypes = [
    { value: 'reunion', label: 'Reunión', icon: '🙏', color: 'from-blue-500 to-cyan-500' },
    { value: 'especial', label: 'Evento Especial', icon: '🎉', color: 'from-pink-500 to-rose-500' },
    { value: 'celebración', label: 'Celebración', icon: '🎊', color: 'from-yellow-500 to-orange-500' },
    { value: 'estudio', label: 'Estudio Bíblico', icon: '📖', color: 'from-green-500 to-emerald-500' }
  ];

  eventIcons = [
    { value: '🙏', label: 'Oración' },
    { value: '📖', label: 'Biblia' },
    { value: '🎵', label: 'Música' },
    { value: '🍷', label: 'Santa Cena' },
    { value: '🔥', label: 'Fuego' },
    { value: '🌟', label: 'Estrella' },
    { value: '🎄', label: 'Navidad' },
    { value: '🎆', label: 'Fuegos Artificiales' },
    { value: '👥', label: 'Grupo' },
    { value: '🔮', label: 'Profecía' },
    { value: '⭐', label: 'Especial' },
    { value: '📅', label: 'Calendario' }
  ];

  daysOfWeek = [
    { value: 'Lunes', label: 'Lunes' },
    { value: 'Martes', label: 'Martes' },
    { value: 'Miércoles', label: 'Miércoles' },
    { value: 'Jueves', label: 'Jueves' },
    { value: 'Viernes', label: 'Viernes' },
    { value: 'Sábado', label: 'Sábado' },
    { value: 'Domingo', label: 'Domingo' }
  ];

  colorPresets = [
    { from: '#4f46e5', to: '#ec4899', name: 'Índigo a Rosa' },
    { from: '#3b82f6', to: '#06b6d4', name: 'Azul a Cian' },
    { from: '#8b5cf6', to: '#06b6d4', name: 'Violeta a Cian' },
    { from: '#10b981', to: '#3b82f6', name: 'Verde a Azul' },
    { from: '#f59e0b', to: '#ef4444', name: 'Amarillo a Rojo' },
    { from: '#ec4899', to: '#f472b6', name: 'Rosa a Rosa Claro' },
    { from: '#f59e0b', to: '#f97316', name: 'Amarillo a Naranja' },
    { from: '#10b981', to: '#059669', name: 'Verde a Verde Oscuro' }
  ];

  months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // Formulario para eventos del calendario
    this.calendarEventsForm = this.fb.group({
      sectionTitle: ['CALENDARIO DE EVENTOS', Validators.required],
      sectionSubtitle: ['Planifica tu participación en nuestras reuniones y eventos especiales', Validators.required],
      events: this.fb.array([])
    });

    // Formulario para reuniones recurrentes
    this.recurringMeetingsForm = this.fb.group({
      sectionTitle: ['REUNIONES SEMANALES', Validators.required],
      sectionSubtitle: ['Nuestras reuniones regulares que ocurren cada semana'],
      meetings: this.fb.array([])
    });

    // Formulario para configuración de eventos
    this.eventSettingsForm = this.fb.group({
      showPastEvents: [true],
      showEventCountdown: [true],
      defaultEventColor: ['#3b82f6'],
      defaultEventDuration: ['120'], // minutos
      enableEventRegistration: [true],
      emailNotifications: [true],
      reminderDaysBefore: ['1', [Validators.min(0), Validators.max(7)]]
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    // Cargar eventos del calendario
    const calendarData = this.dataService.getCalendarData();
    this.loadCalendarEventsData(calendarData);

    // Cargar reuniones recurrentes (de home data)
    const homeData = this.dataService.getHomeData();
    this.loadRecurringMeetingsData(homeData);

    // Cargar configuración de eventos
    const eventSettings = this.dataService.getEventSettings();
    this.eventSettingsForm.patchValue(eventSettings);
  }

  loadCalendarEventsData(calendarData: any): void {
    this.calendarEventsForm.patchValue({
      sectionTitle: calendarData?.sectionTitle || 'CALENDARIO DE EVENTOS',
      sectionSubtitle: calendarData?.sectionSubtitle || 'Planifica tu participación en nuestras reuniones y eventos especiales'
    });

    const eventsArray = this.calendarEventsForm.get('events') as FormArray;
    eventsArray.clear();

    const events = calendarData?.events || this.getDefaultEvents();

    events.forEach((event: any) => {
      eventsArray.push(this.createEventForm(event));
    });
  }

  loadRecurringMeetingsData(homeData: any): void {
    const meetingDaysSummary = homeData?.meetingDaysSummary || {};

    this.recurringMeetingsForm.patchValue({
      sectionTitle: meetingDaysSummary.sectionTitle || 'REUNIONES SEMANALES',
      sectionSubtitle: meetingDaysSummary.sectionSubtitle || 'Nuestras reuniones regulares que ocurren cada semana'
    });

    const meetingsArray = this.recurringMeetingsForm.get('meetings') as FormArray;
    meetingsArray.clear();

    const meetings = meetingDaysSummary.meetings || [];

    meetings.forEach((meeting: any) => {
      meetingsArray.push(this.createMeetingForm(meeting));
    });
  }

  // CRUD para eventos del calendario
  createEventForm(event?: any): FormGroup {
    const eventDate = event?.date ? new Date(event.date) : new Date();

    return this.fb.group({
      id: [event?.id || this.generateId()],
      title: [event?.title || '', Validators.required],
      description: [event?.description || '', Validators.required],
      date: [eventDate.toISOString().split('T')[0], Validators.required],
      time: [event?.time || '19:00', Validators.required],
      type: [event?.type || 'reunion', Validators.required],
      icon: [event?.icon || '🙏', Validators.required],
      location: [event?.location || 'Templo Principal', Validators.required],
      speakers: [event?.speakers?.join(', ') || ''],
      registrationLink: [event?.registrationLink || ''],
      colorFrom: [event?.colorFrom || '#3b82f6'],
      colorTo: [event?.colorTo || '#06b6d4']
    });
  }

  get eventsArray(): FormArray {
    return this.calendarEventsForm.get('events') as FormArray;
  }

  addEvent(): void {
    this.eventsArray.push(this.createEventForm());
    this.scrollToBottom('events-section');
  }

  removeEvent(index: number): void {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      this.eventsArray.removeAt(index);
      this.showToastMessage('Evento eliminado');
    }
  }

  duplicateEvent(index: number): void {
    const event = this.eventsArray.at(index).value;
    const newEvent = { ...event, id: this.generateId() };
    this.eventsArray.insert(index + 1, this.createEventForm(newEvent));
    this.showToastMessage('Evento duplicado');
  }

  // CRUD para reuniones recurrentes
  createMeetingForm(meeting?: any): FormGroup {
    return this.fb.group({
      day: [meeting?.day || 'Lunes', Validators.required],
      title: [meeting?.title || '', Validators.required],
      time: [meeting?.time || '19:00', Validators.required],
      note: [meeting?.note || ''],
      colorFrom: [meeting?.colorFrom || '#4f46e5'],
      colorTo: [meeting?.colorTo || '#ec4899']
    });
  }

  get meetingsArray(): FormArray {
    return this.recurringMeetingsForm.get('meetings') as FormArray;
  }

  addMeeting(): void {
    this.meetingsArray.push(this.createMeetingForm());
    this.scrollToBottom('meetings-section');
  }

  removeMeeting(index: number): void {
    if (confirm('¿Estás seguro de eliminar esta reunión?')) {
      this.meetingsArray.removeAt(index);
      this.showToastMessage('Reunión eliminada');
    }
  }

  // Métodos auxiliares
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()} de ${this.months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  getEventTypeLabel(type: string): string {
    return this.eventTypes.find(t => t.value === type)?.label || type;
  }

  getEventIconLabel(icon: string): string {
    return this.eventIcons.find(i => i.value === icon)?.label || 'Ícono';
  }

  scrollToBottom(sectionId: string): void {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100);
  }

  // Métodos para guardar
  saveCalendarEvents(): void {
    if (this.calendarEventsForm.valid) {
      const calendarData = {
        ...this.calendarEventsForm.value,
        lastUpdated: new Date().toISOString()
      };

      this.dataService.saveCalendarData(calendarData);
      this.showToastMessage('Eventos del calendario guardados exitosamente');
    } else {
      this.showToastMessage('Por favor complete los campos requeridos', 'error');
      this.markFormGroupTouched(this.calendarEventsForm);
    }
  }

  saveRecurringMeetings(): void {
    if (this.recurringMeetingsForm.valid) {
      const currentData = this.dataService.getHomeData();
      const updatedData = {
        ...currentData,
        meetingDaysSummary: this.recurringMeetingsForm.value
      };

      this.dataService.saveHomeData(updatedData);
      this.showToastMessage('Reuniones recurrentes guardadas exitosamente');
    } else {
      this.showToastMessage('Por favor complete los campos requeridos', 'error');
      this.markFormGroupTouched(this.recurringMeetingsForm);
    }
  }

  saveEventSettings(): void {
    if (this.eventSettingsForm.valid) {
      this.dataService.saveEventSettings(this.eventSettingsForm.value);
      this.showToastMessage('Configuración de eventos guardada exitosamente');
    }
  }

  saveAll(): void {
    this.saveCalendarEvents();
    this.saveRecurringMeetings();
    this.saveEventSettings();
    this.showToastMessage('Todos los cambios guardados exitosamente');
  }

  // Métodos para Toast
  showToastMessage(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  // Método para marcar todos los campos como tocados
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  // Datos de ejemplo para eventos
  getDefaultEvents(): any[] {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    return [
      {
        id: this.generateId(),
        title: 'SLR - Servicio y Estudio',
        description: 'Reunión semanal de estudio bíblico y oración',
        date: new Date(currentYear, currentMonth, 3).toISOString().split('T')[0],
        time: '19:00',
        type: 'reunion',
        icon: '🙏',
        location: 'Templo Principal',
        speakers: 'Pastor Juan Pérez',
        colorFrom: '#3b82f6',
        colorTo: '#06b6d4'
      },
      {
        id: this.generateId(),
        title: 'Santa Cena',
        description: 'Celebración de la Santa Cena dominical',
        date: new Date(currentYear, currentMonth, 7).toISOString().split('T')[0],
        time: '10:00',
        type: 'celebración',
        icon: '🍷',
        location: 'Templo Principal',
        speakers: 'Pastor Juan Pérez',
        colorFrom: '#8b5cf6',
        colorTo: '#ec4899'
      },
      {
        id: this.generateId(),
        title: 'Escuela Bíblica',
        description: 'Clase bíblica para todas las edades',
        date: new Date(currentYear, currentMonth, 6).toISOString().split('T')[0],
        time: '09:00',
        type: 'estudio',
        icon: '📖',
        location: 'Salón de Clases',
        speakers: 'Prof. María García, Prof. Carlos López',
        colorFrom: '#10b981',
        colorTo: '#059669'
      }
    ];
  }

  // Método para aplicar un preset de color
  applyColorPreset(eventIndex: number, presetIndex: number): void {
    const preset = this.colorPresets[presetIndex];
    const eventGroup = this.eventsArray.at(eventIndex) as FormGroup;
    eventGroup.patchValue({
      colorFrom: preset.from,
      colorTo: preset.to
    });
  }

  applyMeetingColorPreset(meetingIndex: number, presetIndex: number): void {
    const preset = this.colorPresets[presetIndex];
    const meetingGroup = this.meetingsArray.at(meetingIndex) as FormGroup;
    meetingGroup.patchValue({
      colorFrom: preset.from,
      colorTo: preset.to
    });
  }

  // Método para ordenar eventos por fecha
  sortEventsByDate(): void {
    const events = this.eventsArray.value;
    events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    this.eventsArray.clear();
    events.forEach((event: any) => {
      this.eventsArray.push(this.createEventForm(event));
    });

    this.showToastMessage('Eventos ordenados por fecha');
  }

  // Método para exportar eventos
  exportEvents(): void {
    const events = this.eventsArray.value;
    const dataStr = JSON.stringify(events, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `eventos-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    this.showToastMessage('Eventos exportados exitosamente');
  }

  // Método para importar eventos
  importEvents(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const events = JSON.parse(e.target?.result as string);
          if (Array.isArray(events)) {
            this.eventsArray.clear();
            events.forEach((eventData: any) => {
              this.eventsArray.push(this.createEventForm(eventData));
            });
            this.showToastMessage(`${events.length} eventos importados exitosamente`);
          } else {
            this.showToastMessage('Formato de archivo inválido', 'error');
          }
        } catch (error) {
          this.showToastMessage('Error al leer el archivo', 'error');
        }
      };

      reader.readAsText(file);
    }
  }

  // Método para contar eventos próximos
  getUpcomingEventsCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.eventsArray.value.filter((event: any) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).length;
  }

  // Método para contar días únicos con eventos
  getUniqueDaysCount(): number {
    const uniqueDays = new Set();

    this.eventsArray.value.forEach((event: any) => {
      if (event.date) {
        const date = new Date(event.date);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        uniqueDays.add(dayKey);
      }
    });

    return uniqueDays.size;
  }

  // Método para obtener eventos próximos (próximos 30 días)
  getUpcomingEvents(): any[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 30);

    return this.eventsArray.value
      .filter((event: any) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate <= nextMonth;
      })
      .sort((a: any, b: any) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }

  // Método para obtener eventos por tipo
  getEventsByType(type: string): number {
    return this.eventsArray.value.filter((event: any) => event.type === type).length;
  }

  // Método para obtener reuniones por día de la semana
  getMeetingsByDay(day: string): number {
    return this.meetingsArray.value.filter((meeting: any) => meeting.day === day).length;
  }
}