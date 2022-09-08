export class Config {
  id?: string;
  image: Image;
  
  // WEBSITE
  title: string;
  titleFeatured: string;
  keywords: string[];
  description: string;
  shareMsg: string;
  donation?: string;

  url?: string;
  domain?: string;

  owner?: string;

  pixel?: string;
}

class Image {
  mobile?: string;
  desktop?: string;
}
