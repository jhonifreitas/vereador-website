import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  url: string;
  loading = false;
  form: FormGroup;

  constructor(
    private meta: Meta,
    private title: Title,
    private formGroup: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.url = this.activatedRoute.snapshot.paramMap.get('url');
    this.form = this.formGroup.group({
      phone: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.title.setTitle('Vereador João');
    this.meta.updateTag({ name: 'keywords', content: '' });
    this.meta.updateTag({ name: 'description', content: '' });
    // SHARE
    this.meta.updateTag({ property: 'og:title', content: '' });
    this.meta.updateTag({ property: 'og:description', content: '' });
    this.meta.updateTag({ property: 'og:image', content: '' });
  }

  async shareWhatsapp() {
    this.loading = true;
    const data = this.form.value;
    const msg = '*Olá! Tudo bem?*%0a';
    const url = `https://wa.me/55${data.phone}?text=${msg}`;
    window.open(url);
    this.loading = false;
  }
}
