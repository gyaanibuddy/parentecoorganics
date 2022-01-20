export class Product {
	id: number;
	images : string[];
	name: string;
	description : string ; 
	price : number ;
	totalStock : number ; 
	created: string;
}
export class ProductRes extends Product {
  success:string;
  data?:Product[];
  msg?:string ;
  message?:string;
  err?:any;
}