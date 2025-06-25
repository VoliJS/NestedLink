export interface Helper {
    remove( obj : any, key : string | number | symbol ) : any,
    set( prev : any, key : string | number | symbol, value : any ) : any
}