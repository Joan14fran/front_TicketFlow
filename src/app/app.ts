import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HealthCheckComponent } from './components/health-check/health-check';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [RouterOutlet, HealthCheckComponent],

  templateUrl: './app.html',
  styleUrl: './app.css'     
})
export class AppComponent {
  title = 'front_TicketFlow';
}
