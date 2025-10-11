import { Component, computed, inject, output } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { Menu, MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { User } from 'models';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ApplicationStore } from 'state/application-store';

 
import { ThemeSwitcher } from 'theme-switcher/theme-switcher';





@Component({
  selector: 'dashboard-header',
  imports: [InputGroupModule, InputGroupAddonModule, ButtonModule, InputTextModule, AvatarModule, MenuModule, SplitButtonModule, OverlayBadgeModule,ThemeSwitcher],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})
export class DashboardHeaderComponent {

  hideSidebar = output<void>();
  store = inject(ApplicationStore);

  avatarItems: MenuItem[] = [
    {
      label: 'Выход',
      command: () => {
        this.store.updateUser(undefined);
        this.store.updateIsLogin(false);
        this.router.navigate(['/login']);
      }
    }];

  router: Router = inject(Router);

  userInfo = computed(() => this.store.user());

  hide() {
    this.hideSidebar.emit();
  }
}
