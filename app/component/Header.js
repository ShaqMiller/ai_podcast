"use client"
import { useState } from "react"
import styles from "../styles/header.module.scss"

export default function Header() {

    const [search, setSearch] = useState("")
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        if (isDarkMode) {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        } else {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <div className={styles.title}>AdVoice</div>
                <div className={styles.navContainer}>
                    <div className={styles.nav}>Home</div>
                    <div className={styles.nav}>About</div>
                    <div className={`${styles.signupBut} ${styles.nav} `}>Signup</div>
                    <div className={` ${styles.loginBut} ${styles.nav}`}>Login</div>
                </div>
            </div>

            {/* <div className={styles.searchContainer}>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Advice" />
                <div className={styles.searchBut}></div>
            </div> */}

            <button className={styles.themeToggleBtn} onClick={toggleMode}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    )
}
