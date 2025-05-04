import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from './features/sidebar/sidebar.component';
import { AppLoaderComponent } from "./shared/components/app-loader/app-loader.component";
import { LoginService } from './core/services/login-services/login.service';
import { json } from 'stream/consumers';
import { SharedService } from './core/services/shared-services/shared.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, AppLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private translate: TranslateService,
    private authService : LoginService,
    private sharedService : SharedService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.setLanguage();
    this.authService.autoLogout();
  }
  
  setLanguage() {
    // Check if we are on the browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        this.translate.setDefaultLang(savedLang);
        this.setDirection(savedLang);
      } else {
        this.translate.setDefaultLang('en');
        this.setDirection('en');
      }
    } else {
      // For SSR, set a fallback default language (can be 'en' or any default value)
      this.translate.setDefaultLang('en');
    }
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.setDirection(lang);
  }

  setDirection(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('language' , lang)
      this.document.documentElement.lang = lang;
      this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }
}

