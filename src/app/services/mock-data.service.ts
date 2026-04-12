import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  verified: boolean;
  description: string;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private categories: Category[] = [
    {
      id: 'cat1',
      name: 'Luminous Forms',
      description: 'Sculptural lighting designed for spatial volume.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDahuEOD89aCgjJxITNtMMZD-_N8fFVSHdhds4HACx3jGL4M6nLlDJyRiWYDBwR7mk7aeK9Br2LuqMWL-tJK-8gUpbqQoX415Lyf0af6fBIapG_JXqjnjgXn8-sM1AaYY6icKvO1xDNXN8oH9ptiB6AcOuwChK_6FR4C4b_039gyU-YqyL_SJXjg6xET1FWLILKLXfBOBPZmM6-F1P1siV_UYYSFeBFHpha9LTmAeJLgoZZkSLnlLpg0THuvbpmqwBHnYt7IHBul4I'
    },
    {
      id: 'cat2',
      name: 'Tactile Hardware',
      description: 'Solid brass and hand-forged steel accents.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ6E-fGQM2gEihL99Yx6LGlhlpnalgaj9aaD-kXXlTnzvsefy-53ZiTFA0bArCMe2FB0h3XpP__R7KmvCJKEKb40X_YNk8PF5eNqdnGvdZJjl6sYz8wKkGwCGPEP9EBuRPaqIjxw1TH44RD_YubzQ15dgA2WYREdE1GgNolyx2O5Vf2D0bKIVBRV2Lgpq7_pRO5n3BZx4-r4gGjbaM-jDseqJOSBv2bduvusrDAVIV-R9hfJuqqI_xSrFWu4exMODqlap_QO1wb_A'
    },
    {
      id: 'cat3',
      name: 'Raw Surfaces',
      description: 'Reclaimed stone and curated timber finishes.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr6ATWa0EK14pN3wrXwt53nT7JyqSWp-CBSbup2ULpCb1pHfAlb7JpIJKrBnhhESk5k66l9cKQ58IvvMbodelWebQ39FVhGyu1JAgbIau0Jr0G-_l1Mk6fuEQargLItY8yqRVCyDkLvw-Bu20gVI63B7PC8bUh8sBL3zj7s6eMzv8OaNxiGCKi3yIrQTz-XubQet7gcb8oKFBctU4xe9c1z0zNfmCdX9xgzr0LcaCcdaZZ0FTw-ecImh6BENicL4p2KvvRfUN4AqQ'
    }
  ];

  private products: Product[] = [
    {
      id: '1',
      sku: 'AM-9021',
      name: 'The Monolith Lounge',
      brand: 'Studio Bau',
      price: 1250,
      verified: true,
      category: 'Furniture',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhF1U5qN1Zt-Fvo6nDT3AfHeJZhoJUBK9qrahleGlA8uR30cveHC631s2WtQrm50YYpqk1eLKOlftKn8o8-eYrzt6f2pC4uLw4T3RW30Ttzk84d6cfbOKYl3-0-Z0rRjYNfqHtZJBP7u7OZwmItionaUfGGVtOkU9R4IR-IJZtRa-6Z3HN2QvaWUWyH80HF3OeyKbsDj47lfjbBvxFxC54-Zal76JlfnpJxjBiF9mJ030cVaQE_TsZrKrbXHgempOkafYi-tR8F90',
      description: 'Iconic mid-century modern lounge chair in a bright empty gallery space with shadows.'
    },
    {
      id: '2',
      sku: 'AM-1104',
      name: 'Floating Glass Plinth',
      brand: 'Arc Form',
      price: 2800,
      verified: true,
      category: 'Tables',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKnUTWJjamGdGZCB_kC3hxV2O7pe91O3nW5698T3HiENX-5XTPXpH4_noSN8Z12E-ksklF8fIekDK8ruS1HxA1Soyv3gJxE6N1FGTvacV-OB42LlIoSe4PuCzSreatzccBG0i62n4NdTxIah0NGFmLtePwNDgZgtg85o2we8_EPgdKkHpviyPL_HL-fDtgMJeDlZSUdn2gzcYy18SoROltMiKZwgeGITiLUR6srWM3iDpXvtrKCBn3EbDSjwRaqjzcXpGetGUDQ60',
      description: 'Minimalist glass and steel coffee table on a grey textured rug.'
    },
    {
      id: '3',
      sku: 'AM-4456',
      name: 'Concrete Vessel No. 4',
      brand: 'Terra Studio',
      price: 420,
      verified: true,
      category: 'Decor',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI3TQvxfVvRlLnqvp947a8Nv8cUJ-5-rh_JeV0nP8iHm2QynyYTD5BvJiusHPvuvyL_JLXKUVoQBD2PaCdLSRtGA-dVivKmqh-_sPjZRT4_8OKNTu1vj4hJs22hkg-fPqo_ELcHyiouXJrVZG3b76Uf5lOKKynmw_Zp1UNTEihmcXK1-zjhzVx1AZGPuTRgoeNuP9hiYG2FgZWlCJoNLiY2CJBmDKNv1fRf_5lI0hflYccWr0Mu90ICgiGwRYzciZFngHANb0IwtU',
      description: 'Brutalist concrete decorative vase with dry botanicals.'
    },
    {
      id: '4',
      sku: 'AM-7720',
      name: 'Washi Column Lamp',
      brand: 'Noguchi-Inspired',
      price: 890,
      verified: true,
      category: 'Lighting',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBVujkks-uQG6_YP2_rZN97Sce3eVqvFE78U6NSEyfEGPF6jpbYvH28WQQ9E2OFFRaEb9ejs3gI6JxP1piDxBBX9dXPG_Eyjm_FOHS2y-e7ZOvUJYR1RzxNMjYP6UFIqVeZ36DXfc-oWIvEeCOcHVGdknlTrTxQi1iIKG3CkE8vQdDHAK-IJi8HL2xp6Uy2vD-HWQIq3XOF-hG7JPpl0UKFtxtmEUSSaa4EDVbQ3zkumTChlRhncUbjoOJtt7l2lj_2tEd76dedac',
      description: 'Modern floor lamp with paper shade emitting soft glow.'
    }
  ];

  private vendors: Vendor[] = [
    {
      id: 'v1',
      name: 'Studio Nord',
      specialty: 'Scandi-Modern Experts',
      description: 'Specializing in sustainable hardwoods and traditional joinery with a contemporary edge.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_RXBlQjmYvoNH99wv471m8KeIPiyjcODEmCz6vaiJIpnsaAdcpDOmmW-9ZZDs9m6txJDS6f0SSdL6u3Yw0qvXUCRWrALNLGYVPJrxrhOXyY6Ax2Pz-AkEGTmSPoL95w1WoT-XfCiQVuq2kGtd75gBapBLH_3tRJd-hMXwevbNZqGNxD377IV4q4YVkpiSSoq0nHoYaLtwqLAIEfIJs950UAh0RWfzPF-4lr8ibQmDyOn7zNzOFk2EeuPvYInzKKatGLMud8cdT1Y',
      rating: 5.0
    },
    {
      id: 'v2',
      name: 'Vanguard Metals',
      specialty: 'Precision Casting',
      description: 'Pushing the boundaries of architectural hardware with liquid metal casting.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjbxbXi7IGzNpcECKRw8BqZn1DoWozZObEvbRz79ljANnOyWvzPWNgHTHlQ_I2_GhRlftXdLAKP946YG5rPhqwYBx0UtproenI44WT9go-u4T9UpXUEP1Db0YCB3Wb5oxebAAyTahSrQ9nCaof1kAeXRF_gCIRHpz4MNTejJm0Df428rePIm7jrpcu7WtqbSXhJ5Q4Ak5HejXB-gj2nVduoZFx1f6SWvbH7vGEe3KLV_-efjeBTrqnWWQGklM3316vL4JhPkNsDAQ',
      rating: 4.9
    },
    {
      id: 'v3',
      name: 'Ether Ceramics',
      specialty: 'Porcelain Masters',
      description: 'Translating tectonic forms into delicate porcelain and heavy stoneware vessels.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE3Cg2Q3kI8IBAOwWGXpCIrqVm4cL44QacpbZ-1A1N23O_5TrdUVLz-Bxl1_qJd2RkNN98JCsCXk629b1IrmEyIpXWmNZJ2ptxH3oxN5ntQ1jD-Vii_nLq5_A07YLNbFWD6c1HHA_lDS-49Fdx38eVsiR5e2T41eeALRYO0g5fWBQZyUy61ArvNRnQoblrraDfT1dOYM_cyEhCGjsVQO8wRyp7ru-XE0LJ4EXhl3syKM0qh529Ml0vaZNzcULWGqk84RDkHDilH1c',
      rating: 5.0
    }
  ];

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getTrendingProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getVendors(): Observable<Vendor[]> {
    return of(this.vendors);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }
}
