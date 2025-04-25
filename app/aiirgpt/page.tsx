"use client"; // Mark this as a client-side component

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/lib/auth-context";
import Cookies from 'js-cookie'; // Import js-cookie

const aiirGptUrl = `${process.env.NEXT_PUBLIC_FRONT_END_AIIRGPT_URL}`;

// Helper function to set cookies using js-cookie
const setCookie = (name: string, value: string, days: number) => {
    Cookies.set(name, value, { expires: days, path: '', secure: true, sameSite: 'Lax' });
};

const sendAuthInfoToIframe = async (iframe: HTMLIFrameElement, firebaseToken: string, userId: string) => {
    if (iframe && iframe.contentWindow) {
        const targetOrigin = window.location.hostname === 'localhost'
            ? 'http://localhost:3000' // For development on localhost (match iframe port)
            : 'https://aiirhub.com'; // In production, send to the production domain


        /*        
                const targetOrigin = window.location.hostname === 'localhost'
                    ? 'http://localhost:3000' // For development on localhost (match iframe port)
                    : 'https://aiirgpt.aiirhub.com'; // In production, send to the production domain
                const iframeOrigin = new URL(iframe.src).origin; // Get the iframe's origin (e.g., https://aiirgpt.aiirhub.com)
        */

        console.log('Sending firebaseToken message to iframe:', firebaseToken); // Log the token being sent
        console.log('Sending useridtoken message to iframe:', userId); // Log the token being sent

        // Also, store the Firebase UID in cookies using js-cookie

        //localStorage.setItem('firebasetoken', firebaseToken);
        //setCookie('firebasetoken', firebaseToken, 7); // Store for 7 days

        //localStorage.setItem('useridtoken', userId);
        //setCookie('useridtoken', userId, 7); // Store for 7 days

        iframe.contentWindow.postMessage({ type: 'auth', firebaseToken }, targetOrigin); // Send to correct target origin
        //iframe.contentWindow.postMessage({ type: 'auth', firebaseToken, userId }, targetOrigin); // Send to correct target origin
    } else {
        console.error('Iframe not loaded or iframe.contentWindow is null');
    }
};



const ChatPage: React.FC = () => {
    const { user, loading } = useAuth();
    const [iframeLoaded, setIframeLoaded] = useState(false); // Track iframe load state

    const handleIframeLoad = () => {
        console.log('Iframe loaded');
        setIframeLoaded(true); // Set iframe to loaded state
    };

    useEffect(() => {
        if (user && !loading) {
            console.log('User object before calling IFrame:', user);  // Log the entire user object

            const iframe = document.getElementById('chatIframe') as HTMLIFrameElement;
            const firebaseToken = Cookies.get("firebase_uuid");
            const userId = user?._id;

            if (firebaseToken) {
                console.log('User Firebase UID:', firebaseToken); // Log the token to verify it's correct
                sendAuthInfoToIframe(iframe, firebaseToken, userId!);
            } else {
                console.error('No Firebase UID found for the user');
            }
        }
    }, [user, loading]); // Ensure this runs when user changes or loading finishes

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <iframe
                id="chatIframe"
                src={aiirGptUrl}
                title="AiirGPT"
                allow="clipboard-write"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
                onLoad={handleIframeLoad} // Wait until iframe is loaded
            />
        </div>
    );
};

export default ChatPage;
