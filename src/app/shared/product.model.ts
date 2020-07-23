export class Product {
  constructor(
    public addressProposer: string,
    public code: number,
    public product_name: string,
    public nutriments: {},
    public ingredients: string[],
    public quantity: string,
    public generic_name: string,
    public packaging: string,
    public labels: string[],
    public additifs: string[],
    public voteDates: string[],
   // public totalVotes: number = 0,
    public forVotes: number = 0,
    public againstVotes: number = 0,
    public alreadyVoted: {},
    public endDate: number = 0,
    public status: number
  ) {
  }
}
