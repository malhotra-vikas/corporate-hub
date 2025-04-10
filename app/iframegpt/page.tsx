"use client"

import React, { useEffect } from 'react';
import { useAuth } from "@/lib/auth-context"

const aiirGptUrl = `${process.env.NEXT_PUBLIC_FRONT_END_AIIRGPT_URL}`;

const sendAuthInfoToIframe = async (iframe, token) => {
    iframe.contentWindow.postMessage({ type: 'auth', token }, '*');
};

const ChatPage: React.FC = () => {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (user) {
            const iframe = document.getElementById('chatIframe');
            const token = user?.fireBaseUid
            sendAuthInfoToIframe(iframe, token);
        }
    }, [user]); // Re-run the effect when user state changes

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <iframe
                id="chatIframe"
                src={aiirGptUrl}
                title="AiirGPT"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            />
        </div>
    );
};

export default ChatPage;
