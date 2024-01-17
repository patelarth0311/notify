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

export class SocketTaskDelegator {

    socket : Socket

    constructor(socket: Socket) {
        this.socket = socket
    }
   
    

    addDocument(makeToast: () => void, document: Document) {
        const router = useRouter()
        socket.send(({
            "action": 'getDocuments', 
            "message" : "Fetching documents again"
          }))
          var documentId =  document.documentId
          router.push( `/documents/${documentId}`)
        makeToast()
    }


}

class Socket {
    socket : WebSocket | null = null
    
    init() {
       this.socket = new WebSocket("wss://j33lh5l3xj.execute-api.us-east-1.amazonaws.com/production");
    }

   
    onOpen() {
        if (this.socket) {
            this.socket.onopen = () => {
                if (this.socket) {
                    this.socket.send(JSON.stringify({
                        "action": "getDocuments", 
                        "message" : "Fetching documents"
                      }))
                }
               
            }
           
        }
    }

    OnMessage(action: (message :  MessageEvent<any>) => void) {
       
        if (this.socket) {
            this.socket.onmessage = (e) => {
                action(e)
            }
        }
    }

    send(input: {}) {
        if (this.socket) {
            this.socket.send(JSON.stringify(input))
        }
    }

    isOpen() {
        return this.socket?.readyState
    }
}

const socket = new Socket()
const socketTaskDelegator = new SocketTaskDelegator(socket)

export {socket, socketTaskDelegator}



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