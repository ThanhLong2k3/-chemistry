import { verifyAuth } from '@/helpers/auth/auth.helper';
import { getBlogAuthorsService } from '@/helpers/services/blog.service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAuth(request, 'BLOG_MANAGE');
        if (authResult.error) return authResult.error;

        const authors = await getBlogAuthorsService();

        return NextResponse.json({
            success: true,
            data: authors
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}