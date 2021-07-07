import { Component } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import * as moment from 'moment';
import 'moment-duration-format';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bjj-score-marker';

  // tempo
  private subscriptionRaiz: Subscription;
  minutosToShow: any;
  segundosToShow: any;
  segundos: number = 361; // 6min e 1s
  clockAlreadyRunning: boolean;
  tempoDeLuta: number = 361;

  // placar
  pontosAtletaA: number = 0;
  vantagensAtletaA: number = 0;
  punicoesAtletaA: number = 0;

  pontosAtletaB: number = 0;
  vantagensAtletaB: number = 0;
  punicoesAtletaB: number = 0;

  vencedor: string;

  // alerta

  warningSound: any;
  soundActivated: boolean = true;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.countdownRaiz();
  }

  countdownRaiz() {
    this.segundos = this.segundos - 1;
    this.minutosToShow = moment.duration(this.segundos, "seconds").minutes();
    this.segundosToShow = moment.duration(this.segundos, "seconds").seconds();

    if (this.segundosToShow < 10) {
      this.segundosToShow = '0' + this.segundosToShow;
    }

    if (this.segundos == 0) {
      this.playWarningSound();
      // this.identificarVencedor();
      // this.snackBar.open('O vencedor é o atleta ' + this.vencedor, 'OK', {
      //   duration: 20000
      // });

      this.subscriptionRaiz.unsubscribe();
    }
  }
  playWarningSound() {
    this.warningSound = new Audio();
    this.warningSound.src = "assets/police-whistle.wav";
    this.warningSound.load();
    this.warningSound.play();
  }

  resetarCountdownRaiz() {
    this.subscriptionRaiz.unsubscribe();
    this.clockAlreadyRunning = false;
    this.segundos = this.tempoDeLuta;
    this.countdownRaiz();
    this.resetarPontuacoes();
  }

  pausarCountdownRaiz() {
    this.subscriptionRaiz.unsubscribe();
    this.clockAlreadyRunning = false;
  }

  retomarCountdownRaiz() {
    if (!this.clockAlreadyRunning) {
      this.subscriptionRaiz = interval(1000)
        .subscribe(x => { this.countdownRaiz(); });
      this.clockAlreadyRunning = true;
    }
  }

  ngOnDestroy() {
    this.subscriptionRaiz.unsubscribe();
  }

  mudarPontos(atleta: string, operacao: string) {
    if (atleta === 'A') {
      if (operacao === 'add') {
        this.pontosAtletaA = this.pontosAtletaA + 1;
      } else {
        if (this.pontosAtletaA > 0) {
          this.pontosAtletaA = this.pontosAtletaA - 1;
        }
      }
    } else {
      if (operacao === 'add') {
        this.pontosAtletaB = this.pontosAtletaB + 1;
      } else {
        if (this.pontosAtletaB > 0) {
          this.pontosAtletaB = this.pontosAtletaB - 1;
        }
      }
    }
  }

  mudarVantagens(atleta: string, operacao: string) {
    if (atleta === 'A') {
      if (operacao === 'add') {
        this.vantagensAtletaA = this.vantagensAtletaA + 1;
      } else {
        if (this.vantagensAtletaA > 0) {
          this.vantagensAtletaA = this.vantagensAtletaA - 1;
        }
      }
    } else {
      if (operacao === 'add') {
        this.vantagensAtletaB = this.vantagensAtletaB + 1;
      } else {
        if (this.vantagensAtletaB > 0) {
          this.vantagensAtletaB = this.vantagensAtletaB - 1;
        }
      }
    }
  }

  mudarPunicoes(atleta: string, operacao: string) {
    if (atleta === 'A') {
      if (operacao === 'add') {
        this.punicoesAtletaA = this.punicoesAtletaA + 1;
      } else {
        if (this.punicoesAtletaA > 0) {
          this.punicoesAtletaA = this.punicoesAtletaA - 1;
        }
      }
    } else {
      if (operacao === 'add') {
        this.punicoesAtletaB = this.punicoesAtletaB + 1;
      } else {
        if (this.punicoesAtletaB > 0) {
          this.punicoesAtletaB = this.punicoesAtletaB - 1;
        }
      }
    }
  }

  identificarVencedor() {
    if (this.pontosAtletaA == this.pontosAtletaB) {
      // critério de vantagens
      if (this.vantagensAtletaA == this.vantagensAtletaB) {
        // critério de punições
        if (this.punicoesAtletaA > this.punicoesAtletaB) {
          this.vencedor = 'B';
        } else {
          this.vencedor = 'A';
        }
      } else {
        if (this.vantagensAtletaA > this.vantagensAtletaB) {
          this.vencedor = 'A';
        } else {
          this.vencedor = 'B';
        }
      }
    } else {
      if (this.pontosAtletaA > this.pontosAtletaB) {
        this.vencedor = 'A';
      } else {
        this.vencedor = 'B';
      }
    }
  }

  resetarPontuacoes() {
    this.pontosAtletaA = 0;
    this.pontosAtletaB = 0;
    this.vantagensAtletaA = 0;
    this.vantagensAtletaB = 0;
    this.punicoesAtletaA = 0;
    this.punicoesAtletaB = 0;
  }

  changeTempoLuta(tempo: any) {
    this.tempoDeLuta = tempo * 60 + 1;
    if (this.subscriptionRaiz) {
      this.resetarCountdownRaiz();
    } else {
      this.clockAlreadyRunning = false;
      this.segundos = this.tempoDeLuta;
      this.countdownRaiz();
      this.resetarPontuacoes();
    }
  }

}
