"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MenuItem, NavMenu } from "@/lib/nav-menu";

/**
 * The menus' names and pictures (lib/nav-menu.ts) for the bar and its panels.
 * app/layout.tsx works them out on the server and hands them down here, the
 * way it hands down Site Settings, so the product and application copy stays
 * out of every page's JavaScript.
 */
const NavMenuContext = createContext<NavMenu>({ families: {}, groups: {} });

export function NavMenuProvider({ menu, children }: { menu: NavMenu; children: ReactNode }) {
  return <NavMenuContext.Provider value={menu}>{children}</NavMenuContext.Provider>;
}

/** The menus' names: `families` by product family, `groups` by application group. */
export function useNavMenu(): NavMenu {
  return useContext(NavMenuContext);
}

/** The names under a product family, in the menu's order. */
export function familyItems(menu: NavMenu, label: string): MenuItem[] {
  return menu.families[label] ?? [];
}

/** The names under an application group, in the menu's order. */
export function groupItems(menu: NavMenu, label: string): MenuItem[] {
  return menu.groups[label] ?? [];
}
