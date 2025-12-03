import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, AbstractControl } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { FormsModule } from '@angular/forms';

// Interfaces para datos de ministerios
interface Ministry {
  id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  colorFrom: string;
  colorTo: string;
  features: string[];
  schedule: string;
  location: string;
  leader: string;
  contactEmail: string;
  requirements: string[];
  status: 'active' | 'inactive' | 'full';
  volunteerCount: number;
  impactStats: string;
}

interface Statistic {
  id: string;
  value: string;
  icon: string;
  label: string;
  description?: string;
  color: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  ministry: string;
  content: string;
  rating: number;
  image?: string;
  date: string;
}

interface ProcessStep {
  id: string;
  number: number;
  icon: string;
  title: string;
  description: string;
  colorFrom: string;
  colorTo: string;
}

interface FAQ {
  id: string;
  icon: string;
  question: string;
  answer: string;
  category: string;
}

interface HeroContent {
  badgeText: string;
  title: string;
  subtitle: string;
  ctaButton1: { text: string; link: string; icon: string };
  ctaButton2: { text: string; link: string; icon: string };
  backgroundGradient: { from: string; via: string; to: string };
}

interface PageContent {
  ministriesTitle: string;
  ministriesSubtitle: string;
  processTitle: string;
  processSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  faqTitle: string;
  faqSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBadgeText: string;
}

@Component({
  selector: 'app-admin-ministerios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-ministerios.component.html',
  styleUrls: ['./admin-ministerios.component.css']
})
export class AdminMinisteriosComponent implements OnInit {
  // Formularios principales
  heroForm: FormGroup;
  ministriesForm: FormGroup;
  statisticsForm: FormGroup;
  processForm: FormGroup;
  testimonialsForm: FormGroup;
  faqForm: FormGroup;
  pageContentForm: FormGroup;

  // Estado y configuraciones
  activeTab: string = 'hero';
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' = 'success';
  isPreviewMode: boolean = false;
  showMinistryModal: boolean = false;
  showStatisticModal: boolean = false;
  showTestimonialModal: boolean = false;
  showFAQModal: boolean = false;

  // Datos temporales para modales
  currentMinistry: any = null;
  currentStatistic: any = null;
  currentTestimonial: any = null;
  currentFAQ: any = null;
  ministryModalForm!: FormGroup;

  // Opciones para selects
  ministryStatuses = [
    { value: 'active', label: 'Activo', color: 'from-green-500 to-emerald-500' },
    { value: 'inactive', label: 'Inactivo', color: 'from-gray-500 to-gray-600' },
    { value: 'full', label: 'Cupo Lleno', color: 'from-yellow-500 to-orange-500' }
  ];

  ministryIcons = [
    { value: '📚', label: 'Libro', category: 'Educación' },
    { value: '👥', label: 'Grupo', category: 'Comunidad' },
    { value: '🎵', label: 'Música', category: 'Alabanza' },
    { value: '🙏', label: 'Oración', category: 'Espiritual' },
    { value: '👶', label: 'Niños', category: 'Niños' },
    { value: '🎨', label: 'Arte', category: 'Creatividad' },
    { value: '🌱', label: 'Crecimiento', category: 'Desarrollo' },
    { value: '🤝', label: 'Servicio', category: 'Voluntariado' },
    { value: '💬', label: 'Conversación', category: 'Comunicación' },
    { value: '❤️', label: 'Amor', category: 'Cuidado' },
    { value: '🌟', label: 'Estrella', category: 'Destacado' },
    { value: '🔥', label: 'Fuego', category: 'Pasión' }
  ];

  featureOptions = [
    'Reuniones semanales',
    'Capacitaciones',
    'Material incluido',
    'Certificación',
    'Transporte',
    'Refrigerio',
    'Grupo de WhatsApp',
    'Retiros anuales',
    'Mentoría personal',
    'Eventos especiales',
    'Servicio comunitario',
    'Red de contactos'
  ];

  requirementOptions = [
    'Mayor de 18 años',
    'Disponibilidad semanal',
    'Entrevista personal',
    'Capacitación inicial',
    'Compromiso de 6 meses',
    'Carta de recomendación',
    'Antecedentes penales',
    'Examen médico',
    'Uniforme específico',
    'Herramientas propias',
    'Conocimiento bíblico',
    'Experiencia previa'
  ];

