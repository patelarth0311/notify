import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
type ResponseData = {
  message: string
}
export const dynamic = "force-dynamic";

export var dynaclient : DynamoDBClient | undefined  = undefined

export async function GET( req: NextRequest,
  res: NextResponse) {
    try {
     
      if (process.env.ACCESSKEYID && process.env.SECRETKEY) {

  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID , secretAccessKey: process.env.SECRETKEY
    },
  });

  dynaclient = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID ? process.env.ACCESSKEYID : "", secretAccessKey: process.env.SECRETKEY ? process.env.SECRETKEY  : ""
    },
  });

  const userId = req.nextUrl.searchParams.get("userId")
  const documentId = req.nextUrl.searchParams.get("documentId")
  const name = req.nextUrl.searchParams.get("name")
  var data = undefined

  const updateParams: UpdateItemInput = {
    TableName: "NotifyNew",
    Key: {
      userId: { S: userId! },
      documentId: { S: documentId! },
    },
    UpdateExpression: "SET documentName = :value",
    ExpressionAttributeValues: {
      ":value": { S: name! },
    },
    ReturnValues: "ALL_NEW",
  };

  const updating = new UpdateItemCommand(updateParams);


   await client.send(updating).then((res) => {
    try {
      const unmarshalledData = unmarshall(res.Attributes!) as Document;
      data = unmarshalledData
      
    } catch (error) {

    }
  });
      } 
    } catch (error) {
     
    }
  

    return Response.json(data ? data : {})
}


