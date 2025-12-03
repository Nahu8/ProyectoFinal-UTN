import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements AfterViewInit {
  isPlaying = false;
  showPlayButton = false;
  onVideoLoaded() {
    // Video cargado correctamente
    const video = this.videoElement.nativeElement;
    video.classList.add('video-visible');
  }

  onVideoError() {
    // Si hay error con un video, pasar al siguiente
    console.error('Error cargando video:', this.videoSrc);
    this.playNextVideo();
  }
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  // Lista de videos disponibles
  videos = [
    'assets/videos/MinisteriosServicios Pantalla.mp4'
  ];

  currentVideoIndex = 0;
  videoSrc = this.videos[this.currentVideoIndex];

  ngAfterViewInit() {
    this.setupVideoRotation();

    // Ensure the video is loaded and attempt to play once view is ready.
    const video = this.videoElement.nativeElement;
    try {
      // Ensure muted and playsInline flags are set programmatically
      // (some browsers require the muted property to be true on the element
      // object before attempting autoplay)
      try {
        video.muted = true;
        video.playsInline = true as any;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
      } catch (e) {
        // ignore if properties can't be set for any reason
      }
      // force load in case browser didn't start loading the <source>
      video.load();
      // try to play (muted allows autoplay in most browsers)
      video.play().catch(err => {
        console.warn('Autoplay blocked or failed on hero video:', err);
        // Retry play a few times in case of race conditions when navigating via SPA
        let attempts = 0;
        const maxAttempts = 10;
        const retryInterval = setInterval(() => {
          attempts += 1;
          video.play().then(() => {
            clearInterval(retryInterval);
            this.isPlaying = true;
            this.showPlayButton = false;
          }).catch(() => {
            if (attempts >= maxAttempts) {
              clearInterval(retryInterval);
              // show fallback play button so the user can explicitly start playback
              this.showPlayButton = true;
            }
          });
        }, 1000);

        // Also try once when the user first interacts with the document
        const onFirstInteraction = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', onFirstInteraction);
          document.removeEventListener('keydown', onFirstInteraction);
        };
        document.addEventListener('click', onFirstInteraction, { once: true });
        document.addEventListener('keydown', onFirstInteraction, { once: true });
      });
    } catch (e) {
      console.warn('Error forcing load/play on hero video:', e);
    }
  }

  playVideo() {
    const video = this.videoElement.nativeElement;
    // When user explicitly requests playback, try to unmute if desired
    video.play().then(() => {
      this.isPlaying = true;
      this.showPlayButton = false;
    }).catch(error => {
      console.log('Error al reproducir el video:', error);
      // If user triggered play and it still fails, keep the fallback visible
      this.showPlayButton = true;
    });
  }

  private setupVideoRotation() {
    const video = this.videoElement.nativeElement;

    // Intentar reproducir cuando se cargue el metadata
    const tryPlay = () => {
      this.playVideo();
    };
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('canplay', tryPlay);

    // Cuando un video termine, pasar al siguiente
    video.addEventListener('ended', () => {
      this.playNextVideo();
    });

    // También rotar cuando el video esté en bucle (por si acaso)
    video.addEventListener('timeupdate', () => {
      // Si el video está cerca del final (último 1%), pasar al siguiente
      if (video.currentTime > video.duration - 0.5) {
        this.playNextVideo();
      }
    });
  }

  private playNextVideo() {
    // Incrementar índice y volver al principio si es necesario
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videos.length;
    this.videoSrc = this.videos[this.currentVideoIndex];

    // Forzar la actualización del src y reproducir
    const video = this.videoElement.nativeElement;
    video.load();

    setTimeout(() => {
      video.play().catch(error => {
        console.log('Error al reproducir el siguiente video:', error);
      });
    }, 100);
  }
}