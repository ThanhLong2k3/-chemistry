import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Tạo thư mục nếu chưa có
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
    try {
        console.log("Post file new");

        const formData = await req.formData();
        const files = formData.getAll('files');

        if (!files || files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        let uploadedUrls: string[] = [];

        for (const file of files) {
            if (typeof file === 'object' && file.arrayBuffer) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `${Date.now()}-${file.name}`;
                const filePath = path.join(UPLOAD_DIR, filename);

                await writeFile(filePath, buffer);
                uploadedUrls.push(`/uploads/${filename}`);
            }
        }

        return NextResponse.json({ urls: uploadedUrls });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
