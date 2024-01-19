import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 


export async function GET() {

 
  return Response.json(process.env.ACCESSKEYID ? process.env.ACCESSKEYID: "a")
}