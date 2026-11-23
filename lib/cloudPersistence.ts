// lib/cloudPersistence.ts
// Universal cloud-native persistence adapter: seamlessly bridges PostgreSQL,
// serverless ephemeral memory, and local filesystem caching.

async function getNodeModules() {
  if (typeof window !== "undefined") return null;
  try {
    const [fsMod, pathMod, dbMod] = await Promise.all([
      import("fs"),
      import("path"),
      import("@/lib/db"),
    ]);
    return {
      fs: fsMod.default || fsMod,
      path: pathMod.default || pathMod,
      db: dbMod.db,
    };
  } catch {
    return null;
  }
}

const DATA_DIR_NAME = "data";

/**
 * Loads a persistent collection by key with hierarchical fallback:
 * 1. Database (PostgreSQL Organization / AuditLog durable store) in production
 * 2. Local filesystem JSON cache if writable (local development)
 * 3. In-memory static defaults
 */
export async function loadCloudCollection<T>(
  collectionKey: string,
  defaultItems: T[]
): Promise<T[]> {
  if (typeof window !== "undefined") return defaultItems;

  const node = await getNodeModules();
  if (node) {
    // 1. Try PostgreSQL durable storage first (essential for serverless Vercel)
    if (node.db) {
      try {
        const org = await node.db.organization.findFirst({
          select: { id: true, brandVoiceJson: true },
        });

        if (org) {
          // If loading brand-voice, check direct org column
          if (collectionKey === "brand-voice" && org.brandVoiceJson) {
            try {
              const parsed = JSON.parse(org.brandVoiceJson);
              if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed as T[];
              }
            } catch {
              // Parse error fallback
            }
          }

          // Check latest snapshot stored in durable AuditLog
          const latestLog = await node.db.auditLog.findFirst({
            where: {
              organizationId: org.id,
              action: `PERSISTENT_COLLECTION:${collectionKey.toUpperCase()}`,
            },
            orderBy: { createdAt: "desc" },
            select: { diffJson: true },
          });

          if (latestLog?.diffJson) {
            try {
              const parsed = JSON.parse(latestLog.diffJson);
              if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed as T[];
              }
            } catch {
              // Parse error fallback
            }
          }
        }
      } catch {
        // DB read fallback
      }
    }

    // 2. Try local filesystem if available (development / container environments)
    try {
      const dataDir = node.path.join(process.cwd(), DATA_DIR_NAME);
      const filePath = node.path.join(dataDir, `${collectionKey}.json`);
      if (node.fs.existsSync(filePath)) {
        const raw = node.fs.readFileSync(filePath, "utf-8");
        return JSON.parse(raw) as T[];
      }
    } catch {
      // Silent fallback to default items
    }
  }

  return defaultItems;
}

/**
 * Saves a persistent collection across both cloud database and filesystem cache.
 * Fully durable in serverless read-only runtimes like Vercel.
 */
export async function saveCloudCollection<T>(
  collectionKey: string,
  items: T[]
): Promise<boolean> {
  if (typeof window !== "undefined") return false;

  let savedSuccessfully = false;
  const node = await getNodeModules();
  if (node) {
    const jsonPayload = JSON.stringify(items);

    // 1. Persist to PostgreSQL (durable across all serverless instances and cold starts)
    if (node.db) {
      try {
        const org = await node.db.organization.findFirst({ select: { id: true } });
        if (org) {
          if (collectionKey === "brand-voice") {
            await node.db.organization.update({
              where: { id: org.id },
              data: { brandVoiceJson: jsonPayload },
            });
          }

          // Save durable snapshot in AuditLog
          await node.db.auditLog.create({
            data: {
              organizationId: org.id,
              action: `PERSISTENT_COLLECTION:${collectionKey.toUpperCase()}`,
              resourceType: "SYSTEM_COLLECTION",
              resourceId: collectionKey,
              diffJson: jsonPayload,
              ipAddress: "127.0.0.1",
            },
          });
          savedSuccessfully = true;
        }
      } catch (dbErr) {
        console.warn(`[CloudPersistence] DB save failed for ${collectionKey}:`, dbErr);
      }
    }

    // 2. Also write to filesystem if environment allows (local development)
    try {
      const dataDir = node.path.join(process.cwd(), DATA_DIR_NAME);
      if (!node.fs.existsSync(dataDir)) {
        node.fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = node.path.join(dataDir, `${collectionKey}.json`);
      node.fs.writeFileSync(filePath, JSON.stringify(items, null, 2), "utf-8");
      savedSuccessfully = true;
    } catch {
      // Expected in read-only serverless lambdas
    }
  }

  return savedSuccessfully;
}
