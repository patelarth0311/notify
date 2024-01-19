import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';


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

  const s3client = new S3Client({
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
  const formData = await req.blob()
  const file = formData as File

  try {

    const args: UpdateItemInput = {
        TableName: "NotifyNew",
        Key: {
          userId: { S: userId },
          documentId: { S: documentId },
        },
        UpdateExpression: "SET documentImageURL = :value",
        ExpressionAttributeValues: {
          ":value": {
            S: `https://${"notifydocuments"}.s3.${"us-east-1"}.amazonaws.com/${
              file.name
            }`,
          },
        },
  
        ReturnValues: "ALL_NEW",
      };
      const command = new PutObjectCommand({
        Bucket: "notifydocuments",
        Key: file.name,
        Body: file,
      });
      const updating = new UpdateItemCommand(args);
  
      try {
        await s3client.send(command);
        const res = await client.send(updating);
        data  = unmarshall(res.Attributes!) as Document;
      } catch (err) {
        console.error(err);
      }
    
  } catch (error) {
    console.log(error);
  }

      } 
    } catch (error) {
     
    }
  

    return Response.json(data ? data : {})
}


