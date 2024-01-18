import { DynamoDBClient, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb"
import { Block, PartialBlock} from "@blocknote/core"
import { useRouter } from "next/navigation"


export interface Document {
    userId: string
    documentId: string
    documentName: string
    documents? : [Document]
    documentImageURL: string
    content?: [PartialBlock]
    starred: boolean,
    editMessage?: string 
}





function addDocument<T>(userId: string) : Promise<T>  {

  
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/adddocument?userId=${userId}`,{
        method: "POST"
    }).then((res) => res.json())

     

     
   

}

function deleteDocument<T>(documentId: string,userId: string) : Promise<T> {
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/deletedocument?userId=${userId}&documentId=${documentId}`,{
        method: "DELETE"
    }).then((res) => res.json())
}

function favorite<T>(documentId: string, userId: string) : Promise<T> {
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/favorite?userId=${userId}&documentId=${documentId}`,{
        method: "POST"
    }).then((res) => res.json())
}

function getDocuments<T>(controller: AbortController, userId: string) : Promise<T>  {

    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/getdocuments?userId=${userId}`,{
         method: "GET",
         signal:  controller.signal,
     }).then((res) => res.json())
 
 }

 function getDocument<T>(documentId: string, userId: string) : Promise<T>  {

    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/getdocument?userId=${userId}&documentId=${documentId}`,{
         method: "GET"
     }).then((res) => res.json())
 
 }

function getSummary<T>(prompt: string, sessionId: string, controller: AbortController) : Promise<T> {
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/summarize?prompt=${prompt}&sessionId=${sessionId}`,{
        method: "GET",
        signal:  controller.signal,
    }).then((res) => res.json())
}
 
function fetchChatHistory<T>() : Promise<T>  {
    return fetch(`https://4lqud0fnn0.execute-api.us-east-1.amazonaws.com/Notify/fetchChatHistory`,{
        method: "GET",
    }).then((res) => res.json())
}
export {addDocument,fetchChatHistory, getDocuments, getDocument, getSummary, favorite, deleteDocument}