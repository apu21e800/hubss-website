# Parked

`loading.tsx` was the site's root loading boundary: between pages it replaced
everything, the bar included, with a black screen and a "LOADING" spinner for
160 to 370 ms on any click whose destination was not prefetched (interaction
review, 17 Oct 2026). Without a root boundary Next keeps the page you are on
until the next one is ready, and components/NavigationProgress.tsx draws a
thin orange line under the bar while it loads. A folder starting with `_` is
outside the router, so nothing here runs. Delete the folder when the new
behaviour is confirmed on hubss.com (`git rm -r app/_parked`).
