import { copyFile } from "node:fs/promises"

for (const file of ["LICENSE"]) {
  await copyFile(
    new URL(`../${file}`, import.meta.url),
    new URL(`../packages/onedocs/${file}`, import.meta.url)
  )
}
