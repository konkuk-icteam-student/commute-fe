export function isPathActive(
  pathname: string,
  href: string,
  options: { exact?: boolean } = {},
) {
  if (options.exact) {
    return pathname === href;
  }

  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
