import { NextRequest, NextResponse } from "next/server";
import {
  getAllQueuedPosts,
  getQueuedPost,
  createQueuedPost,
  updateQueuedPost,
  deleteQueuedPost,
  type SocialPost,
  type Platform,
  type PostStatus,
} from "@/lib/social";

const ADMIN_PW = process.env.ADMIN_PASSWORD;

function auth(req: NextRequest) {
  return req.headers.get("x-admin-password") === ADMIN_PW;
}

// GET — list all queued posts, optionally filtered by status
export async function GET(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") as PostStatus | null;
  let posts = getAllQueuedPosts();

  if (status) {
    posts = posts.filter((p) => p.status === status);
  }

  return NextResponse.json({ posts, total: posts.length });
}

// POST — create a new queued post
export async function POST(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      platforms,
      content,
      media,
      blogSlug,
      scheduledFor,
      status,
    } = body as {
      platforms: Platform[];
      content: SocialPost["content"];
      media?: SocialPost["media"];
      blogSlug?: string;
      scheduledFor?: string;
      status?: PostStatus;
    };

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: "At least one platform required" }, { status: 400 });
    }
    if (!content?.text?.trim()) {
      return NextResponse.json({ error: "Content text is required" }, { status: 400 });
    }

    const post = createQueuedPost({
      platforms,
      content,
      media,
      blogSlug,
      scheduledFor,
      status: status || (scheduledFor ? "scheduled" : "draft"),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Create failed" },
      { status: 500 }
    );
  }
}

// PUT — update an existing post
export async function PUT(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body as { id: string } & Partial<SocialPost>;

    if (!id) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const updated = updateQueuedPost(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }
}

// DELETE — remove a post from the queue
export async function DELETE(req: NextRequest) {
  if (!auth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Post ID required" }, { status: 400 });
  }

  const deleted = deleteQueuedPost(id);
  if (!deleted) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
