// framer-motion's animation engine for the `m` elements: animations, exits,
// hover, tap, focus and in-view. Loaded on demand by
// components/MotionProvider.tsx, so it is a chunk of its own. The site uses
// no layout animation or drag, which would need domMax.
import { domAnimation } from "framer-motion";

export default domAnimation;
