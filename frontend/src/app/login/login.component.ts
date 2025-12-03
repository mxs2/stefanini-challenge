import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-[#F4F6F8] font-poppins text-slate-800 flex items-center justify-center p-6">

      <!-- Login Card -->
      <div class="w-full max-w-md">

        <!-- Header -->
        <div class="text-center mb-8 animate-fade-in-down">
          <div class="inline-flex items-center justify-center mb-6">
            <img src="https://stefanini.com/es/wp-content/uploads/sites/4/2022/10/Logo-Stefanini.jpeg"
                 alt="Stefanini Group"
                 class="h-14 object-contain filter drop-shadow-sm rounded-full" />
          </div>
          <h1 class="text-3xl font-bold tracking-tight text-[#004389] mb-2">
            Bem-vindo
          </h1>
          <p class="text-slate-500 font-light">
            Acesse sua conta do Agile Agent
          </p>
        </div>

        <!-- Login Form -->
        <div class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 animate-fade-in-up">

          <form (submit)="onLogin($event)" class="space-y-6">

            <!-- Email Field -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                E-mail
              </label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="seu@email.com"
                class="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent transition-all text-slate-700 placeholder-slate-400" />
            </div>

            <!-- Password Field -->
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Senha
              </label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent transition-all text-slate-700 placeholder-slate-400" />
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage()"
                 class="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 animate-fade-in text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 shrink-0">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              {{ errorMessage() }}
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              [disabled]="isLoading()"
              class="w-full py-4 bg-[#004389] hover:bg-[#003366] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-full shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:translate-y-0 tracking-wide flex items-center justify-center gap-2">
              <span *ngIf="isLoading()" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isLoading() ? 'ENTRANDO...' : 'ENTRAR' }}
            </button>

          </form>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-4 bg-white text-slate-400 uppercase tracking-wider font-medium">
                Ou
              </span>
            </div>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center">
            <p class="text-slate-500 text-sm font-light mb-4">
              Ainda não tem uma conta?
            </p>
            <a routerLink="/cadastro"
               class="inline-block px-8 py-3 text-[#004389] font-semibold border-2 border-[#004389] rounded-full hover:bg-[#004389] hover:text-white transition-all">
              CRIAR CONTA
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <div class="text-slate-400 text-xs font-light">
            Powered by <span class="font-semibold text-[#004389]">Stefanini AI</span>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    :host {
      display: block;
    }

    .font-poppins { font-family: 'Poppins', sans-serif; }

    @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
  `]
})
export class LoginComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  email = '';
  password = '';
  username = '';
  isLoading = signal(false);
  errorMessage = signal('');

  onLogin(event: Event) {
    event.preventDefault();

    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor, preencha todos os campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<{ token: string; expiresIn?: number }>('http://localhost:8080/auth/login', loginData).subscribe({
      next: (response) => {
        this.authService.setToken(response.token, response.expiresIn);
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    });
  }
}
