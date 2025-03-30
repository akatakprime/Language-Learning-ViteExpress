import React, { useState, useEffect } from 'react';

import './Home.css'

function Home_nouser() {
    //not logged in
    return (
        <div className="main">
            <h1>
                Learn Japanese through context!
            </h1>
            <h2>
                Create an account now! Free, forever.
            </h2>
        </div>
    )
}

export default Home_nouser