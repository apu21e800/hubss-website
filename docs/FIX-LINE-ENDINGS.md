# The 250-file phantom diff — what it is and how to clear it

## What you're seeing

`git status` in `hubss-website` reports **250 modified files**. You didn't edit
250 files. Here's the proof:

```
git diff --stat                      # 250 files, 69,472 +  69,460 −
git diff --ignore-all-space --stat   # 1 file, 12 insertions
```

Every one of those changes except twelve lines is a **newline character**.
Windows writes `\r\n`, Linux and macOS write `\n`, and with no policy in the
repo git treats a file that switched from one to the other as a complete
rewrite — delete every line, add every line back.

## Why it actually matters

It isn't cosmetic. When a real one-line fix is buried inside a 250-file diff:

- you can't review anything, so you stop reading diffs
- you can't tell whether a commit touched what you think it touched
- `git status` stops being information, so you stop trusting it
- every commit starts to feel like it might break the site

That's the "I'm scared to change anything in case I break the site" feeling.
It's not caution — it's a broken instrument.

## The fix, in two parts

**Part 1 is already done.** `.gitattributes` is committed. It tells git to
store one canonical form (LF) in the repository and check out whatever your
platform wants. Nothing about how you edit changes.

**Part 2 is a one-time renormalize** you run once, on your machine. It rewrites
the stored form of every file to match the new policy, in a single commit whose
only content is newline characters.

## Run it

Do this when you have five minutes and aren't mid-task. From
`C:\Users\cleve\Based_Agency\based-agncy_os\Web_Projects\hubss-website`:

```bash
# 0. Keep the one real change (12 lines in your editor config)
cp .claude/launch.json /tmp/launch.json.keep

# 1. Confirm for yourself that nothing else is real. Expect: 1 file, 12 lines.
git diff --ignore-all-space --stat

# 2. Drop the newline noise
git checkout -- .

# 3. Restore your editor config
cp /tmp/launch.json.keep .claude/launch.json

# 4. Renormalize everything to the new policy
git add --renormalize .

# 5. Look at what it wants to do — should be ONLY newline changes
git diff --cached --stat | tail -3
git diff --cached --ignore-all-space --stat    # expect: nothing

# 6. Commit it
git commit -m "chore(repo): renormalize line endings to the .gitattributes policy"
```

**Step 5 is the safety check.** If `git diff --cached --ignore-all-space --stat`
prints anything other than nothing, stop and send me the output — something
real got swept in and it shouldn't have.

## After

`git status` goes quiet. It only speaks up when you've actually changed
something, which is the entire point of it. From then on, a diff is a diff.

## Do this on the other repos too

The same fix applies anywhere under `Based_Agency` that shows phantom-dirty
files. Copy `.gitattributes` in, then run the same six steps.
