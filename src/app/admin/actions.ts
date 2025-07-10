"use server";

import { db } from "@/lib/firebase";
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

export type AdminDashboardCounts = {
    published: number;
    pending: number;
    flagged: number;
    categories: number;
    locations: number;
};

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
    try {
        const publishedQuery = query(collection(db, 'words'), where('status', '==', 'published'), where('isFlagged', '==', false));
        const pendingQuery = query(collection(db, 'words'), where('status', '==', 'pending'));
        const flaggedQuery = query(collection(db, 'words'), where('isFlagged', '==', true));
        const categoriesQuery = collection(db, 'categories');
        const locationsQuery = collection(db, 'locations');

        const [publishedSnap, pendingSnap, flaggedSnap, categoriesSnap, locationsSnap] = await Promise.all([
            getCountFromServer(publishedQuery),
            getCountFromServer(pendingQuery),
            getCountFromServer(flaggedQuery),
            getCountFromServer(categoriesQuery),
            getCountFromServer(locationsQuery)
        ]);

        return {
            published: publishedSnap.data().count,
            pending: pendingSnap.data().count,
            flagged: flaggedSnap.data().count,
            categories: categoriesSnap.data().count,
            locations: locationsSnap.data().count,
        };
    } catch (error) {
        console.error("Error fetching admin counts:", error);
        // Return zeroed-out counts on error
        return { published: 0, pending: 0, flagged: 0, categories: 0, locations: 0 };
    }
}
