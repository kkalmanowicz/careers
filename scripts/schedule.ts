/**
 * schedule.ts
 * Registers a QStash schedule to trigger content refresh.
 * Run: npm run careers:schedule -- --days=14
 * Or:  npm run careers:schedule -- --days=30 (update frequency)
 */

const args = process.argv.slice(2);
const daysArg = args.find((a) => a.startsWith("--days="))?.split("=")[1];
const days = daysArg ? parseInt(daysArg, 10) : 14;

const QSTASH_TOKEN = process.env.QSTASH_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agents.abbababa.com";
const REFRESH_URL = `${SITE_URL}/api/refresh`;

if (!QSTASH_TOKEN) {
  console.error("ERROR: QSTASH_TOKEN not set");
  process.exit(1);
}

async function registerSchedule() {
  // Cron: every N days at 02:00 UTC
  const cron = `0 2 */${days} * *`;

  console.log(`Registering QStash schedule:`);
  console.log(`  Target: ${REFRESH_URL}`);
  console.log(`  Cron: ${cron} (every ${days} days at 02:00 UTC)`);

  const response = await fetch("https://qstash.upstash.io/v2/schedules", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${QSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      destination: REFRESH_URL,
      cron,
      body: JSON.stringify({ trigger: "scheduled-refresh", days }),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`QStash error: ${response.status} ${error}`);
    process.exit(1);
  }

  const result = await response.json() as { scheduleId: string };
  console.log(`\nSchedule registered successfully.`);
  console.log(`Schedule ID: ${result.scheduleId}`);
  console.log(`\nVerify at: https://console.upstash.com/qstash`);
}

registerSchedule().catch((err) => {
  console.error("Schedule registration failed:", err);
  process.exit(1);
});
