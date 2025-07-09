// In a production app, this data would be stored in a database
// and managed via a secure API. For this demo, we are using a static list.

// This user has full control and can manage other admins.
// To make yourself the superadmin, log in and find your UID in the browser console,
// then replace the placeholder below.
export const SUPERADMIN_UID = 'PLACEHOLDER_SUPERADMIN_UID';

// These users have access to the standard admin dashboard.
export const adminUids = [
    'PLACEHOLDER_ADMIN_UID', // This is the original placeholder
    // More admin UIDs can be added here
];

// Combine them for easier checking of general admin access
export const ALL_ADMIN_UIDS = [SUPERADMIN_UID, ...adminUids];
