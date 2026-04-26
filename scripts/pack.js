import crx3 from "crx3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const releaseDir = path.join(rootDir, "release");

async function pack() {
  console.log("📦 Iniciando empaquetado CRX...");

  // Asegurar que la carpeta release exista
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  }

  try {
    await crx3([path.join(rootDir, "dist")], {
      crxPath: path.join(releaseDir, "whatsapp-sender.crx"),
      xmlPath: path.join(releaseDir, "update.xml"),
    });

    console.log(
      `✅ ¡Extensión empaquetada con éxito en ${path.relative(rootDir, releaseDir)}/whatsapp-sender.crx!`,
    );
  } catch (err) {
    console.error("❌ Error al empaquetar la extensión:", err);
    process.exit(1);
  }
}

pack();
