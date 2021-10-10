import { Injectable } from '@angular/core';
import { HttpClient , HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProductRes, Product } from '../_models/product';
import { OrderRes, Order} from '../_models/order';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
	httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  environment = {
	  apiUrl: '/api'
	};

  constructor(private http: HttpClient, private router: Router) { }
//User apis
  getCart(id : string): Observable<any> {
    return this.http.post<any>(`${this.environment.apiUrl}/getCart/${id}`, this.httpOptions)
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<any>('getCart'))
    );
  }

  getHomeProducts(): Observable<ProductRes> {
    return this.http.get<ProductRes>(`${this.environment.apiUrl}/homeproducts`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<ProductRes>('homeproducts'))
    );
  }

  getProducts(): Observable<ProductRes> {
    return this.http.get<ProductRes>(`${this.environment.apiUrl}/ourproducts`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<ProductRes>('ourproducts'))
    );
  }

  getProductAdmin(): Observable<ProductRes> {
    return this.http.get<ProductRes>(`${this.environment.apiUrl}/products`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<ProductRes>('ourproducts'))
    );
  }

  getProductdetail(id : string): Observable<any> {
  console.log(id)
    return this.http.get<any>(`${this.environment.apiUrl}/productdetail/${id}`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('productdetail'))
    );
  }

  cart( obj : any ): Observable<any> {
    console.log(obj);
    return this.http.post<any>(`${this.environment.apiUrl}/cart`,obj)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('cart'))
    );
  }

  recurringCart( id : string ): Observable<any> {
    console.log(id);
    return this.http.post<any>(`${this.environment.apiUrl}/recurringCart/${id}`,this.httpOptions)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('recurOrder'))
    );
  }

  removeFromCart( obj : any ): Observable<any> {
    console.log(obj);
    return this.http.post<any>(`${this.environment.apiUrl}/removeProductFromCart`,obj)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('remove'))
    );
  }
  
  checkout ( id : string ): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/checkout/${id}`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('checkout'))
    );
  }

  getTotal ( id : string ): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/getTotal/${id}`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('getTotal'))
    );
  }

  placeOrder( obj : any ): Observable<any> {
    return this.http.put<any>(`${this.environment.apiUrl}/placeOrder`,obj ,this.httpOptions)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('placeorder'))
    );
  }

  applyCoupon( obj : any ): Observable<any> {
    return this.http.post<any>(`${this.environment.apiUrl}/applyCoupon`,obj)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('applyCoupon'))
    );
  }

  cancelOrder(id:string): Observable <OrderRes>{
    return this.http.put<any>(`${this.environment.apiUrl}/cancelOrder/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<OrderRes>('cancelOrder'))
      );
  }

  saveReview( obj : any ): Observable<any> {
    return this.http.post<any>(`${this.environment.apiUrl}/saveReview`,obj)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('saveReview'))
    );
  }

  getReviewsOfProduct(id : string): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/getReviewOfProduct/${id}`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('getReviewsOfProduct'))
    );
  }

  getPlacedOrderByUser(id : string): Observable<ProductRes> {
    return this.http.get<ProductRes>(`${this.environment.apiUrl}/getPlacedOrderByUser/${id}`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<ProductRes>('ourproducts'))
    );
  }

   getDeliveredOrdersOfUser(id : string): Observable<ProductRes> {
    return this.http.get<ProductRes>(`${this.environment.apiUrl}/getDeliveredOrdersOfUser/${id}`)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<ProductRes>('getDeliveredOrdersOfUser'))
    );
  }
  

//Admin ApiService
  saveProduct(obj : any): Observable<ProductRes> {
    return this.http.post<ProductRes>(`${this.environment.apiUrl}/saveProduct`, obj, this.httpOptions)
    .pipe(
      tap(_ => {}),
      catchError(this.handleError<ProductRes>('saveProduct'))
    );
  }

  deleteProduct(id:string): Observable <ProductRes>{
    return this.http.delete<ProductRes>(`${this.environment.apiUrl}/deleteProduct/${id}`,this.httpOptions)
      .pipe(
        tap(_=> {}),
        catchError(this.handleError<ProductRes>('deleteProduct'))
      );
  }

  updateProduct(obj : any): Observable <ProductRes>{
    return this.http.put<ProductRes>(`${this.environment.apiUrl}/updateProduct`,obj,this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<ProductRes>('updateProduct'))
    );
  }


  updateStatus(obj : any): Observable <ProductRes>{
    return this.http.put<ProductRes>(`${this.environment.apiUrl}/updateStatus`,obj,this.httpOptions)
    .pipe(
      tap(_=> {}),
      catchError(this.handleError<ProductRes>('updateProduct'))
    );
  }


  // //     updateProduct(obj : any): Observable <ProductRes>{
  // --   return this.http.put<ProductRes>(`${this.environment.apiUrl}/updateProduct`,obj,this.httpOptions)
  // --   .pipe(
  // --     tap(_=> {}),
  // --     catchError(this.handleError<ProductRes>('updateProduct'))
  // --   );
  // -- }

  getSingleProduct(id : string): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/getSingleProduct/${id}` )
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<any>('getSingleProduct'))
    );
  }

  delieverOrder( id : string ): Observable<any> {
    console.log(id);
    return this.http.put<any>(`${this.environment.apiUrl}/delieverOrder`,{'id':id } ,this.httpOptions)
      .pipe(
        tap(_ =>{}),
        catchError(this.handleError<any>('placeorder'))
    );
  }


  getPlacedOrders(): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/getPlacedOrders`)
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<any>('getPlacedOrders'))
    );
  }

  getDelieveredOrders(): Observable<any> {
    return this.http.get<any>(`${this.environment.apiUrl}/getDelieveredOrders`)
    .pipe(
      tap(_ => {}),
          catchError(this.handleError<any>('getDelieveredOrders'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      //: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      //  better job of transforming error for user consumption


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
