import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {FilePageComponentimplements} from "./pages/file-page/file-page.component";
import {AboutPageComponent} from "./components/about-page/about-page.component";
import {RegistrationComponent} from "./components/registration/registration.component";
import {MyAccountComponent} from "./components/my-account/my-account.component";
import {AdminComponent} from "./components/admin/admin.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'file', component: FilePageComponentimplements},
  {path: 'my-account', component: MyAccountComponent},
  {path: 'admin', component: AdminComponent},
  {path: ':filename', component: AboutPageComponent},
];
