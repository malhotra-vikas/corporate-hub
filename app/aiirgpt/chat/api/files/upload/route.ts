import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { useAuth } from "@/lib/auth-context"
import UserApi from "@/lib/api/user.api"

// Define allowed file types
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

// Define file validation schema
const FileSchema = z.object({
  file: z
    .instanceof(Blob)
    .refine((file) => file.size <= 15 * 1024 * 1024, {
      message: 'File size should be less than 15MB',
    })
    .refine((file) => allowedMimeTypes.includes(file.type), {
      message: 'File type should be JPEG, PNG, PDF, or DOCX',
    }),
});

export async function POST(request: Request) {
  const { user, loading } = useAuth()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(', ');

      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Read file buffer
    const fileBuffer = await file.arrayBuffer();
    const filename = file.name;

    try {
      const data = await put(`${filename}`, fileBuffer, {
        access: 'public',
      });

      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 },
    );
  }
}
