import type { NextApiRequest, NextApiResponse } from 'next'
 
type ResponseData = {
  message: string
}
 


export async function GET() {

 
  return Response.json(process.env.ACCESSKEY ? process.env.ACCESSKEY : "a")
}