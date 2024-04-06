import { displayFeed } from "../display/feedDisplay.js";
import { displayProfile } from "../display/profileDisplay.js";

const currentUrl = window.location.href;

export async function fetchFeedData() {
    try {
        const response = await fetch(`/json/feed.json`);
        if (!response.ok) {
            throw new Error(`API request failed with status: ` + response.status);
        } else {
            const data = await response.json();
            if (currentUrl.includes("feed/index.html")) {
                displayFeed(data);
            } if (currentUrl.includes("profile/index.html")) {
                displayProfile(data);   
            }
            return data;
        }
    } catch (error) {
        console.log("Error: " + error);
    }
}
fetchFeedData();