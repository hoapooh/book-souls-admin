// Clear old localStorage data script
// Run this in the browser console to clear conflicting auth data

console.log("Clearing old authentication data...");

// Clear old tokens
localStorage.removeItem("access_token");
localStorage.removeItem("user");

// Clear any other potential conflicting keys
const keysToRemove = ["staff-auth-storage", "admin-auth-storage"];

keysToRemove.forEach((key) => {
	localStorage.removeItem(key);
	console.log(`Cleared: ${key}`);
});

console.log("Old authentication data cleared. Please refresh the page and try logging in again.");

// Show current localStorage contents
console.log("Current localStorage keys:", Object.keys(localStorage));
