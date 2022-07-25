import type { NextApiRequest, NextApiResponse } from 'next';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const getItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const { commit } = query;

  if (!commit) {
    res.status(400).json({ error: 'commit is required' });
    return;
  }

  let result = null;
  let browser = null;

  if (process.env.AWS_EXECUTION_ENV) {
    // browser = await chromium.puppeteer.launch({
    //   args: chromium.args,
    //   executablePath: await chromium.executablePath,
    //   headless: chromium.headless,
    // });

    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args: [
        '--no-sandbox',
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
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

  await page.goto(commit as string, {
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