  faqCategories = [
    'General',
    'Inscripción',
    'Requisitos',
    'Horarios',
    'Liderazgo',
    'Voluntariado',
    'Eventos',
    'Recursos'
  ];

  colorPresets = [
    { from: '#4f46e5', to: '#ec4899', name: 'Índigo a Rosa' },
    { from: '#3b82f6', to: '#06b6d4', name: 'Azul a Cian' },
    { from: '#8b5cf6', to: '#e11d48', name: 'Violeta a Rojo' },
    { from: '#10b981', to: '#3b82f6', name: 'Verde a Azul' },
    { from: '#f59e0b', to: '#ef4444', name: 'Amarillo a Rojo' },
    { from: '#ec4899', to: '#f472b6', name: 'Rosa a Rosa Claro' },
    { from: '#6366f1', to: '#8b5cf6', name: 'Índigo a Violeta' },
    { from: '#059669', to: '#10b981', name: 'Verde Oscuro a Verde' }
  ];

  ratingOptions = [1, 2, 3, 4, 5];

  constructor(private fb: FormBuilder, private dataService: DataService) {
    // Formulario para Hero Section
    this.heroForm = this.fb.group({
      badgeText: ['Tu lugar para servir', Validators.required],
      title: ['Nuestros Ministerios', Validators.required],
      subtitle: ['Descubre cómo puedes servir y crecer en nuestra comunidad. Cada ministerio es una oportunidad para usar tus dones y hacer una diferencia eterna.', Validators.required],
      ctaButton1: this.fb.group({
        text: ['Quiero unirme'],
        link: ['/contacto'],
        icon: ['🤝']
      }),
      ctaButton2: this.fb.group({
        text: ['Explorar ministerios'],
        link: ['#ministerios'],
        icon: ['🔍']
      }),
      backgroundGradient: this.fb.group({
        from: ['#4f46e5'],
        via: ['#7c3aed'],
        to: ['#000000']
      })
    });

    // Formulario para Ministerios
    this.ministriesForm = this.fb.group({
      ministries: this.fb.array([])
    });

    // Formulario para Estadísticas
    this.statisticsForm = this.fb.group({
      statistics: this.fb.array([])
    });

    // Formulario para Proceso
    this.processForm = this.fb.group({
      title: ['🚀 Cómo Unirte', Validators.required],
      subtitle: ['Tres sencillos pasos para comenzar tu jornada de servicio', Validators.required],
      steps: this.fb.array([])
    });

    // Formulario para Testimonios
    this.testimonialsForm = this.fb.group({
      testimonials: this.fb.array([])
    });

    // Formulario para FAQ
    this.faqForm = this.fb.group({
      faqs: this.fb.array([])
    });

    // Formulario para Contenido de Página
    this.pageContentForm = this.fb.group({
      ministriesTitle: ['✨ Nuestros Ministerios', Validators.required],
      ministriesSubtitle: ['Cada ministerio es una oportunidad para servir, crecer y ser parte de algo más grande.', Validators.required],
      processTitle: ['🚀 Cómo Unirte', Validators.required],
      processSubtitle: ['Tres sencillos pasos para comenzar tu jornada de servicio', Validators.required],
      testimonialsTitle: ['💬 Historias de Transformación', Validators.required],
      testimonialsSubtitle: ['Lo que dicen quienes han encontrado propósito sirviendo en nuestros ministerios', Validators.required],
      faqTitle: ['❓ Preguntas Frecuentes', Validators.required],
      faqSubtitle: ['Respuestas a las dudas más comunes sobre nuestros ministerios', Validators.required],
      ctaTitle: ['¿Listo para hacer la diferencia?', Validators.required],
      ctaSubtitle: ['Cada ministerio es una pieza vital en el cuerpo de Cristo. Tu servicio puede transformar vidas, empezando por la tuya.', Validators.required],
      ctaBadgeText: ['Tu momento es ahora', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }
  onHeroColorChange(which: 'from' | 'via' | 'to', event: Event): void {
    const input = event.target as HTMLInputElement;
    this.heroForm.get(`backgroundGradient.${which}`)?.setValue(input.value);
  }
  // ==================== MÉTODOS PARA CARGAR DATOS ====================
  loadAllData(): void {
    // Cargar datos del localStorage o usar valores por defecto
    const storedData = this.getStoredData();

    this.loadHeroData(storedData.hero);
    this.loadMinistriesData(storedData.ministries);
    this.loadStatisticsData(storedData.statistics);
    this.loadProcessData(storedData.process);
    this.loadTestimonialsData(storedData.testimonials);
    this.loadFAQData(storedData.faqs);
    this.loadPageContentData(storedData.pageContent);
  }

  getStoredData(): any {
    const defaultData = this.getDefaultData();
    const stored = localStorage.getItem('ministeriosAdminData');

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultData, ...parsed };
      } catch (e) {
        return defaultData;
      }
    }

    return defaultData;
  }

