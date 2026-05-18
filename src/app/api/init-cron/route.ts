import { startTransactionCheckCron } from "@/lib/cron";

let isCronStarted = false;

export async function GET() {
    if (isCronStarted) {
        return Response.json({ message: "Cron already running" });
    }

    isCronStarted = true;

    startTransactionCheckCron();

    return Response.json({ message: "Cron started" });
}