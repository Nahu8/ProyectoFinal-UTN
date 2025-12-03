import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

interface Ministry {
  id: string;
  name: string;
  description: string;
  icon?: string;
  image?: string;
}

interface Statistic {
  value: string;
  icon: string;
  label: string;
}

interface Testimonial {
  name: string;
  role: string;
  ministry: string;
  content: string;
}

interface FAQ {
  icon: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-ministerios',
  templateUrl: './ministerios.component.html',
  styleUrls: ['./ministerios.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MinisteriosComponent implements OnInit {
  sectionTitle = 'Nuestros Ministerios';
  sectionSubtitle = 'Descubre cómo puedes servir y crecer en nuestra comunidad. Cada ministerio es una oportunidad para usar tus dones y hacer una diferencia eterna.';

  statistics: Statistic[] = [
    { value: '8+', icon: '✨', label: 'Ministerios Activos' },
    { value: '50+', icon: '👥', label: 'Voluntarios Activos' },
    { value: '100+', icon: '❤️', label: 'Vidas Impactadas' },
    { value: '7', icon: '📅', label: 'Días de Servicio' }
  ];

  ministries: Ministry[] = [];

  testimonials: Testimonial[] = [
    {
      name: 'María González',
      role: 'Voluntaria por 3 años',
      ministry: 'Ministerio de Niños',
      content: 'Servir en el ministerio de niños ha transformado mi vida. Ver la fe de los más pequeños es inspirador.'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Líder de Alabanza',
      ministry: 'Ministerio de Música',
      content: 'El ministerio de música me permitió descubrir mi propósito. Ahora uso mi talento para glorificar a Dios.'
    },
    {
      name: 'Ana Martínez',
      role: 'Coordinadora',
      ministry: 'Servicio Comunitario',
      content: 'Impactar nuestra comunidad local me ha mostrado el verdadero significado del amor al prójimo.'
    }
  ];

  faqs: FAQ[] = [
    {
      icon: '❓',
      question: '¿Necesito experiencia previa para unirme a un ministerio?',
      answer: '¡No! Todos los ministerios ofrecen capacitación y acompañamiento. Lo más importante es tu disposición a servir.'
    },
    {
      icon: '⏰',
      question: '¿Cuánto tiempo debo comprometer?',
      answer: 'Cada ministerio tiene diferentes requerimientos de tiempo. Puedes comprometerte desde unas pocas horas al mes hasta roles más regulares.'
    },
    {
      icon: '🎁',
      question: '¿Cómo descubro mis dones para servir?',
      answer: 'Ofrecemos pruebas de dones espirituales y acompañamiento personal para ayudarte a descubrir dónde puedes servir mejor.'
    },
    {
      icon: '👥',
      question: '¿Puedo probar un ministerio antes de comprometerme?',
      answer: '¡Sí! Animamos a todos a asistir a reuniones informativas y participar en actividades iniciales antes de comprometerse formalmente.'
    }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadMinisterios();
  }

  loadMinisterios(): void {
    // Primero intenta obtener los ministerios del DataService
    const ministeriosFromService = this.dataService.getMinisterios();
    
    if (ministeriosFromService && ministeriosFromService.length > 0) {
      this.ministries = ministeriosFromService.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        icon: m.icon,
        image: m.image
      }));
    } else {
      // Si no hay ministerios cargados, usa datos por defecto
      this.ministries = this.getDefaultMinisterios();
    }
  }

  getDefaultMinisterios(): Ministry[] {
    return [
      {
        id: '1',
        name: 'Ministerio Escuela Bíblica',
        description: 'Enseñanza bíblica formativa para todas las edades. Ofrecemos estudios profundos, grupos pequeños y formación espiritual continua.',
        icon: 'book',
        image: 'assets/imagenes/ministerio-1.jpg'
      },
      {
        id: '2',
        name: 'Ministerio Efraín',
        description: 'Acompañamiento pastoral y programas de apoyo comunitario. Ayudamos a familias en situaciones difíciles con consejería y recursos.',
        icon: 'people',
        image: 'assets/imagenes/ministerio-2.jpg'
      },
      {
        id: '3',
        name: 'Ministerio de Jóvenes',
        description: 'Encuentros semanales, retiros espirituales y actividades para jóvenes que buscan crecer en su fe y formar amistades significativas.',
        icon: 'spark',
        image: 'assets/imagenes/ministerio-3.jpg'
      },
      {
        id: '4',
        name: 'Remendando Redes',
        description: 'Iniciativa de apoyo y reinserción social. Trabajamos con personas en situación de vulnerabilidad, ofreciendo esperanza y oportunidades.',
        icon: 'network',
        image: 'assets/imagenes/ministerio-4.jpg'
      },
      {
        id: '5',
        name: 'Ministerio de Oración',
        description: 'Grupo dedicado a la intercesión y acompañamiento espiritual. Organizamos vigilias de oración y grupos de intercesión por necesidades específicas.',
        icon: 'spark',
        image: 'assets/imagenes/ministerio-5.jpg'
      },
      {
        id: '6',
        name: 'Ministerio de Música',
        description: 'Equipo musical y de alabanza que lidera el culto dominical y eventos especiales. Incluye vocalistas, músicos y equipo técnico.',
        icon: 'people',
        image: 'assets/imagenes/ministerio-6.jpg'
      },
      {
        id: '7',
        name: 'Ministerio de Niños',
        description: 'Actividades, enseñanza y cuidado orientado a los niños de la iglesia. Creamos un ambiente seguro y divertido para el aprendizaje bíblico.',
        icon: 'children',
        image: 'assets/imagenes/ministerio-7.jpg'
      },
      {
        id: '8',
        name: 'Servicio Comunitario',
        description: 'Proyectos y acciones sociales para ayudar a la comunidad local. Alimentamos, vestimos y apoyamos a quienes más lo necesitan.',
        icon: 'community',
        image: 'assets/imagenes/ministerio-8.jpg'
      }
    ];
  }

  getIconSvg(iconName?: string): string {
    if (!iconName) return '❤️';
    
    const iconMap: { [key: string]: string } = {
      'book': '📚',
      'people': '👥',
      'spark': '✨',
      'network': '🌐',
      'music': '🎵',
      'prayer': '🙏',
      'children': '👶',
      'community': '🤝',
      'default': '❤️'
    };
    
    return iconMap[iconName] || iconMap['default'];
  }

  // Método para manejar errores en la carga de imágenes
  handleImageError(event: any): void {
    event.target.src = 'assets/imagenes/placeholder.jpg';
  }
}