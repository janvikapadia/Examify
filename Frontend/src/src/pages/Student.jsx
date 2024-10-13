import React, { useState, useEffect } from "react";
import { StudentNav } from "../components/StudentNav";
import { Live } from "../components/Live";
import { Upcoming } from "../components/Upcoming";
import { Attempted } from "../components/Attempted";
import { Contact } from "../components/Contact";
import JsonData from '../data/data.json'

export const Student = () => {
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
            <StudentNav onTabChange={handleTabChange} />

            {activeTab === 'live' && (
                <Live
                />
            )}

            {activeTab === 'upcoming' && (
                <Upcoming

                />
            )}

            {activeTab === 'attempted' && (
                <Attempted

                />
            )}

            <Contact data={landingPageData.Contact} />
        </div>
    );
};

export default Student;
