export interface Post{
    _id:string;
    publishedAt:string;
    title:string;
    author:{
        name:string;
        image:string;
    };
    comments:Comment[];
    description:string;
    mainImage:{
        assets:{
            url:string;
        };
    };
    slug:{
        current:string;
    };
    body:[object];   
}
 export interface Comment {
    approved:boolean;
    comment:string;
    email:string;
    name:string;
    post:{
        _ref:string;
        _type:string;
    };
    publishedAt:string;
    _id:string;
    _rev:string;
    _type:string;
    _updatedAt:string;
 }