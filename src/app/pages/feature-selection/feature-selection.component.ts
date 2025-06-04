import { Component, OnInit } from '@angular/core';
import { imports } from './feature-selection.import';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ImportsModule } from '../../imports';
import { MsalService } from '@azure/msal-angular';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-feature-selection',
  standalone: true,
  templateUrl: './feature-selection.component.html',
  styleUrl: './feature-selection.component.scss',
  imports: [imports, ImportsModule, TranslateModule],
})
export class FeatureSelectionComponent implements OnInit {
  modalTerms: boolean = false;
  modules: string[] = [];
  branchModal: boolean = false;
  loadingHeadQuarters = false;
  headquarters: any = [];
  selectedHeadQuarters!: string;
  loadingBranchs = false;
  branchs: {}[] = [];
  selectedBranch!: string[];

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    sessionStorage.removeItem('filters');
    sessionStorage.removeItem('page_token');
  }

  openUsers() {
    this.router.navigate(['/', 'home', 'users']);
  }
  
}
