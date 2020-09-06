export class Product {
  constructor(
    public addressProposer: string,
    public code: number,
    public product_name: string,
    public nutriments: {
      energy: 0,
      energy_kcal: 0,
      proteines: 0,
      carbohydrates: 0,
      salt: 0,
      sugar: 0,
      fat: 0,
      saturated_fat: 0,
      fiber: 0,
      sodium: 0
    },
    public ingredients: string[],
    public quantity: number,
    public generic_name: string,
    public packaging: string,
    public labels: string[],
    public additifs: string[],
    public forVotes: number = 0,
    public againstVotes: number = 0,
    public alreadyVoted: {},
    public startDate: number = 0,
    public endDate: number = 0,
    public all_hash = '',
    public labels_hash = '',
    public ingredients_hash = '',
    public additives_hash = '',
    public nutriments_hash = '',
    public variousDatas_hash = '',
    public lastVerification: number = 0,
    public IPFS_hash = ''
  ) {
  }
}
