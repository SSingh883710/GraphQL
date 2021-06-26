const express = require("express");
const app=express();
const PORT=8090;
const data=require("./MOCK_DATA.json");
const graphql=require("graphql");
const {GraphQLObjectType,GraphQLSchema,GraphQLInt,GraphQLString, GraphQLList}=graphql;
const { graphqlHTTP }=require("express-graphql");

const UserType=new GraphQLObjectType({
    name:"User",
    fields:()=>({
        id:{
            type:GraphQLInt,
        },
        first_name:{
            type:GraphQLString,
        },
        last_name:{
            type:GraphQLString
        },
        email:{
            type:GraphQLString
        },
        password:{
            type:GraphQLString
        }
    })
});

const RootQuery=new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        getAllUsers:{
            type:new GraphQLList(UserType),
            args:{
                id:{
                    type:GraphQLInt
                }
            },
            resolve(parent,args){
                return data;
            }
        },
        // getSingleUser:{
        //     type:new GraphQLList(UserType),
        //     args:{
        //         id:{
        //             type:GraphQLInt
        //         }
        //     }
        // },
    }
});

const Mutation=new GraphQLObjectType({
    name:"Mutation",
    fields:{
        createUser:{
            type:UserType,
            args:{
                first_name:{type:GraphQLString},
                last_name:{type:GraphQLString},
                email:{type:GraphQLString},
                password:{type:GraphQLString},
            },
            resolve(parent,args){
               let id = data.length + 1; 
               data.push({
                id:id,
                ...args
               });
                return args;
            }
        }
    }
});

const schema=new GraphQLSchema({query:RootQuery,mutation:Mutation});

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql:true
}));

app.listen(PORT,()=>{
    console.log("Hey Man, We are up & running.");
})