  getDefaultData(): any {
    return {
      hero: {
        badgeText: 'Tu lugar para servir',
        title: 'Nuestros Ministerios',
        subtitle: 'Descubre cómo puedes servir y crecer en nuestra comunidad. Cada ministerio es una oportunidad para usar tus dones y hacer una diferencia eterna.',
        ctaButton1: { text: 'Quiero unirme', link: '/contacto', icon: '🤝' },
        ctaButton2: { text: 'Explorar ministerios', link: '#ministerios', icon: '🔍' },
        backgroundGradient: { from: '#4f46e5', via: '#7c3aed', to: '#000000' }
      },
      ministries: this.getDefaultMinisterios(),
      statistics: this.getDefaultStatistics(),
      process: {
        title: '🚀 Cómo Unirte',
        subtitle: 'Tres sencillos pasos para comenzar tu jornada de servicio',
        steps: this.getDefaultProcessSteps()
      },
      testimonials: this.getDefaultTestimonials(),
      faqs: this.getDefaultFAQs(),
      pageContent: {
        ministriesTitle: '✨ Nuestros Ministerios',
        ministriesSubtitle: 'Cada ministerio es una oportunidad para servir, crecer y ser parte de algo más grande.',
        processTitle: '🚀 Cómo Unirte',
        processSubtitle: 'Tres sencillos pasos para comenzar tu jornada de servicio',
        testimonialsTitle: '💬 Historias de Transformación',
        testimonialsSubtitle: 'Lo que dicen quienes han encontrado propósito sirviendo en nuestros ministerios',
        faqTitle: '❓ Preguntas Frecuentes',
        faqSubtitle: 'Respuestas a las dudas más comunes sobre nuestros ministerios',
        ctaTitle: '¿Listo para hacer la diferencia?',
        ctaSubtitle: 'Cada ministerio es una pieza vital en el cuerpo de Cristo. Tu servicio puede transformar vidas, empezando por la tuya.',
        ctaBadgeText: 'Tu momento es ahora'
      }
    };
  }

  loadHeroData(data: any): void {
    this.heroForm.patchValue(data);
  }

  loadMinistriesData(ministries: any[]): void {
    const ministriesArray = this.ministriesForm.get('ministries') as FormArray;
    ministriesArray.clear();

    ministries.forEach(ministry => {
      ministriesArray.push(this.createMinistryForm(ministry));
    });
  }

  loadStatisticsData(statistics: any[]): void {
    const statsArray = this.statisticsForm.get('statistics') as FormArray;
    statsArray.clear();

    statistics.forEach(stat => {
      statsArray.push(this.createStatisticForm(stat));
    });
  }

  loadProcessData(process: any): void {
    this.processForm.patchValue({
      title: process.title,
      subtitle: process.subtitle
    });

    const stepsArray = this.processForm.get('steps') as FormArray;
    stepsArray.clear();

    process.steps.forEach((step: any) => {
      stepsArray.push(this.createProcessStepForm(step));
    });
  }

  loadTestimonialsData(testimonials: any[]): void {
    const testimonialsArray = this.testimonialsForm.get('testimonials') as FormArray;
    testimonialsArray.clear();

    testimonials.forEach(testimonial => {
      testimonialsArray.push(this.createTestimonialForm(testimonial));
    });
  }

  loadFAQData(faqs: any[]): void {
    const faqArray = this.faqForm.get('faqs') as FormArray;
    faqArray.clear();

    faqs.forEach(faq => {
      faqArray.push(this.createFAQForm(faq));
    });
  }

  loadPageContentData(content: any): void {
    this.pageContentForm.patchValue(content);
  }

