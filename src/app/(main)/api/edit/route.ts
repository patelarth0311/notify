import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
type ResponseData = {
  message: string
}
export const dynamic = "force-dynamic";
import fs from 'fs';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

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
  const {content, curBlockId, text} = await req.json()

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

      const filePath = `/tmp/${curBlockId}.txt`;
      await fs.promises.writeFile(filePath, content);

      const command = new PutObjectCommand({
        Bucket: "notifydocumentz",
        Key: `1/${curBlockId}.txt`,
        Body:await fs.promises.readFile(filePath)
      });

      
      
  
      await s3client.send(command);
    
  } catch (error) {
    console.log(error);
  }

      } 
    } catch (error) {
     
    }
  

    return Response.json(data ? data : {})
}


