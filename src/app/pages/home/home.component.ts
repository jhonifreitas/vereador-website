import * as firebase from 'firebase/app';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { AnimationOptions } from 'ngx-lottie';

import { Tab } from 'src/app/models/tab';
import { Social } from 'src/app/models/social';
import { Config } from 'src/app/models/config';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';
import { Access, Analytics } from 'src/app/models/analytics';

import { IPService } from 'src/app/services/ip/ip.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FBTabService } from 'src/app/services/firebase/tab/tab.service';
import { FBSocialService } from 'src/app/services/firebase/social/social.service';
import { FBConfigService } from 'src/app/services/firebase/config/config.service';
import { FBCategoryService } from 'src/app/services/firebase/category/category.service';
import { FBAnalyticsService } from 'src/app/services/firebase/analytics/analytics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomePage implements OnInit {

  private isBrowser: boolean;

  tabs: Tab[];
  config: Config;
  loading = true;
  form: FormGroup;
  socials: Social[];
  categories: Category[];
  lottieOpts: AnimationOptions = {path: '/assets/lottie/loading.json'};

  constructor(
    private meta: Meta,
    private title: Title,
    private ip: IPService,
    private router: Router,
    private utils: UtilsService,
    private fbTab: FBTabService,
    private formGroup: FormBuilder,
    @Inject(PLATFORM_ID) platformId,
    private fbSocial: FBSocialService,
    private fbConfig: FBConfigService,
    private fbCategory: FBCategoryService,
    private activatedRoute: ActivatedRoute,
    private fbAnalytics: FBAnalyticsService,
  ) {
    this.isBrowser = platformId;
    this.form = this.formGroup.group({
      phone: new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.config = await this.getConfig();
    if(this.config){
      this.title.setTitle(this.config.title);
      this.meta.addTags([
        { name: 'keywords', content: this.config.keywords.join(',') },
        { name: 'description', content: this.config.description },
        { property: 'og:title', content: this.config.title },
        { property: 'og:description', content: this.config.description },
        { property: 'og:image', content: this.config.image },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: `${environment.host}/${this.config.url}` },
      ]);

      if(isPlatformBrowser(this.isBrowser)){
        this.getGeoLocation();
      }

      this.getSocials();
      this.getTabs();
      this.getCategories();
      this.loading = false;
    }else{
      this.router.navigateByUrl('/error/404');
    }
  }

  getGeoLocation() {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      await this.ip.getIPAddress().then(async (res: {ip: string}) => {
        const access: Access = {
          lat: lat,
          long: long,
          date: firebase.firestore.Timestamp.now()
        };
        await this.fbAnalytics.get(res.ip, this.config.id).then(async analytics => {
          analytics.access.push(access);
          await this.fbAnalytics.update(analytics.id, {access: analytics.access});
        }).catch(async _ => {
          const data: Analytics = {ip: res.ip, config: this.config.id, access: [access]};
          await this.fbAnalytics.create(data);
        })
      });
    }, err => {
      console.error(err);
      this.utils.message('Não foi possível obter sua localização, verifique seu GPS e permissões de localização!', 'warn', null, 1000000);
    }, { timeout: 10000 })
  }

  getConfig(): Promise<Config> {
    return new Promise(resolve => {
      const url = this.activatedRoute.snapshot.paramMap.get('url');
      this.fbConfig.get(url).subscribe(config => {
        resolve(config);
      });
    });
  }

  getSocials() {
    this.fbSocial.all(this.config.id).subscribe(socials => {
      this.socials = socials;
    })
  }

  getTabs() {
    this.fbTab.all(this.config.id).subscribe(tabs => {
      this.tabs = tabs;
    })
  }

  getCategories() {
    this.fbCategory.all(this.config.id).subscribe(categories => {
      this.categories = categories;
    })
  }

  shareWhatsapp() {
    const url = `whatsapp://send?text=${this.whatsappMsg}`;
    window.open(url);
  }

  shareWhatsappPhone() {
    const data = this.form.value;
    const url = `https://wa.me/55${data.phone}?text=${this.whatsappMsg}`;
    window.open(url);
  }

  get whatsappMsg() {
    let msg = this.config.shareMsg.replace(/\n/gm, '%0a');
    msg += `%0a%0a`;
    msg += `${environment.host}/${this.config.url}`;
    return msg;
  }
}