  // ==================== MÉTODOS PARA CREAR FORMULARIOS ====================
  createMinistryForm(ministry?: any): FormGroup {
    return this.fb.group({
      id: [ministry?.id || this.generateId()],
      name: [ministry?.name || '', Validators.required],
      description: [ministry?.description || '', Validators.required],
      icon: [ministry?.icon || '❤️', Validators.required],
      image: [ministry?.image || 'assets/imagenes/placeholder.jpg'],
      colorFrom: [ministry?.colorFrom || '#3b82f6'],
      colorTo: [ministry?.colorTo || '#8b5cf6'],
      features: [ministry?.features || []],
      schedule: [ministry?.schedule || 'Reuniones semanales'],
      location: [ministry?.location || 'Templo Principal'],
      leader: [ministry?.leader || ''],
      contactEmail: [ministry?.contactEmail || ''],
      requirements: [ministry?.requirements || []],
      status: [ministry?.status || 'active', Validators.required],
      volunteerCount: [ministry?.volunteerCount || 0],
      impactStats: [ministry?.impactStats || 'Impactando vidas']
    });
  }

  createStatisticForm(statistic?: any): FormGroup {
    return this.fb.group({
      id: [statistic?.id || this.generateId()],
      value: [statistic?.value || '', Validators.required],
      icon: [statistic?.icon || '✨', Validators.required],
      label: [statistic?.label || '', Validators.required],
      description: [statistic?.description || ''],
      color: [statistic?.color || '#3b82f6']
    });
  }

  createProcessStepForm(step?: any): FormGroup {
    return this.fb.group({
      id: [step?.id || this.generateId()],
      number: [step?.number || 1, Validators.required],
      icon: [step?.icon || '🔍', Validators.required],
      title: [step?.title || '', Validators.required],
      description: [step?.description || '', Validators.required],
      colorFrom: [step?.colorFrom || '#3b82f6'],
      colorTo: [step?.colorTo || '#8b5cf6']
    });
  }

  createTestimonialForm(testimonial?: any): FormGroup {
    return this.fb.group({
      id: [testimonial?.id || this.generateId()],
      name: [testimonial?.name || '', Validators.required],
      role: [testimonial?.role || '', Validators.required],
      ministry: [testimonial?.ministry || '', Validators.required],
      content: [testimonial?.content || '', Validators.required],
      rating: [testimonial?.rating || 5, Validators.required],
      image: [testimonial?.image || ''],
      date: [testimonial?.date || new Date().toISOString().split('T')[0]]
    });
  }

  createFAQForm(faq?: any): FormGroup {
    return this.fb.group({
      id: [faq?.id || this.generateId()],
      icon: [faq?.icon || '❓', Validators.required],
      question: [faq?.question || '', Validators.required],
      answer: [faq?.answer || '', Validators.required],
      category: [faq?.category || 'General', Validators.required]
    });
  }

  // ==================== GETTERS PARA FORM ARRAYS ====================
  get ministriesArray(): FormArray {
    return this.ministriesForm.get('ministries') as FormArray;
  }

  get statisticsArray(): FormArray {
    return this.statisticsForm.get('statistics') as FormArray;
  }

  get processStepsArray(): FormArray {
    return this.processForm.get('steps') as FormArray;
  }

  get testimonialsArray(): FormArray {
    return this.testimonialsForm.get('testimonials') as FormArray;
  }

  get faqsArray(): FormArray {
    return this.faqForm.get('faqs') as FormArray;
  }

  // Helper para obtener controles como FormGroup
  getMinistryControls(): FormGroup[] {
    return this.ministriesArray.controls as FormGroup[];
  }

  getStatisticControls(): FormGroup[] {
    return this.statisticsArray.controls as FormGroup[];
  }

  getProcessStepControls(): FormGroup[] {
    return this.processStepsArray.controls as FormGroup[];
  }

  getTestimonialControls(): FormGroup[] {
    return this.testimonialsArray.controls as FormGroup[];
  }

  getFAQControls(): FormGroup[] {
    return this.faqsArray.controls as FormGroup[];
  }

  // ==================== MÉTODOS CRUD PARA MINISTERIOS ====================
/*   openMinistryModal(ministry?: any): void {
    this.currentMinistry = ministry ? { ...ministry } : this.getEmptyMinistry();
    this.showMinistryModal = true;
  } */

