import { DynamoDBClient, UpdateItemCommand, UpdateItemInput } from '@aws-sdk/client-dynamodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest, NextResponse } from 'next/server';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { join } from 'path';

import { writeFile } from 'fs/promises';

type ResponseData = {
  message: string
}
export const dynamic = "force-dynamic";


  


export async function PUT( req: NextRequest,
  res: NextResponse) {
    try {

    
     
      if (process.env.ACCESSKEYID &&  process.env.SECRETKEY) {

  const s3client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESSKEYID , secretAccessKey: process.env.SECRETKEY
    },
  });



  
  var data : string | undefined = undefined
  const formData = await req.formData()
  const file = formData.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({success: false})
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)


  try {


      const command = new PutObjectCommand({
        Bucket: "notifydocument",
        Key: file.name,
        Body: buffer,
      });

      try {
        await s3client.send(command).then((res) => {
            data = `https://${"notifydocuments"}.s3.${"us-east-1"}.amazonaws.com/${
                file.name
              }`
        });
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


