
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../services/firebase';
import { startDB } from '../database/dbsqlite';
import {
    syncNow,
    startSyncOnReconnect,
} from '../services/syncService';

export function useSync() {
    const [ready, setReady] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        let stopNetworkListener: (() => void) | undefined;

        async function initialize() {
            try {
                await startDB();

                if (!cancelled) setReady(true);
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e instanceof Error ? e.message : 'Erro ao inicializar o banco.',
                    );
                }
            }
        }

        void initialize();

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            stopNetworkListener?.();
            stopNetworkListener = undefined;

            if (!user || cancelled) return;

            try {
                await startDB();

                if (cancelled) return;

                setSyncing(true);
                await syncNow(user.uid);

                if (cancelled) return;

                setError(null);
                stopNetworkListener = startSyncOnReconnect(user.uid);
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e instanceof Error ? e.message : 'Erro de sincronização.',
                    );
                }
            } finally {
                if (!cancelled) setSyncing(false);
            }
        });

        return () => {
            cancelled = true;
            unsubscribeAuth();
            stopNetworkListener?.();
        };
    }, []);

    return { ready, syncing, error };
}
