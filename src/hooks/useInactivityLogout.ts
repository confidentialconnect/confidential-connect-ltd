import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

/**
 * Auto-logout hook that signs user out after
 * 30 minutes of inactivity (no mouse/keyboard/touch).
 */
export const useInactivityLogout = (isAuthenticated: boolean) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isAuthenticated) return;

        timerRef.current = setTimeout(async () => {
            await supabase.auth.signOut();
            window.location.href = '/auth';
        }, INACTIVITY_TIMEOUT);
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
        events.forEach((e) => window.addEventListener(e, resetTimer));
        resetTimer();

        return () => {
            events.forEach((e) => window.removeEventListener(e, resetTimer));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isAuthenticated, resetTimer]);
};
