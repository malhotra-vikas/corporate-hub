import type { VaultFile } from "@/lib/types"
import VaultApi from "./vault.api"

const dummyFiles: VaultFile[] = [
]

const vaultApi = new VaultApi()


export async function uploadFile(file: VaultFile): Promise<VaultFile> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const newFile = { ...file, id: (dummyFiles.length + 1).toString() }
  dummyFiles.push(newFile)
  return newFile
}

export async function deleteFiles(fileIds: string[]): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  fileIds.forEach((id) => {
    const index = dummyFiles.findIndex((file) => file.id === id)
    if (index !== -1) {
      dummyFiles.splice(index, 1)
    }
  })
}


