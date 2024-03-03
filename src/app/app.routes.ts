import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {FilePageComponentimplements} from "./pages/file-page/file-page.component";
import {AboutPageComponent} from "./components/about-page/about-page.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  // {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'file', component: FilePageComponentimplements},
  {path: ':filename', component: AboutPageComponent}
];
