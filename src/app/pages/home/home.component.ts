import * as firebase from 'firebase/app';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser, DOCUMENT, PlatformLocation } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';

import { AnimationOptions } from 'ngx-lottie';

import { Tab } from 'src/app/models/tab';
import { Social } from 'src/app/models/social';
import { Config } from 'src/app/models/config';
import { Category } from 'src/app/models/category';
import { environment } from 'src/environments/environment';
import { Access, Analytics } from 'src/app/models/analytics';

import { IPService } from 'src/app/services/ip.service';
import { UtilsService } from 'src/app/services/utils.service';
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
    private renderer2: Renderer2,
    private formGroup: FormBuilder,
    private fbSocial: FBSocialService,
    private fbConfig: FBConfigService,
    private fbCategory: FBCategoryService,
    private activatedRoute: ActivatedRoute,
    private fbAnalytics: FBAnalyticsService,
    private platformLocation: PlatformLocation,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: boolean
  ) {
    this.form = this.formGroup.group({
      phone: new FormControl('', Validators.required)
    });
  }

  async ngOnInit() {
    this.config = await this.getConfig();
    if (this.config) {
      if (this.config.owner) {
        this.fbConfig.getById(this.config.owner).subscribe(config => {
          if (config.pixel) {
            this.setPixel(config.pixel);
          }
        })
      }

      if (this.config.pixel) {
        this.setPixel(this.config.pixel);
      }

      let url = `${environment.host}/${this.config.url}`;
      if (this.config.domain) url = `https://${this.config.domain}`;

      this.title.setTitle(this.config.title);
      this.meta.addTags([
        { name: 'keywords', content: this.config.keywords.join(',') },
        { name: 'description', content: this.config.description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: this.config.title },
        { property: 'og:description', content: this.config.description },
      ]);
      
      if (this.config.image) {
        this.meta.addTags([
          { property: 'og:image:type', content: 'image/png' },
          { property: 'og:image', content: this.config.image.mobile },
        ]);
      }

      if (isPlatformBrowser(this.platformId)) {
        this.getGeoLocation();
      }

      await this.getSocials();
      await this.getTabs();
      await this.getCategories();

      this.loading = false;
    } else this.router.navigateByUrl('/error/404');
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
      if (url) {
        this.fbConfig.getByUrl(url).subscribe(config => {
          resolve(config);
        });
      } else {
        this.fbConfig.getByDomain(this.platformLocation.hostname).subscribe(config => {
          resolve(config);
        });
      }
    });
  }

  async getSocials() {
    this.socials = await this.fbSocial.all(this.config.id);
  }

  async getTabs() {
    this.tabs = await this.fbTab.all(this.config.id);
  }

  async getCategories() {
    this.categories = await this.fbCategory.all(this.config.id);
  }

  setPixel(pixel: string) {
    const script = this.renderer2.createElement('script');
    script.text = pixel;
    this.renderer2.appendChild(this.document.body, script);
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

    if (this.config.domain) msg += `https://${this.config.domain}`;
    else msg += `${environment.host}/${this.config.url}`;

    return msg;
  }
}
