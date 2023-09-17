import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req, res) {
    if (req.method === 'POST') {
        const body = JSON.parse(req.body);
    }else {
        res.status(200).json({ message: 'Hello from Next.js!' })
    }
}