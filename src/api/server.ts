/**
 * @Author Chhanda Charan Suna <deepak-padampur>
 * @Date 20-07-2025
 * @Description Server API entry point
 */

import express, { Request, Response } from 'express';
import { PORT, API_BASE_URL } from '../const/index';
import { Job, scheduler } from '../scheduler';

const app = express();

app.use(express.json());

app.get(`${API_BASE_URL}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running smoothly!',
  });
});

app.post(`${API_BASE_URL}/workload`, (req: Request, res: Response) => {
  const { region, type } = req.body;
  if (!region || !type) {
    return res.status(400).json({ error: 'Region and type are required' });
  }

  const addedJob = scheduler.addJob(region, type);
  const scheduledJob = scheduler.scheduleNext();

  res.status(202).json({
    status: 'scheduled',
    message: scheduledJob || addedJob,
  });
});

app.get(`${API_BASE_URL}/jobs`, (req: Request, res: Response) => {
  const jobs: Job[] = scheduler.listJob();
  res.status(200).json({
    status: 'ok',
    message: jobs,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
