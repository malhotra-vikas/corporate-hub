"use server"

import { revalidatePath } from "next/cache"
import { getFiles, uploadFile as apiUploadFile, deleteFiles as apiDeleteFiles } from "@/lib/api/vault"
import type { File } from "@/lib/types"

export { getFiles }

export async function uploadFile(formData: FormData) {
  const file = formData.get("file")
  if (!(file instanceof File)) {
    throw new Error("No file uploaded or invalid file type")
  }

  const category = formData.get("category") as string
  if (!file) {
    throw new Error("No file uploaded")
  }

  const newFile = {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: file.type,
    size: file.size,
    uploadDate: new Date(),
    category: category || "Other",
  }

  await apiUploadFile(newFile)

  revalidatePath("/dashboard/vault")
}

export async function deleteFiles(formData: FormData) {
  const fileIds = formData.getAll("fileIds") as string[]
  if (!Array.isArray(fileIds) || fileIds.length === 0) {
    throw new Error("No files selected for deletion")
  }

  await apiDeleteFiles(fileIds)
  revalidatePath("/dashboard/vault")
}

