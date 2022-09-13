import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query

  try {
    if (req.method === "GET") {
      res.status(200).json({"email": email})
    }
  } catch (error) {
    res.status(400).end()
  }  
}
