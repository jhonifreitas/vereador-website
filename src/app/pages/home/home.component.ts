import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  loading = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private utils: UtilsService,
    private formGroup: FormBuilder,
  ) {
    this.form = this.formGroup.group({
      phone: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void { }

  async shareWhatsapp() {
    
  }
}
