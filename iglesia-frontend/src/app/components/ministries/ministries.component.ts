import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ministries',
  imports: [CommonModule],
  templateUrl: './ministries.component.html',
  styleUrls: ['./ministries.component.css']
})
export class MinistriesComponent implements OnInit {
  ministries: Array<{ name: string; description: string; contact?: string; icon?: string; image?: string; animated?: boolean }> = [];

  constructor() {}

  ngOnInit() {
    this.loadMinistries();
  }

  loadMinistries() {
    this.ministries = [
      {
        name: 'Ministerio Escuela Bíblica',
        description: 'Enseñanza bíblica formativa para todas las edades; estudios y formación espiritual.',
        icon: 'book',
        image: 'assets/imagenes/ministerio-1.jpg',
        animated: false
      },
      {
        name: 'Ministerio Efraín',
        description: 'Acompañamiento pastoral y programas de apoyo comunitario bajo el nombre Efraín.',
        icon: 'people',
        image: 'assets/imagenes/ministerio-2.jpg',
        animated: false
      },
      {
        name: 'Ministerio de Jóvenes',
        description: 'Encuentros, estudios y actividades para jóvenes que buscan crecer en su fe.',
        icon: 'spark',
        image: 'assets/imagenes/ministerio-3.jpg',
        animated: false
      },
      {
        name: 'Remendando Redes',
        description: 'Iniciativa de apoyo y reinserción social, trabajo comunitario y redes de ayuda.',
        icon: 'network',
        image: 'assets/imagenes/ministerio-4.jpg',
        animated: false
      },
      {
        name: 'Ministerio de Oración',
        description: 'Grupo dedicado a la intercesión y acompañamiento espiritual en oración.',
        icon: 'spark',
        image: 'assets/imagenes/ministerio-5.jpg',
        animated: false
      },
      {
        name: 'Ministerio de Música',
        description: 'Equipo musical y de alabanza que lidera el culto y los eventos musicales.',
        icon: 'people',
        image: 'assets/imagenes/ministerio-6.jpg',
        animated: false
      },
      {
        name: 'Ministerio de Niños',
        description: 'Actividades, enseñanza y cuidado orientado a los niños de la iglesia.',
        icon: 'book',
        image: 'assets/imagenes/ministerio-7.jpg',
        animated: false
      },
      {
        name: 'Servicio Comunitario',
        description: 'Proyectos y acciones sociales para ayudar a la comunidad local.',
        icon: 'network',
        image: 'assets/imagenes/ministerio-8.jpg',
        animated: false
      }
    ];
  }

  trackByIndex(index: number) {
    return index;
  }
}
