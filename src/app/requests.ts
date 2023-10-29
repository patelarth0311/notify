import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb"
import { Block, PartialBlock} from "@blocknote/core"
export interface Document {
    userId: string
    documentId: string
    documentName: string
    documents? : [Document]
    documentImageURL: string
    content?: [PartialBlock]
    starred: boolean
}


function addDocument<T>() : Promise<T>  {

   return fetch('https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/adddocument',{
        method: "POST"
    }).then((res) => res.json())

}

function favorite<T>(documentId: string) : Promise<T> {
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/favorite?documentId=${documentId}`,{
        method: "POST"
    }).then((res) => res.json())
}

function getDocuments<T>() : Promise<T>  {

    return fetch('https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/getdocuments',{
         method: "GET"
     }).then((res) => res.json())
 
 }

 function getDocument<T>(documentId: string) : Promise<T>  {

    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/getdocument?userId=1&documentId=${documentId}`,{
         method: "GET"
     }).then((res) => res.json())
 
 }

function getSummary<T>(prompt: string) : Promise<T> {
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/summarize?prompt=${prompt}`,{
        method: "GET"
    }).then((res) => res.json())
}
 


export {addDocument, getDocuments, getDocument, getSummary, favorite}