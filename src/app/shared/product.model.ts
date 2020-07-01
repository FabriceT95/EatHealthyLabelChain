export class Product {
  constructor(public code: number,
              public product_name: string,
              public nutriments: {},
              public ingredient: [],
              public quantity: string,
              public generic_name: string,
              public packaging: string,
              public labels: [] ) {}
}
