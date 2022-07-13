export class Config {
  id?: string;
  image: Image;
  
  // WEBSITE
  title: string;
  titleFeatured: string;
  url: string;
  keywords: string[];
  description: string;
  shareMsg: string;
  donation?: string;

  owner?: string;

  pixel?: string;
}

class Image {
  mobile?: string;
  desktop?: string;
}
