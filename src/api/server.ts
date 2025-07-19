/**
 * @Author Chhanda Charan Suna <deepak-padampur>
 * @Date 20-07-2025
 * @Description Server API entry point
 */

import express, { Request, Response } from "express";
import { PORT, API_BASE_URL } from "../const/index";

const app = express();

app.use(express.json());

app.get(`${API_BASE_URL}/health`, (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "API is running smoothly!",
  });
});

app.post(`${API_BASE_URL}/workload`, (req: Request, res: Response) => {
  const { region, type } = req.body;
  res.status(202).json({
    status: "accepted",
    message: `Workload request received for region: ${region}, type: ${type}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
