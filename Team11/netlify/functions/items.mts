import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { and, asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { items } from "../../db/schema.js";

const CATEGORIES = ["Academic", "Expense", "Personal", "Exam"];
const PRIORITIES = ["Low", "Normal", "High"];
const REMINDERS = ["none", "same_day", "1_day"];

type ItemInput = {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number | null;
  priority: string;
  reminder: string;
};

// Validate and normalise an item sent by the browser. Returns null if it is unusable.
function parseItem(raw: any): ItemInput | null {
  if (!raw || typeof raw !== "object") return null;
  const id = String(raw.id ?? "").slice(0, 64);
  const title = String(raw.title ?? "").trim().slice(0, 200);
  const date = String(raw.date ?? "");
  if (!id || !title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const amount = raw.amount === null || raw.amount === undefined || raw.amount === "" ? null : Number(raw.amount);
  return {
    id,
    title,
    date,
    category: CATEGORIES.includes(raw.category) ? raw.category : "Personal",
    amount: amount !== null && Number.isFinite(amount) ? amount : null,
    priority: PRIORITIES.includes(raw.priority) ? raw.priority : "Normal",
    reminder: REMINDERS.includes(raw.reminder) ? raw.reminder : "none",
  };
}

function listFor(userId: string) {
  return db
    .select({
      id: items.id,
      title: items.title,
      category: items.category,
      date: items.date,
      amount: items.amount,
      priority: items.priority,
      reminder: items.reminder,
    })
    .from(items)
    .where(eq(items.userId, userId))
    .orderBy(asc(items.date), asc(items.createdAt));
}

export default async (req: Request) => {
  const user = await getUser();
  if (!user) return Response.json({ error: "Not logged in" }, { status: 401 });

  // GET /api/items — all of the user's items
  if (req.method === "GET") {
    return Response.json(await listFor(user.id));
  }

  // POST /api/items — add one item
  if (req.method === "POST") {
    const item = parseItem(await req.json().catch(() => null));
    if (!item) return Response.json({ error: "Invalid item" }, { status: 400 });
    await db
      .insert(items)
      .values({ ...item, userId: user.id })
      .onConflictDoUpdate({ target: [items.userId, items.id], set: item });
    return Response.json(item, { status: 201 });
  }

  // PUT /api/items — replace the whole list (import, demo reset, first-login migration)
  if (req.method === "PUT") {
    const body = await req.json().catch(() => null);
    if (!Array.isArray(body)) return Response.json({ error: "Expected an array" }, { status: 400 });
    const seen = new Set<string>();
    const rows = body
      .map(parseItem)
      .filter((i): i is ItemInput => !!i && !seen.has(i.id) && !!seen.add(i.id))
      .slice(0, 5000)
      .map((i) => ({ ...i, userId: user.id }));
    await db.transaction(async (tx) => {
      await tx.delete(items).where(eq(items.userId, user.id));
      if (rows.length) await tx.insert(items).values(rows);
    });
    return Response.json(await listFor(user.id));
  }

  // DELETE /api/items?id=... — remove one item
  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    await db.delete(items).where(and(eq(items.userId, user.id), eq(items.id, id)));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/items",
};