  getEmptyMinistry(): any {
    return {
      id: '',
      name: '',
      description: '',
      icon: '❤️',
      image: 'assets/imagenes/placeholder.jpg',
      colorFrom: '#3b82f6',
      colorTo: '#8b5cf6',
      features: [],
      schedule: 'Reuniones semanales',
      location: 'Templo Principal',
      leader: '',
      contactEmail: '',
      requirements: [],
      status: 'active',
      volunteerCount: 0,
      impactStats: 'Impactando vidas'
    };
  }

  closeMinistryModal(): void {
    this.showMinistryModal = false;
    this.currentMinistry = null;
  }

  saveMinistry(): void {
    if (this.currentMinistry) {
      const ministryForm = this.createMinistryForm(this.currentMinistry);

      if (this.currentMinistry.id) {
        // Actualizar ministerio existente
        const index = this.ministriesArray.controls.findIndex(
          (c: AbstractControl) => (c as FormGroup).get('id')?.value === this.currentMinistry.id
        );

        if (index >= 0) {
          this.ministriesArray.at(index).patchValue(this.currentMinistry);
          this.showToastMessage('Ministerio actualizado correctamente');
        }
      } else {
        // Agregar nuevo ministerio
        this.currentMinistry.id = this.generateId();
        this.ministriesArray.push(ministryForm);
        this.showToastMessage('Ministerio agregado correctamente');
      }

      this.closeMinistryModal();
    }
  }

  deleteMinistry(index: number): void {
    if (confirm('¿Estás seguro de eliminar este ministerio?')) {
      this.ministriesArray.removeAt(index);
      this.showToastMessage('Ministerio eliminado correctamente');
    }
  }

  duplicateMinistry(index: number): void {
    const ministry = this.ministriesArray.at(index).value;
    const newMinistry = { ...ministry, id: this.generateId(), name: `${ministry.name} (Copia)` };
    this.ministriesArray.insert(index + 1, this.createMinistryForm(newMinistry));
    this.showToastMessage('Ministerio duplicado correctamente');
  }

  // ==================== MÉTODOS CRUD PARA ESTADÍSTICAS ====================
  openStatisticModal(statistic?: any): void {
    this.currentStatistic = statistic ? { ...statistic } : null;
    this.showStatisticModal = true;
  }

  closeStatisticModal(): void {
    this.showStatisticModal = false;
    this.currentStatistic = null;
  }

  saveStatistic(): void {
    if (this.currentStatistic) {
      const statisticForm = this.createStatisticForm(this.currentStatistic);

      if (this.currentStatistic.id) {
        const index = this.statisticsArray.controls.findIndex(
          (c: AbstractControl) => (c as FormGroup).get('id')?.value === this.currentStatistic.id
        );

        if (index >= 0) {
          this.statisticsArray.at(index).patchValue(this.currentStatistic);
          this.showToastMessage('Estadística actualizada correctamente');
        }
      } else {
        this.currentStatistic.id = this.generateId();
        this.statisticsArray.push(statisticForm);
        this.showToastMessage('Estadística agregada correctamente');
      }

      this.closeStatisticModal();
    }
  }

  // ==================== MÉTODOS CRUD PARA TESTIMONIOS ====================
  openTestimonialModal(testimonial?: any): void {
    this.currentTestimonial = testimonial ? { ...testimonial } : null;
    this.showTestimonialModal = true;
  }

  closeTestimonialModal(): void {
    this.showTestimonialModal = false;
    this.currentTestimonial = null;
  }

  saveTestimonial(): void {
    if (this.currentTestimonial) {
      const testimonialForm = this.createTestimonialForm(this.currentTestimonial);

      if (this.currentTestimonial.id) {
        const index = this.testimonialsArray.controls.findIndex(
          (c: AbstractControl) => (c as FormGroup).get('id')?.value === this.currentTestimonial.id
        );

        if (index >= 0) {
          this.testimonialsArray.at(index).patchValue(this.currentTestimonial);
          this.showToastMessage('Testimonio actualizado correctamente');
        }
      } else {
        this.currentTestimonial.id = this.generateId();
        this.testimonialsArray.push(testimonialForm);
        this.showToastMessage('Testimonio agregado correctamente');
      }

      this.closeTestimonialModal();
    }
  }

