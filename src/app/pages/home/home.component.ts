import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  loading = false;
  form: FormGroup;

  constructor(
    private formGroup: FormBuilder,
  ) {
    this.form = this.formGroup.group({
      phone: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void { }

  async shareWhatsapp() {
    this.loading = true;
    const data = this.form.value;
    const msg = '*Olá! Tudo bem?*%0a';
    const url = `https://wa.me/55${data.phone}?text=${msg}`;
    window.open(url);
    this.loading = false;
  }
}
