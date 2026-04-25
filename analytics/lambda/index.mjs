import { DynamoDBClient, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({});
const TABLE = process.env.TABLE_NAME || "PageViews";

export async function handler(event) {
  const method = event.httpMethod || event.requestContext?.http?.method;
  const path = event.path || event.rawPath;
  const headers = {
    "Access-Control-Allow-Origin": "https://allierays.com",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (method === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  // POST /track — record a page view
  if (method === "POST") {
    const body = JSON.parse(event.body || "{}");
    const page = body.page || "/";
    const referrer = body.referrer || "";
    const now = new Date().toISOString();
    const date = now.slice(0, 10); // YYYY-MM-DD

    await db.send(new PutItemCommand({
      TableName: TABLE,
      Item: {
        pk: { S: `PAGE#${page}` },
        sk: { S: now },
        page: { S: page },
        referrer: { S: referrer },
        date: { S: date },
        ua: { S: (event.headers?.["user-agent"] || "").slice(0, 256) },
      },
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  // GET /stats — return page view counts
  if (method === "GET" && path?.includes("/stats")) {
    const params = event.queryStringParameters || {};
    const days = parseInt(params.days || "30", 10);
    const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

    const result = await db.send(new ScanCommand({
      TableName: TABLE,
      FilterExpression: "#d >= :since",
      ExpressionAttributeNames: { "#d": "date" },
      ExpressionAttributeValues: { ":since": { S: since } },
    }));

    // Aggregate by page
    const counts = {};
    let total = 0;
    for (const item of result.Items || []) {
      const page = item.page.S;
      counts[page] = (counts[page] || 0) + 1;
      total++;
    }

    const pages = Object.entries(counts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ total, days, pages }),
    };
  }

  return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
}