  // ==================== MÉTODOS CRUD PARA FAQs ====================
  openFAQModal(faq?: any): void {
    this.currentFAQ = faq ? { ...faq } : null;
    this.showFAQModal = true;
  }

  closeFAQModal(): void {
    this.showFAQModal = false;
    this.currentFAQ = null;
  }

  saveFAQ(): void {
    if (this.currentFAQ) {
      const faqForm = this.createFAQForm(this.currentFAQ);

      if (this.currentFAQ.id) {
        const index = this.faqsArray.controls.findIndex(
          (c: AbstractControl) => (c as FormGroup).get('id')?.value === this.currentFAQ.id
        );

        if (index >= 0) {
          this.faqsArray.at(index).patchValue(this.currentFAQ);
          this.showToastMessage('Pregunta frecuente actualizada correctamente');
        }
      } else {
        this.currentFAQ.id = this.generateId();
        this.faqsArray.push(faqForm);
        this.showToastMessage('Pregunta frecuente agregada correctamente');
      }

      this.closeFAQModal();
    }
  }

  // ==================== MÉTODOS AUXILIARES ====================
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    window.scrollTo(0, 0);
  }

  togglePreviewMode(): void {
    this.isPreviewMode = !this.isPreviewMode;
  }

  applyColorPreset(target: string, presetIndex: number): void {
    const preset = this.colorPresets[presetIndex];

    switch (target) {
      case 'ministry':
        if (this.currentMinistry) {
          this.currentMinistry.colorFrom = preset.from;
          this.currentMinistry.colorTo = preset.to;
        }
        break;
      case 'hero':
        this.heroForm.patchValue({
          backgroundGradient: {
            from: preset.from,
            via: this.mixColors(preset.from, preset.to),
            to: '#000000'
          }
        });
        break;
    }
  }

  mixColors(color1: string, color2: string): string {
    return color2;
  }

  toggleFeature(feature: string, isChecked: boolean): void {
    if (!this.currentMinistry.features) {
      this.currentMinistry.features = [];
    }

    if (isChecked && !this.currentMinistry.features.includes(feature)) {
      this.currentMinistry.features.push(feature);
    } else if (!isChecked) {
      this.currentMinistry.features = this.currentMinistry.features.filter((f: string) => f !== feature);
    }
  }

  toggleRequirement(requirement: string, isChecked: boolean): void {
    if (!this.currentMinistry.requirements) {
      this.currentMinistry.requirements = [];
    }

    if (isChecked && !this.currentMinistry.requirements.includes(requirement)) {
      this.currentMinistry.requirements.push(requirement);
    } else if (!isChecked) {
      this.currentMinistry.requirements = this.currentMinistry.requirements.filter((r: string) => r !== requirement);
    }
  }

  // ==================== MÉTODOS PARA DATOS POR DEFECTO ====================
  getDefaultMinisterios(): any[] {
    return [
      {
        id: this.generateId(),
        name: 'Ministerio Escuela Bíblica',
        description: 'Enseñanza bíblica formativa para todas las edades. Ofrecemos estudios profundos, grupos pequeños y formación espiritual continua.',
        icon: '📚',
        image: 'assets/imagenes/ministerio-1.jpg',
        colorFrom: '#3b82f6',
        colorTo: '#8b5cf6',
        features: ['Reuniones semanales', 'Capacitaciones', 'Material incluido'],
        schedule: 'Miércoles 19:00, Sábados 10:00',
        location: 'Aula Principal',
        leader: 'Pastor Juan Pérez',
        contactEmail: 'escuelabiblica@iglesia.com',
        requirements: ['Mayor de 18 años', 'Disponibilidad semanal'],
        status: 'active',
        volunteerCount: 15,
        impactStats: '50+ estudiantes formados'
      },
      {
        id: this.generateId(),
        name: 'Ministerio de Música',
        description: 'Equipo musical y de alabanza que lidera el culto dominical y eventos especiales. Incluye vocalistas, músicos y equipo técnico.',
        icon: '🎵',
        image: 'assets/imagenes/ministerio-6.jpg',
        colorFrom: '#ec4899',
        colorTo: '#f472b6',
        features: ['Ensayo semanal', 'Eventos especiales', 'Equipo profesional'],
        schedule: 'Jueves 20:00, Domingos 08:00',
        location: 'Sala de Música',
        leader: 'Luis Rodríguez',
        contactEmail: 'musica@iglesia.com',
        requirements: ['Conocimiento musical', 'Audición'],
        status: 'active',
        volunteerCount: 25,
        impactStats: 'Liderando 100+ alabanzas'
      }
    ];
  }

  getDefaultStatistics(): any[] {
    return [
      { id: this.generateId(), value: '8+', icon: '✨', label: 'Ministerios Activos', color: '#8b5cf6' },
      { id: this.generateId(), value: '50+', icon: '👥', label: 'Voluntarios Activos', color: '#3b82f6' },
      { id: this.generateId(), value: '100+', icon: '❤️', label: 'Vidas Impactadas', color: '#ec4899' },
      { id: this.generateId(), value: '7', icon: '📅', label: 'Días de Servicio', color: '#10b981' }
    ];
  }

  getDefaultProcessSteps(): any[] {
    return [
      { id: this.generateId(), number: 1, icon: '🔍', title: 'Explora', description: 'Conoce cada ministerio, sus actividades y requisitos. Puedes asistir a una reunión informativa.', colorFrom: '#4f46e5', colorTo: '#ec4899' },
      { id: this.generateId(), number: 2, icon: '🤝', title: 'Conecta', description: 'Habla con el líder del ministerio y asiste a las capacitaciones iniciales. Conoce al equipo.', colorFrom: '#8b5cf6', colorTo: '#06b6d4' },
      { id: this.generateId(), number: 3, icon: '🎯', title: 'Sirve', description: 'Comienza a servir según tus dones y disponibilidad. Crecerás mientras impactas vidas.', colorFrom: '#ec4899', colorTo: '#f472b6' }
    ];
  }

  getDefaultTestimonials(): any[] {
    return [
      {
        id: this.generateId(),
        name: 'María González',
        role: 'Voluntaria por 3 años',
        ministry: 'Ministerio de Niños',
        content: 'Servir en el ministerio de niños ha transformado mi vida. Ver la fe de los más pequeños es inspirador.',
        rating: 5,
        date: '2024-01-15'
      },
      {
        id: this.generateId(),
        name: 'Carlos Rodríguez',
        role: 'Líder de Alabanza',
        ministry: 'Ministerio de Música',
        content: 'El ministerio de música me permitió descubrir mi propósito. Ahora uso mi talento para glorificar a Dios.',
        rating: 5,
        date: '2024-02-20'
      }
    ];
  }

  getDefaultFAQs(): any[] {
    return [
      {
        id: this.generateId(),
        icon: '❓',
        question: '¿Necesito experiencia previa para unirme a un ministerio?',
        answer: '¡No! Todos los ministerios ofrecen capacitación y acompañamiento. Lo más importante es tu disposición a servir.',
        category: 'General'
      },
      {
        id: this.generateId(),
        icon: '⏰',
        question: '¿Cuánto tiempo debo comprometer?',
        answer: 'Cada ministerio tiene diferentes requerimientos de tiempo. Puedes comprometerte desde unas pocas horas al mes hasta roles más regulares.',
        category: 'General'
      }
    ];
  }

  // ==================== MÉTODOS PARA GUARDAR ====================
  saveAll(): void {
    try {
      const allData = {
        hero: this.heroForm.value,
        ministries: this.ministriesArray.value,
        statistics: this.statisticsArray.value,
        process: this.processForm.value,
        testimonials: this.testimonialsArray.value,
        faqs: this.faqsArray.value,
        pageContent: this.pageContentForm.value
      };

      // Guardar en localStorage
      localStorage.setItem('ministeriosAdminData', JSON.stringify(allData));

      // También actualizar el DataService usando updateAllMinisterios
      if (this.dataService['updateAllMinisterios']) {
        this.dataService['updateAllMinisterios'](this.ministriesArray.value);
      }

      this.showToastMessage('✅ Todos los cambios guardados exitosamente', 'success');
    } catch (error) {
      this.showToastMessage('❌ Error al guardar los cambios', 'error');
      console.error('Error saving data:', error);
    }
  }

  resetToDefaults(): void {
    if (confirm('¿Estás seguro de restablecer todos los datos a los valores por defecto? Esto no se puede deshacer.')) {
      this.loadAllData();
      this.showToastMessage('Datos restablecidos a valores por defecto', 'info');
    }
  }

  exportData(): void {
    const allData = {
      hero: this.heroForm.value,
      ministries: this.ministriesArray.value,
      statistics: this.statisticsArray.value,
      process: this.processForm.value,
      testimonials: this.testimonialsArray.value,
      faqs: this.faqsArray.value,
      pageContent: this.pageContentForm.value
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `ministerios-backup-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
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

          // Cargar los datos importados
          if (data.hero) this.loadHeroData(data.hero);
          if (data.ministries) this.loadMinistriesData(data.ministries);
          if (data.statistics) this.loadStatisticsData(data.statistics);
          if (data.process) this.loadProcessData(data.process);
          if (data.testimonials) this.loadTestimonialsData(data.testimonials);
          if (data.faqs) this.loadFAQData(data.faqs);
          if (data.pageContent) this.loadPageContentData(data.pageContent);

          this.showToastMessage('Datos importados exitosamente', 'success');
        } catch (error) {
          this.showToastMessage('Error al importar el archivo', 'error');
          console.error('Import error:', error);
        }
      };

      reader.readAsText(file);
    }
  }

  // ==================== MÉTODOS PARA CONTADORES ====================
  getActiveMinistriesCount(): number {
    return this.ministriesArray.value.filter((m: any) => m.status === 'active').length;
  }

  getTotalVolunteers(): number {
    return this.ministriesArray.value.reduce((total: number, m: any) => total + (m.volunteerCount || 0), 0);
  }

  getFeaturedMinistriesCount(): number {
    return this.ministriesArray.value.filter((m: any) =>
      m.features && m.features.includes('Eventos especiales')
    ).length;
  }

  getAverageRating(): number {
    if (this.testimonialsArray.length === 0) return 0;

    const total = this.testimonialsArray.value.reduce((sum: number, t: any) => sum + (t.rating || 0), 0);
    return Math.round((total / this.testimonialsArray.length) * 10) / 10;
  }

  // ==================== MÉTODOS PARA PASOS DEL PROCESO ====================
  addProcessStep(): void {
    const newStep: any = {
      id: this.generateId(),
      number: this.processStepsArray.length + 1,
      icon: '🔍',
      title: 'Nuevo Paso',
      description: 'Descripción del nuevo paso',
      colorFrom: '#3b82f6',
      colorTo: '#8b5cf6'
    };
    this.processStepsArray.push(this.createProcessStepForm(newStep));
  }

  // ==================== MÉTODOS PARA OBTENER ETIQUETAS ====================
  getStatusLabel(statusValue: string): string {
    const status = this.ministryStatuses.find(s => s.value === statusValue);
    return status ? status.label : 'Desconocido';
  }

  // ==================== MÉTODOS PARA FORMULARIOS MODALES ====================
  initializeModalForms(): void {
    if (this.showMinistryModal && !this.currentMinistry) {
      this.currentMinistry = this.getEmptyMinistry();
    }
  }

  openMinistryModal(ministry?: any): void {
  this.currentMinistry = ministry ? { ...ministry } : this.getEmptyMinistry();
  this.ministryModalForm = this.createMinistryModalForm(this.currentMinistry);
  this.showMinistryModal = true;
}
createMinistryModalForm(ministry?: any): FormGroup {
  return this.fb.group({
    id: [ministry?.id || this.generateId()],
    name: [ministry?.name || '', Validators.required],
    description: [ministry?.description || '', Validators.required],
    icon: [ministry?.icon || '❤️', Validators.required],
    image: [ministry?.image || 'assets/imagenes/placeholder.jpg'],
    colorFrom: [ministry?.colorFrom || '#3b82f6'],
    colorTo: [ministry?.colorTo || '#8b5cf6'],
    features: [ministry?.features || []],
    schedule: [ministry?.schedule || 'Reuniones semanales'],
    location: [ministry?.location || 'Templo Principal'],
    leader: [ministry?.leader || ''],
    contactEmail: [ministry?.contactEmail || ''],
    requirements: [ministry?.requirements || []],
    status: [ministry?.status || 'active', Validators.required],
    volunteerCount: [ministry?.volunteerCount || 0],
    impactStats: [ministry?.impactStats || 'Impactando vidas']
  });
}
}