export class Prod {
  productId ?: string ; 
  quantity : number;
}

export class Order {
  id?:number;
  _id?:number;
  
  product?: Prod[];
  isPlaced?:boolean;
  isDelievered?:boolean;
  modifiedOn?:Date;
  owner:string;
}


export class OrderRes extends Order {
  success:string;
  data?:Order;
  message?:any ;
  err?:any;
}