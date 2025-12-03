import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';

// --- Interfaces ---
export interface UserStory {
  titulo: string;
  descricao: string;
  criteriosAceite: string[];
  estimativaPontos: number;
}

export interface ConfigSettings {
  openaiApiKey: string;
  jiraUrl: string;
  jiraUsername: string;
  jiraToken: string;
  jiraProjectKey: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#F4F6F8] font-poppins text-slate-800 p-6 md:p-12">

      <!-- Configuration Button -->
      <div class="fixed top-6 right-6 z-40">
        <button (click)="toggleConfigPanel()" 
                class="p-3 bg-white hover:bg-slate-50 text-[#004389] rounded-full shadow-lg border border-slate-200 transition-all hover:shadow-xl"
                title="Configuracoes">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      <!-- Configuration Panel -->
      <div *ngIf="showConfigPanel()" 
           class="fixed inset-0 flex items-center justify-center z-50 bg-[#002D5C]/40 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-[#004389]">Configuracoes do Sistema</h2>
            <button (click)="toggleConfigPanel()" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="space-y-6">
            <!-- OpenAI API Key -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">OpenAI API Key</label>
              <input type="password" 
                     [(ngModel)]="config().openaiApiKey"
                     placeholder="sk-..."
                     class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent">
              <p class="text-xs text-slate-500 mt-1">Chave de API para o modelo de linguagem (chatgpt-4o-mini)</p>
            </div>

            <!-- Jira URL -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Jira URL *</label>
              <input type="text" 
                     [(ngModel)]="config().jiraUrl"
                     placeholder="https://seu-dominio.atlassian.net"
                     class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent">
              <p class="text-xs text-slate-500 mt-1">URL base da sua instancia Jira</p>
            </div>

            <!-- Jira Username -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Jira Username *</label>
              <input type="text" 
                     [(ngModel)]="config().jiraUsername"
                     placeholder="seu-email@example.com"
                     class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent">
              <p class="text-xs text-slate-500 mt-1">Email de usuario do Jira</p>
            </div>

            <!-- Jira API Token -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Jira API Token *</label>
              <input type="password" 
                     [(ngModel)]="config().jiraToken"
                     placeholder="ATATT3xFfGF0..."
                     class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent">
              <p class="text-xs text-slate-500 mt-1">Token de API do Jira</p>
            </div>

            <!-- Jira Project Key -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Jira Project Key *</label>
              <input type="text" 
                     [(ngModel)]="config().jiraProjectKey"
                     placeholder="PROJ"
                     class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#00C0F3] focus:border-transparent">
              <p class="text-xs text-slate-500 mt-1">Chave do projeto no Jira</p>
            </div>
          </div>

          <div class="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p class="text-sm text-amber-800">
              <strong>Importante:</strong> Estas configurações sao armazenadas localmente no navegador. 
              Certifique-se de adicionar os mesmos valores no arquivo <code class="bg-amber-100 px-1 py-0.5 rounded">.env</code> do backend.
            </p>
          </div>

          <div class="mt-6 flex gap-3">
            <button (click)="toggleConfigPanel()" 
                    class="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button (click)="saveConfig()" 
                    class="flex-1 px-6 py-3 bg-[#004389] text-white rounded-lg hover:bg-[#003366] transition-colors">
              Salvar Configuracoes
            </button>
          </div>
        </div>
      </div>

