import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

const getItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const { url } = query;

  if (!url) {
    res.status(400).json({ error: 'url is required' });
    return;
  }

  let result = null;
  let browser = null;

  if (process.env.AWS_EXECUTION_ENV) {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
      headless: true,
    });
  } else {
    browser = await puppeteer.launch({
      args: [],
      executablePath: '/usr/bin/google-chrome',
      headless: true,
    });
  }

  const page = await browser.newPage();

  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  });

  await page.goto(url as string, {
    waitUntil: 'networkidle2',
    timeout: 15 * 1000,
  });

  result = await page.screenshot({
    type: 'png',
  });

  if (browser !== null) {
    await browser.close();
  }

  res.setHeader('Content-Type', 'image/png');
  res.end(result);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        return getItem(req, res);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
