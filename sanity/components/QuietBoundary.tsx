/**
 * Keeps the form working when one of our Studio panels fails (a Studio
 * upgrade, an odd document): the panel gives way to `fallback` (nothing, or
 * Sanity's own input) and the error goes to the console. Doug must always be
 * able to edit. As EditOnThePage.tsx keeps its own button.
 */
import { Component, type ReactNode } from "react";

export default class QuietBoundary extends Component<{ children: ReactNode; fallback?: ReactNode; name: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error(`[studio] ${this.props.name} failed; the form is unaffected`, err);
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
