import React, { useState, useEffect } from "react";
import logo from './icon.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const AdminNav = ({ onTabChange }) => {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/admin");
                setUsername(response.data.username);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <nav id="menu" className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button
                        type="button"
                        className="navbar-toggle collapsed"
                        data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1"
                    >
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <img src={logo} alt="ProExamine Logo" className="App-logo" />

                    <Link to="/" className="navbar-brand page-scroll">Examify</Link>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav navbar-right">
                        <li><a href="#live" className="page-scroll" onClick={() => onTabChange('live')}>Live</a></li>
                        <li><a href="#upcoming" className="page-scroll" onClick={() => onTabChange('upcoming')}>Upcoming</a></li>
                        <li><a href="#attempted" className="page-scroll" onClick={() => onTabChange('attempted')}>Completed</a></li>
                        <li><a href="#addexam" className="page-scroll" onClick={() => onTabChange('addexam')}>Add Exam</a></li>
                        <li><a className="page-scroll disabled-link" style={{color:'#0a2397', fontSize:'20px'}}>Welcome, {username}!</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};