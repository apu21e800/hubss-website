"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Clock,
  Sparkles,
  Trash2,
  Edit3,
  Eye,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  RefreshCw,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";

// ── Types (mirrors lib/social.ts) ──────────────────────────────

type Platform = "linkedin" | "facebook" | "instagram" | "x";
type PostStatus = "draft" | "scheduled" | "posted" | "failed";

interface SocialPost {
  id: string;
  platforms: Platform[];
  status: PostStatus;
  content: {
    text: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
  };
  media?: { url: string; alt: string };
  blogSlug?: string;
  scheduledFor?: string;
  postedAt?: string;
  postUrls?: Partial<Record<Platform, string>>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Constants ──────────────────────────────────────────────────

const PLATFORM_META: Record<Platform, { name: string; color: string; icon: typeof Linkedin; maxLen: number }> = {
  linkedin:  { name: "LinkedIn",  color: "#0A66C2", icon: Linkedin,  maxLen: 3000 },
  facebook:  { name: "Facebook",  color: "#1877F2", icon: Facebook,  maxLen: 63206 },
  instagram: { name: "Instagram", color: "#E4405F", icon: Instagram, maxLen: 2200 },
  x:         { name: "X",         color: "#000",    icon: Twitter,   maxLen: 280 },
};

const STATUS_CONFIG: Record<PostStatus, { label: string; color: string; icon: typeof Clock }> = {
  draft:     { label: "Draft",     color: "text-[var(--text-muted)] bg-gray-500/10 border-gray-500/20", icon: Edit3 },
  scheduled: { label: "Scheduled", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", icon: Clock },
  posted:    { label: "Posted",    color: "text-[var(--ok-text)] bg-green-500/10 border-green-500/20", icon: CheckCircle2 },
  failed:    { label: "Failed",    color: "text-[var(--err-text)] bg-red-500/10 border-red-500/20", icon: XCircle },
};

const ALL_PLATFORMS: Platform[] = ["linkedin", "facebook", "instagram", "x"];

// ── Component ──────────────────────────────────────────────────

export default function SocialAdminPage() {
  // Auth
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  // Queue state
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<PostStatus | "all">("all");

  // Generator state
  const [generating, setGenerating] = useState(false);
  const [genBlogSlug, setGenBlogSlug] = useState("");
  const [genTopic, setGenTopic] = useState("");
  const [genPlatforms, setGenPlatforms] = useState<Platform[]>([...ALL_PLATFORMS]);
  const [genTone, setGenTone] = useState<"professional" | "engaging" | "casual">("professional");
  const [generatedContent, setGeneratedContent] = useState<Record<string, string> | null>(null);
  const [genBlogTitle, setGenBlogTitle] = useState("");

  // Editor state
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [editText, setEditText] = useState("");
  const [editPlatforms, setEditPlatforms] = useState<Platform[]>([]);
  const [editSchedule, setEditSchedule] = useState("");

  // UI state
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [posting, setPosting] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<Platform>("linkedin");
  const [blogPosts, setBlogPosts] = useState<{ slug: string; title: string }[]>([]);

  const headers = useCallback(
    () => ({ "x-admin-password": password, "Content-Type": "application/json" }),
    [password]
  );

  // ── Data fetching ────────────────────────────────────────────

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = filter !== "all" ? `?status=${filter}` : "";
      const res = await fetch(`/api/social/schedule${statusParam}`, { headers: headers() });
      if (res.status === 401) { setAuthed(false); return; }
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setError("Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, [filter, headers]);

  // Load blog posts for the generator dropdown
  const loadBlogPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/blog/drafts", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        // The drafts endpoint returns drafts; we also want published posts
        // Use a simple fetch that just gets titles + slugs
        setBlogPosts(data.drafts?.map((d: { slug: string; title: string }) => ({ slug: d.slug, title: d.title })) ?? []);
      }
    } catch { /* optional */ }
  }, [headers]);

  useEffect(() => {
    if (authed) {
      loadQueue();
      loadBlogPosts();
    }
  }, [authed, loadQueue, loadBlogPosts]);

  // ── Actions ──────────────────────────────────────────────────

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthed(true);
  };

  async function generatePosts() {
    setGenerating(true);
    setError("");
    setGeneratedContent(null);
    try {
      const body: Record<string, unknown> = { platforms: genPlatforms, tone: genTone };
      if (genBlogSlug) body.blogSlug = genBlogSlug;
      else if (genTopic) body.topic = genTopic;

      const res = await fetch("/api/social/generate", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(body),
      });
      if (res.status === 401) { setAuthed(false); return; }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Generation failed");
        return;
      }
      const data = await res.json();
      setGeneratedContent(data.generated);
      setGenBlogTitle(data.blogTitle || genTopic || "Custom post");
    } catch {
      setError("Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function queueGenerated() {
    if (!generatedContent) return;
    setError("");
    try {
      const content: SocialPost["content"] = {
        text: generatedContent[genPlatforms[0]] || Object.values(generatedContent)[0] || "",
      };
      // Set platform-specific overrides
      for (const p of genPlatforms) {
        if (generatedContent[p]) {
          (content as Record<string, string>)[p] = generatedContent[p];
        }
      }

      const res = await fetch("/api/social/schedule", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          platforms: genPlatforms,
          content,
          blogSlug: genBlogSlug || undefined,
          status: "draft",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to queue");
        return;
      }
      setMessage("Post added to queue as draft");
      setGeneratedContent(null);
      setGenBlogSlug("");
      setGenTopic("");
      setShowGenerator(false);
      loadQueue();
    } catch {
      setError("Failed to queue post");
    }
  }

  async function publishPost(id: string, platforms?: Platform[]) {
    setPosting(id);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/social/post", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ postId: id, platforms }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Post failed");
        return;
      }
      const data = await res.json();
      if (data.allSucceeded) {
        setMessage("Published successfully!");
      } else {
        const failures = data.results.filter((r: { success: boolean }) => !r.success);
        setError(`Partial: ${failures.length} platform(s) failed`);
      }
      loadQueue();
    } catch {
      setError("Post failed");
    } finally {
      setPosting(null);
    }
  }

  async function deletePost(id: string) {
    try {
      const res = await fetch(`/api/social/schedule?id=${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (!res.ok) {
        setError("Delete failed");
        return;
      }
      setMessage("Post deleted");
      loadQueue();
    } catch {
      setError("Delete failed");
    }
  }

  async function saveEdit() {
    if (!editingPost) return;
    try {
      const content: SocialPost["content"] = { text: editText };
      const res = await fetch("/api/social/schedule", {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({
          id: editingPost.id,
          content,
          platforms: editPlatforms,
          scheduledFor: editSchedule || undefined,
          status: editSchedule ? "scheduled" : editingPost.status,
        }),
      });
      if (!res.ok) {
        setError("Save failed");
        return;
      }
      setMessage("Post updated");
      setEditingPost(null);
      loadQueue();
    } catch {
      setError("Save failed");
    }
  }

  function startEdit(post: SocialPost) {
    setEditingPost(post);
    setEditText(post.content.text);
    setEditPlatforms([...post.platforms]);
    setEditSchedule(post.scheduledFor ? post.scheduledFor.slice(0, 16) : "");
  }

  // ── Login screen ─────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-[var(--bg-deepest)] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Social Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Enter admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-card-neutral)] border border-[var(--border-strong)] text-[var(--text-primary)] placeholder-gray-600 focus:outline-none focus:border-orange-500/50 mb-4"
          />
          <button
            type="submit"
            className="w-full btn-primary py-3 rounded-lg font-semibold text-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  // ── Main dashboard ───────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[var(--bg-deepest)] text-[var(--text-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-strong)] bg-[#0a0a0a]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-body)] text-sm">
              HUBSS
            </Link>
            <span className="text-[var(--text-hint)]">/</span>
            <h1 className="text-lg font-bold">Social Media</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowGenerator(!showGenerator)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-medium hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate
            </button>
            <button
              onClick={loadQueue}
              className="p-2 rounded-lg border border-[var(--border-strong)] text-[var(--text-muted)] hover:text-[var(--text-body)] hover:border-[var(--border-color)] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Messages */}
        {message && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-[var(--ok-text)] text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
            <button onClick={() => setMessage("")} className="ml-auto text-green-400/50 hover:text-[var(--ok-text)]">&times;</button>
          </div>
        )}
        {error && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[var(--err-text)] text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400/50 hover:text-[var(--err-text)]">&times;</button>
          </div>
        )}

        {/* ── AI Generator Panel ──────────────────────────────── */}
        {showGenerator && (
          <div className="mb-8 p-6 rounded-xl bg-[var(--bg-card-neutral)] border border-[var(--border-strong)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-text)]" />
                AI Post Generator
              </h2>
              <button onClick={() => setShowGenerator(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-body)]">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Source</label>
                <select
                  value={genBlogSlug}
                  onChange={(e) => { setGenBlogSlug(e.target.value); if (e.target.value) setGenTopic(""); }}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm mb-3"
                >
                  <option value="">Select a blog post...</option>
                  {blogPosts.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.title}</option>
                  ))}
                </select>
                <div className="text-xs text-[var(--text-secondary)] mb-2">— or custom topic —</div>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => { setGenTopic(e.target.value); if (e.target.value) setGenBlogSlug(""); }}
                  placeholder="e.g. Vision Zero crosswalk safety"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-2">Platforms</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ALL_PLATFORMS.map((p) => {
                    const meta = PLATFORM_META[p];
                    const active = genPlatforms.includes(p);
                    return (
                      <button
                        key={p}
                        onClick={() => setGenPlatforms(active ? genPlatforms.filter((x) => x !== p) : [...genPlatforms, p])}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          active
                            ? "border-orange-500/30 bg-orange-500/10 text-[var(--accent-text)]"
                            : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-color)]"
                        }`}
                      >
                        <meta.icon className="w-3.5 h-3.5" />
                        {meta.name}
                      </button>
                    );
                  })}
                </div>

                <label className="block text-sm text-[var(--text-muted)] mb-2">Tone</label>
                <div className="flex gap-2">
                  {(["professional", "engaging", "casual"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setGenTone(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                        genTone === t
                          ? "border-orange-500/30 bg-orange-500/10 text-[var(--accent-text)]"
                          : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-color)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate button */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={generatePosts}
                disabled={generating || (!genBlogSlug && !genTopic)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? "Generating..." : "Generate Posts"}
              </button>
            </div>

            {/* Generated preview */}
            {generatedContent && (
              <div className="mt-6 border-t border-[var(--border-strong)] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[var(--text-body)]">
                    Generated: {genBlogTitle}
                  </h3>
                  <button
                    onClick={queueGenerated}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500/30 text-[var(--accent-text)] text-sm font-medium hover:bg-orange-500/10 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Queue
                  </button>
                </div>

                {/* Platform tabs */}
                <div className="flex gap-1 mb-4">
                  {genPlatforms.map((p) => {
                    const meta = PLATFORM_META[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setPreviewPlatform(p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          previewPlatform === p
                            ? "bg-[var(--bg-card)] text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-body)]"
                        }`}
                      >
                        <meta.icon className="w-3.5 h-3.5" />
                        {meta.name}
                      </button>
                    );
                  })}
                </div>

                {/* Content preview */}
                <div className="bg-[var(--bg-card)] rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-[var(--text-body)] font-sans leading-relaxed">
                    {generatedContent[previewPlatform] || "No content for this platform"}
                  </pre>
                  <div className="mt-3 text-xs text-[var(--text-secondary)]">
                    {(generatedContent[previewPlatform] || "").length} / {PLATFORM_META[previewPlatform].maxLen} characters
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Edit Modal ──────────────────────────────────────── */}
        {editingPost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-[var(--bg-card-neutral)] rounded-xl border border-[var(--border-strong)] p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Edit Post</h2>
                <button onClick={() => setEditingPost(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-body)]">&times;</button>
              </div>

              {/* Platforms */}
              <label className="block text-sm text-[var(--text-muted)] mb-2">Platforms</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {ALL_PLATFORMS.map((p) => {
                  const meta = PLATFORM_META[p];
                  const active = editPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => setEditPlatforms(active ? editPlatforms.filter((x) => x !== p) : [...editPlatforms, p])}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active ? "border-orange-500/30 bg-orange-500/10 text-[var(--accent-text)]" : "border-[var(--border-color)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <meta.icon className="w-3.5 h-3.5" />
                      {meta.name}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <label className="block text-sm text-[var(--text-muted)] mb-2">Content</label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] resize-y mb-1"
              />
              <div className="text-xs text-[var(--text-secondary)] mb-4">{editText.length} characters</div>

              {/* Schedule */}
              <label className="block text-sm text-[var(--text-muted)] mb-2">Schedule (optional)</label>
              <input
                type="datetime-local"
                value={editSchedule}
                onChange={(e) => setEditSchedule(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] mb-6"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] text-sm hover:text-[var(--text-body)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Strip ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(["draft", "scheduled", "posted", "failed"] as PostStatus[]).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            const count = posts.filter((p) => p.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(filter === s ? "all" : s)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  filter === s ? "border-orange-500/30 bg-orange-500/5" : "border-[var(--border-strong)] bg-[var(--bg-card-neutral)] hover:border-[var(--border-color)]"
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${filter === s ? "text-[var(--accent-text)]" : "text-[var(--text-secondary)]"}`} />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-[var(--text-secondary)] capitalize">{s}</div>
              </button>
            );
          })}
        </div>

        {/* ── Queue ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            Queue
            {filter !== "all" && (
              <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">
                — {filter}
                <button onClick={() => setFilter("all")} className="ml-2 text-[var(--accent-text)] hover:text-[var(--accent-soft-text)]">clear</button>
              </span>
            )}
          </h2>
          <div className="text-sm text-[var(--text-secondary)]">{posts.length} post{posts.length !== 1 ? "s" : ""}</div>
        </div>

        {loading && posts.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-secondary)]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading queue...
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-[var(--text-hint)] mx-auto mb-3" />
            <p className="text-[var(--text-secondary)] mb-2">No posts in queue</p>
            <button
              onClick={() => setShowGenerator(true)}
              className="text-sm text-[var(--accent-text)] hover:text-[var(--accent-soft-text)]"
            >
              Generate your first post
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => {
              const statusCfg = STATUS_CONFIG[post.status];
              const StatusIcon = statusCfg.icon;
              return (
                <div
                  key={post.id}
                  className="rounded-xl bg-[var(--bg-card-neutral)] border border-[var(--border-strong)] p-5 transition-all hover:border-[var(--border-color)]"
                >
                  {/* Top row: platforms + status + date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {post.platforms.map((p) => {
                        const meta = PLATFORM_META[p];
                        const Icon = meta.icon;
                        return (
                          <span
                            key={p}
                            className="flex items-center gap-1 text-xs text-[var(--text-muted)]"
                            title={meta.name}
                          >
                            <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                          </span>
                        );
                      })}
                      {post.blogSlug && (
                        <Link
                          href={`/blog/${post.blogSlug}`}
                          className="text-xs text-orange-400/60 hover:text-[var(--accent-text)] ml-2"
                        >
                          from blog
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md border ${statusCfg.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="text-sm text-[var(--text-body)] line-clamp-3 mb-3 leading-relaxed">
                    {post.content.text}
                  </p>

                  {/* Error */}
                  {post.error && (
                    <p className="text-xs text-[var(--err-text)] bg-red-500/5 rounded px-2 py-1 mb-3">
                      {post.error}
                    </p>
                  )}

                  {/* Post URLs */}
                  {post.postUrls && Object.keys(post.postUrls).length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {Object.entries(post.postUrls).map(([platform, url]) => {
                        const meta = PLATFORM_META[platform as Platform];
                        if (!meta || !url) return null;
                        const Icon = meta.icon;
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-body)]"
                          >
                            <Icon className="w-3 h-3" />
                            View
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Meta + actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[var(--text-hint)]">
                      {post.scheduledFor && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.scheduledFor).toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(post)}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-body)] hover:bg-[var(--bg-card)] transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {(post.status === "draft" || post.status === "scheduled" || post.status === "failed") && (
                        <button
                          onClick={() => publishPost(post.id)}
                          disabled={posting === post.id}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-text)] hover:bg-[var(--bg-card)] transition-colors disabled:opacity-40"
                          title="Publish now"
                        >
                          {posting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => { if (confirm("Delete this post?")) deletePost(post.id); }}
                        className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--err-text)] hover:bg-[var(--bg-card)] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
