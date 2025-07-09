'use server';

import { db } from '@/lib/firebase';
import type { Word } from '@/lib/types';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export async function getUserContributions(userId: string): Promise<Word[]> {
    if (!userId) {
        return [];
    }
    
    try {
        const q = query(
            collection(db, 'words'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Word[];
    } catch (error) {
        console.error("Error fetching user contributions:", error);
        return [];
    }
}
