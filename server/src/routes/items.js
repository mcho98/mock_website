import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

// In-memory store; swap for a real database when the data model is known.
const items = new Map();

function validate(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      errors.push("name must be a non-empty string");
    }
  }
  if (body.description !== undefined && typeof body.description !== "string") {
    errors.push("description must be a string");
  }
  return errors;
}

function badRequest(res, errors) {
  return res.status(400).json({ error: "Validation failed", details: errors });
}

router.get("/", (_req, res) => {
  res.json([...items.values()]);
});

router.get("/:id", (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

router.post("/", (req, res) => {
  const errors = validate(req.body ?? {});
  if (errors.length) return badRequest(res, errors);
  const now = new Date().toISOString();
  const item = {
    id: randomUUID(),
    name: req.body.name.trim(),
    description: req.body.description ?? "",
    createdAt: now,
    updatedAt: now,
  };
  items.set(item.id, item);
  res.status(201).json(item);
});

router.patch("/:id", (req, res) => {
  const item = items.get(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  const body = req.body ?? {};
  const errors = validate(body, { partial: true });
  if (errors.length) return badRequest(res, errors);
  if (body.name !== undefined) item.name = body.name.trim();
  if (body.description !== undefined) item.description = body.description;
  item.updatedAt = new Date().toISOString();
  res.json(item);
});

router.delete("/:id", (req, res) => {
  if (!items.delete(req.params.id)) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.status(204).end();
});

export default router;
