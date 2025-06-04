import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: 'user',
    loadComponent: () =>
      import(
        './user/user.component'
      ).then((x) => x.UserComponent),
  },  
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class UserRoutingModule {}
