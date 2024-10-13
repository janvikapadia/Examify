import React, { useState, useEffect } from "react";
import { AdminNav } from "../components/AdminNav";
import { LiveAd } from "../components/LiveAd";
import { UpcomingAd } from "../components/UpcomingAd";
import { Completed } from "../components/Completed";
import { Contact } from "../components/Contact";
import { AddExam } from "../components/AddExam";
import JsonData from "../data/data.json";

const Admin = () => {
    const [landingPageData, setLandingPageData] = useState({});
    const [activeTab, setActiveTab] = useState('live');

    useEffect(() => {
        setLandingPageData(JsonData);
    }, []);

    useEffect(() => {
        const handleHash = () => {
            
            const hash = window.location.hash.substring(1);
            if (['live', 'upcoming', 'attempted', 'addexam'].includes(hash)) {
                setActiveTab(hash);
                scrollToHash(hash);
            }
        };

        handleHash();

        window.addEventListener('hashchange', handleHash);

        return () => {
            window.removeEventListener('hashchange', handleHash);
        };
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        window.location.hash = tab; 
    };

    const scrollToHash = (hash) => {
        const element = document.getElementById(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <AdminNav onTabChange={handleTabChange} />

            {activeTab === 'live' && <LiveAd />}
            {activeTab === 'upcoming' && <UpcomingAd />}
            {activeTab === 'attempted' && <Completed />}
            {activeTab === 'addexam' && <AddExam />}

            <Contact data={landingPageData.Contact} />
        </div>
    );
};

export default Admin;



