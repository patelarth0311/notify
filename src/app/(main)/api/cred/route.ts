import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
type ResponseData = {
  message: string
}
 


export async function GET( req: NextRequest,
  res: NextResponse) {
    try {
      console.log(req)
      if (process.env.ACCESSKEYID && process.env.SECRETKEY) {

  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID , secretAccessKey: process.env.SECRETKEY
    },
  });
  const userId = req.nextUrl.searchParams.get("userId")
  const documentId = req.nextUrl.searchParams.get("documentId")
  const name = req.nextUrl.searchParams.get("name")

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
      return Response.json(unmarshalledData)
    } catch (error) {
      console.log(error);
    }
  });
      } 
    } catch (error) {
      return Response.json(error)
    }
  
}