      <!-- Header -->
      <header class="max-w-5xl mx-auto mb-12 animate-fade-in-down">
        <div class="flex justify-between items-center mb-8">
          <div class="flex items-center gap-4">
            <!-- Logo Stefanini -->
            <img src="https://stefanini.com/es/wp-content/uploads/sites/4/2022/10/Logo-Stefanini.jpeg"
                 alt="Stefanini Group"
                 class="h-12 md:h-14 object-contain filter drop-shadow-sm rounded-full" />
          </div>
          <!-- Logout Button -->
          <button (click)="logout()"
                  class="px-6 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm border border-slate-200 hover:border-red-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clip-rule="evenodd" />
              <path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd" />
            </svg>
            Sair
          </button>
        </div>
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-[#004389] mb-4">
            Agile Agent <span class="text-[#00C0F3] text-sm align-top font-medium px-2 py-0.5 bg-blue-50 rounded-full">AI Powered</span>
          </h1>
          <p class="text-slate-500 max-w-2xl mx-auto font-light">
            Transforme documentos de requisitos em User Stories padronizadas e sincronize com o Jira em segundos.
          </p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-5xl mx-auto space-y-8">

        <!-- Step 1: Upload Area -->
        <div *ngIf="stories().length === 0"
             class="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5">
          <div class="p-10 md:p-16 text-center">

            <div *ngIf="!isLoading(); else loadingState">
              <div class="mb-8 group cursor-pointer" (click)="fileInput.click()">
                <div class="w-24 h-24 bg-[#F0F7FF] text-[#004389] rounded-full flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-semibold text-[#004389] mb-2">Upload de Requisitos</h3>
                <p class="text-slate-400 font-light">Arraste seu PDF/DOCX ou clique para selecionar</p>
              </div>

              <input #fileInput type="file" (change)="onFileSelected($event)" class="hidden" accept=".pdf,.docx,.txt">

              <button (click)="fileInput.click()"
                      class="px-10 py-4 bg-[#004389] hover:bg-[#003366] hover:cursor-pointer text-white font-medium rounded-full shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-1 active:translate-y-0 tracking-wide">
                SELECIONAR ARQUIVO
              </button>
            </div>

            <!-- Loading State -->
            <ng-template #loadingState>
              <div class="flex flex-col items-center justify-center py-8 animate-pulse">
                <div class="w-16 h-16 border-4 border-[#F0F7FF] border-t-[#00C0F3] rounded-full animate-spin mb-6"></div>
                <h3 class="text-xl font-semibold text-[#004389]">Processando com IA...</h3>
                <p class="text-slate-400 mt-2 font-light">Estamos lendo e estruturando suas stories.</p>
              </div>
            </ng-template>

            <!-- Error Message -->
            <div *ngIf="errorMessage()" class="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center justify-center gap-2 animate-fade-in text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              {{ errorMessage() }}
            </div>
          </div>
        </div>

        <!-- Step 2: Review & Sync Area -->
        <div *ngIf="stories().length > 0" class="animate-fade-in-up">

          <div class="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
            <div>
              <h2 class="text-2xl font-bold text-[#004389]">Stories Geradas ({{ stories().length }})</h2>
              <p class="text-slate-500 text-sm font-light">Revise os detalhes antes da sincronização.</p>
            </div>
            <div class="flex gap-3">
              <button (click)="reset()" class="px-5 py-2.5 text-slate-500 hover:text-[#004389] hover:bg-white rounded-lg transition-colors font-medium text-sm border border-transparent hover:border-slate-200">
                Cancelar
              </button>
              <button (click)="syncToJira()"
                      [disabled]="isSyncing()"
                      class="px-8 py-2.5 bg-[#00C0F3] hover:bg-[#00A8D6] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md shadow-blue-200 transition-all flex items-center gap-2">
                <span *ngIf="isSyncing()" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ isSyncing() ? 'Sincronizando...' : 'Enviar para o Jira' }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6">
            <div *ngFor="let story of stories(); let i = index"
                 class="group bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:border-[#00C0F3] hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 relative">

              <!-- Badge de Pontos -->
              <div class="absolute top-8 right-8 flex items-center gap-2">
                 <span class="px-3 py-1 bg-[#F0F7FF] text-[#004389] text-xs font-bold uppercase tracking-wider rounded-md border border-blue-100">
                   {{ story.estimativaPontos }} pts
                 </span>
                 <button (click)="removeStory(i)" class="text-slate-300 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-md" title="Remover Story">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                 </button>
              </div>

              <!-- Título Editável -->
              <div class="mb-5 pr-24">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Título da Story</label>
                <input [(ngModel)]="story.titulo"
                       class="w-full text-lg font-bold text-[#004389] border-none p-0 focus:ring-0 bg-transparent placeholder-slate-300 hover:bg-slate-50 rounded px-2 -ml-2 transition-colors" />
              </div>

              <!-- Descrição Editável -->
              <div class="mb-6">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Descrição</label>
                <textarea [(ngModel)]="story.descricao" rows="2"
                          class="w-full text-slate-600 leading-relaxed border-none p-0 focus:ring-0 bg-transparent resize-none hover:bg-slate-50 rounded px-2 -ml-2 transition-colors"></textarea>
              </div>

