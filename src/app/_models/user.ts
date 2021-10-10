export enum Role {
    endUser = 'endUser',
    owner = 'owner',
}

export class User {
    id: string;
    _id ?: string ;
    username: string;
   // user_name: string ;
    password?: string;
    firstName: string;
   role ?: string ;
    lastName: string;
    authdata?: string;
    contactNo: string;
    isAdmin?: Role;
    addr1 : string ;
    addr2 : string ;
    city : string ;
    state  : string ;
    postalCode : string  ;
}

export class UserRes extends User {
    success: string ;
    data: User;
    token: string;
    message?: string;
}
