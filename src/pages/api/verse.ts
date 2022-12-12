import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log(req.query.range);
  const data = await fetch(
    `https://www.jw.org/pl/biblioteka/biblia/biblia-wydanie-do-studium/ksiegi/json/html/${req.query.range}`,
  ).then((response) => response.json());
  res.status(200).json({data: data});
}
