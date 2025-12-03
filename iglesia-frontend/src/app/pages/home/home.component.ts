import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { CelebrationsSectionComponent } from '../../components/celebrations-section/celebrations-section.component';
import { MinistriesComponent } from '../../components/ministries/ministries.component';
import { MeetingDaysComponent } from '../../components/meeting-days/meeting-days.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, HeroComponent, CelebrationsSectionComponent, MinistriesComponent, MeetingDaysComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
  featuredEvents = [
    {
      title: 'Servicio Dominical',
      date: 'Todos los Domingos - 10:00 AM',
      description: 'Únete a nosotros para adoración, enseñanza y comunión.'
    },
    {
      title: 'Estudio Bíblico',
      date: 'Miércoles - 7:00 PM',
      description: 'Estudio profundo de la palabra de Dios en comunidad.'
    },
    {
      title: 'Jóvenes',
      date: 'Viernes - 7:00 PM',
      description: 'Reunión para jóvenes con música, enseñanza y compañerismo.'
    }
  ];

  ministries = [
    {
      name: 'Ministerio de Jóvenes',
      description: 'Un espacio para jóvenes donde pueden crecer en su fe y formar amistades significativas.'
    },
    {
      name: 'Ministerio de Niños',
      description: 'Enseñamos a los niños sobre el amor de Dios de manera divertida y creativa.'
    },
    {
      name: 'Ministerio de Mujeres',
      description: 'Un lugar donde las mujeres pueden conectarse, crecer y servir juntas.'
    },
    {
      name: 'Ministerio de Hombres',
      description: 'Reuniones y actividades diseñadas para fortalecer a los hombres en su caminar con Cristo.'
    },
    {
      name: 'Ministerio de Música',
      description: 'Usamos nuestros talentos musicales para adorar y glorificar a Dios.'
    },
    {
      name: 'Ministerio de Servicio',
      description: 'Servimos a nuestra comunidad local y global con amor y compasión.'
    }
  ];
}