              <!-- Critérios -->
              <div class="bg-[#F8FAFC] rounded-xl p-5 border border-slate-100">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Critérios de Aceite</label>
                <ul class="space-y-3">
                  <li *ngFor="let criterio of story.criteriosAceite; let j = index; trackBy: trackByIndex" class="flex items-start gap-3 text-sm text-slate-700">
                    <div class="mt-2 w-1.5 h-1.5 rounded-full bg-[#00C0F3] shrink-0"></div>
                    <input [(ngModel)]="story.criteriosAceite[j]"
                           class="w-full bg-transparent border-none p-0 focus:ring-0 text-sm hover:bg-white rounded px-2 -ml-2 transition-colors leading-relaxed">
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </main>

      <!-- Footer -->
      <footer class="mt-24 text-center pb-8">
        <div class="text-slate-400 text-xs font-light">
          Powered by <span class="font-semibold text-[#004389]">Stefanini AI</span> • Stefanini Agile Agent Project
        </div>
      </footer>

    </div>

    <!-- Success Modal -->
    <div *ngIf="showSuccess" class="fixed inset-0 flex items-center justify-center z-50 bg-[#002D5C]/40 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-2xl shadow-2xl p-10 max-w-sm text-center transform transition-all scale-100 animate-bounce-in">
            <div class="w-20 h-20 bg-[#F0F7FF] text-[#00C0F3] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-10 h-10">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-[#004389] mb-3">Sincronizado!</h3>
            <p class="text-slate-500 mb-8 font-light">Suas stories foram criadas no Jira com sucesso e já estão visíveis no board.</p>
            <button (click)="reset()" class="w-full py-3.5 bg-[#004389] text-white font-semibold rounded-xl hover:bg-[#003366] transition-colors shadow-lg shadow-blue-900/20">
                Processar Novo Documento
            </button>
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
    @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.9); } 70% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }

    .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  `]
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Signals para gestão de estado reativa
  stories = signal<UserStory[]>([]);
  isLoading = signal(false);
  isSyncing = signal(false);
  errorMessage = signal('');
  showSuccess = false;
  showConfigPanel = signal(false);
  
  // Configuration settings
  config = signal<ConfigSettings>({
    openaiApiKey: '',
    jiraUrl: '',
    jiraUsername: '',
    jiraToken: '',
    jiraProjectKey: ''
  });

  private apiUrl = 'http://localhost:8080/api/stories';

  logout() {
    this.authService.logout();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<UserStory[]>(`${this.apiUrl}/generate`, formData).subscribe({
      next: (res) => {
        // Delay artificial pequeno só para a UX ficar suave se for muito rápido
        setTimeout(() => {
          this.stories.set(res);
          this.isLoading.set(false);
        }, 800);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.errorMessage.set('Erro ao processar arquivo. Verifique se o backend está rodando.');
        this.isLoading.set(false);
      }
    });
  }

  removeStory(index: number) {
    this.stories.update(current => current.filter((_, i) => i !== index));
  }

  syncToJira() {
    if (this.stories().length === 0) return;

    this.isSyncing.set(true);

    // Envia a lista atualizada (com edições do utilizador) e as credenciais
    const payload = {
      stories: this.stories(),
      credentials: {
        url: this.config().jiraUrl,
        username: this.config().jiraUsername,
        token: this.config().jiraToken,
        projectKey: this.config().jiraProjectKey
      }
    };

    this.http.post(`${this.apiUrl}/sync`, payload).subscribe({
      next: () => {
        this.isSyncing.set(false);
        this.showSuccess = true;
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao sincronizar com Jira. Verifique os logs do Java.');
        this.isSyncing.set(false);
      }
    });
  }

  reset() {
    this.stories.set([]);
    this.errorMessage.set('');
    this.showSuccess = false;
  }

  toggleConfigPanel() {
    this.showConfigPanel.update(current => !current);
  }

  saveConfig() {
    localStorage.setItem('agentConfig', JSON.stringify(this.config()));
    this.showConfigPanel.set(false);
    alert('Configurações salvas localmente. Lembre-se de atualizar o arquivo .env no backend.');
  }

  loadConfig() {
    const saved = localStorage.getItem('agentConfig');
    if (saved) {
      this.config.set(JSON.parse(saved));
    }
  }

  ngOnInit() {
    this.loadConfig();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
