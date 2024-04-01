// pages/api/increment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';

let count = 0;
let lastIncrementTime = 0; // Initialize to 0

const storageFilePath = './storage.json';

const saveStateToFile = async () => {
  const state = { count, lastIncrementTime };
  await fs.writeFile(storageFilePath, JSON.stringify(state));
};

const loadStateFromFile = async () => {
  try {
    const data = await fs.readFile(storageFilePath);
    const state = JSON.parse(data.toString());
    count = state.count;
    lastIncrementTime = state.lastIncrementTime;
  } catch (error) {
    console.error('Error loading state from file:', error);
  }
};

const scheduleHourlyTask = () => {
  setInterval(async () => {
    if (lastIncrementTime !== 0) {
      const currentTime = Date.now();
      const timeDifferenceHours = (currentTime - lastIncrementTime) / (1000 * 60 * 60);

      // Increment count based on time elapsed
      count += 0.1 * timeDifferenceHours;

      lastIncrementTime = currentTime;

      await saveStateToFile();
    }
  }, 3600000); // 1 hour in milliseconds
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await loadStateFromFile();

  if (req.method === 'POST') {
    const currentTime = Date.now();

    // Increment count immediately upon button click
    if (lastIncrementTime === 0) {
      lastIncrementTime = currentTime;
    } else {
      const timeDifferenceHours = (currentTime - lastIncrementTime) / (1000 * 60 * 60);

      // Increment count based on time elapsed
      count += 0.1 * timeDifferenceHours;

      lastIncrementTime = currentTime;
    }

    // Format count with four decimal places
    const formattedCount = count.toFixed(4);

    await saveStateToFile();

    res.status(200).json({ count: formattedCount });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Start the hourly task only once
  if (lastIncrementTime !== 0) {
    scheduleHourlyTask();
  }
}
