import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Tab } from 'src/app/models/tab';
import { Social } from 'src/app/models/social';
import { Config } from 'src/app/models/config';
import { Category } from 'src/app/models/category';

import { FBTabService } from 'src/app/services/firebase/tab/tab.service';
import { FBSocialService } from 'src/app/services/firebase/social/social.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { FBCategoryService } from 'src/app/services/firebase/category/category.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  tabs: Tab[];
  url: string;
  config: Config;
  loading = false;
  form: FormGroup;
  socials: Social[];
  categories: Category[];

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private fbTab: FBTabService,
    private formGroup: FormBuilder,
    private fbSocial: FBSocialService,
    private fbConfig: FBConfigService,
    private fbCategory: FBCategoryService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.url = this.activatedRoute.snapshot.paramMap.get('url');
    this.form = this.formGroup.group({
      phone: new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.config = await this.getConfig();
    if(this.config){
      this.title.setTitle(this.config.title);
      this.meta.updateTag({ name: 'keywords', content: this.config.keywords.join(',') });
      this.meta.updateTag({ name: 'description', content: this.config.description });
      // SHARE
      this.meta.updateTag({ property: 'og:title', content: this.config.title });
      this.meta.updateTag({ property: 'og:description', content: this.config.description });
      this.meta.updateTag({ property: 'og:image', content: this.config.image });

      this.getSocials();
      this.getTabs();
      this.getCategories();
    }else{
      this.router.navigateByUrl('/error/404');
    }
  }

  getConfig(): Promise<Config> {
    return new Promise(resolve => {
      this.fbConfig.get(this.url).subscribe(config => {
        resolve(config);
      });
    });
  }

  getSocials() {
    this.fbSocial.all(this.url).subscribe(socials => {
      this.socials = socials;
    })
  }

  getTabs() {
    this.fbTab.all(this.url).subscribe(tabs => {
      this.tabs = tabs;
    })
  }

  getCategories() {
    this.fbCategory.all(this.url).subscribe(categories => {
      this.categories = categories;
    })
  }

  async shareWhatsapp() {
    this.loading = true;
    const data = this.form.value;
    const msg = this.config.shareMsg;
    const url = `https://wa.me/55${data.phone}?text=${msg}`;
    window.open(url);
    this.loading = false;
  }
}
