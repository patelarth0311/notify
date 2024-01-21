import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
type ResponseData = {
  message: string
}
export const dynamic = "force-dynamic";


export async function POST( req: NextRequest,
  res: NextResponse) {
    try {
     
      if (process.env.ACCESSKEYID && process.env.SECRETKEY) {

  const client = new DynamoDBClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.ACCESSKEYID , secretAccessKey: process.env.SECRETKEY
    },
  });

  const options = {
    removeUndefinedValues: true,
    convertEmptyValues: true,
  };

  marshall({}, options);
  
  const userId = req.nextUrl.searchParams.get("userId")!
  const documentId = req.nextUrl.searchParams.get("documentId")!
  var data = undefined
  const content = await req.json()

  try {

      const params: UpdateItemInput = {
        TableName: "NotifyNew",
        Key: {
          userId: { S: userId },
          documentId: { S: documentId },
        },
        UpdateExpression: "SET content = :value",
        ExpressionAttributeValues: marshall(
          {
            ":value": content
          },
          options
        ),
        ReturnValues: "ALL_NEW",
      };
      const updating = new UpdateItemCommand(params);
      await client.send(updating).then((res) => {
        const unmarshalledData = unmarshall(res.Attributes!) as Document;
        data = unmarshalledData
      });
    
  } catch (error) {
    console.log(error);
  }

      } 
    } catch (error) {
     
    }
  

    return Response.json(data ? data : {})
}


