export const ROLE_ALLOWED_ROUTES = {
  admin: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/customers",
    "/dashboard/queue",
    "/dashboard/services",
    "/dashboard/staff",
    "/dashboard/notifications",
    "/dashboard/settings",
  ],
  receptionist: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/customers",
    "/dashboard/queue",
    "/dashboard/notifications",
    "/dashboard/settings",
  ],
  staff: [
    "/dashboard",
    "/dashboard/appointments",
    "/dashboard/queue",
    "/dashboard/notifications",
    "/dashboard/settings",
  ],
};

export function isRouteAllowed(role, pathname) {
  const allowed = ROLE_ALLOWED_ROUTES[role] || [];

  return allowed.some((route) =>
    route === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(route),
  );
}