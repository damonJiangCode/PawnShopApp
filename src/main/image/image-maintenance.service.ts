import { connect } from "../database/connection.ts";
import { imageStorage } from "../shared/imageStorage.ts";

export const cleanupUnreferencedStagedImages = async () => {
  const client = await connect();

  try {
    const result = await client.query<{ image_path: string }>(`
      SELECT image_path FROM client WHERE image_path LIKE '.staging/%'
      UNION
      SELECT image_path FROM item WHERE image_path LIKE '.staging/%'
    `);
    const referencedPaths = new Set(
      result.rows.map((row) => row.image_path).filter(Boolean),
    );

    return imageStorage.cleanupStaging(referencedPaths);
  } finally {
    client.release();
  }
};
