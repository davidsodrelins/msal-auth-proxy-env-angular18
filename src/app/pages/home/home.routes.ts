import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { accessControlGuard } from '../../guards/access-control.guard';

export const routes: Routes = [
  
  {
    path: 'users',
    loadChildren: () =>
      import('../profile/user.routes').then(
        (x) => x.UserRoutingModule
      ),
    // canActivate: [accessControlGuard],
    runGuardsAndResolvers: 'always',
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class HomeRoutingModule {}
