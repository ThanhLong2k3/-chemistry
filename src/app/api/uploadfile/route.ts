import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'node:fs/promises';
import path from 'path';


export const dynamic = 'force-dynamic'; 
export const runtime = 'nodejs'; 
export const fetchCache = 'force-no-store'; 
export const preferredRegion = 'auto'; 

export async function POST(req: Request) {
  console.log('API route called');
  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files.length) {
      console.log('No files uploaded');
      return NextResponse.json({ status: 'fail', error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedPaths: string[] = [];
    for (const file of files) {
      const fileName = file.name;
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${fileName}`;
      uploadedPaths.push(fileUrl);
      console.log(`File uploaded: ${fileUrl}`);
    }

    revalidatePath('/');

    console.log('Upload successful:', uploadedPaths);
    return NextResponse.json({ status: 'success', uploadedPaths });
  } catch (e) {
    console.error('Error in API route:', e);
    return NextResponse.json({ status: 'fail', error: String(e) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Thiếu đường dẫn file' }, { status: 400 });
  }

  const fullPath = path.join(process.cwd(), 'public', filePath);

  try {
    const stats = await fs.stat(fullPath);

    if (!stats.isFile()) {
      return NextResponse.json({ error: 'File không tồn tại' }, { status: 404 });
    }

    return NextResponse.json({
      uid: stats.ino.toString(),
      name: path.basename(fullPath),
      size: stats.size,
      url: `/uploads/${path.basename(fullPath)}`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'File không tồn tại' }, { status: 404 });
  }
}