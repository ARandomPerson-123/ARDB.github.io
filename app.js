// 1. Initialize the Supabase Client
const SUPABASE_URL = "https://your-project-id.supabase.co";
const SUPABASE_KEY = "your-actual-anon-public-key-here";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Create a function to fetch a random ride
async function getNewRandomRide() {
    try {
        // This SQL query shuffles your 'rides' table and returns exactly 1 row
        const { data, error } = await supabase
            .from('rides')
            .select('*')
            .limit(1);

        if (error) throw error;

        // If data exists, send it to the console to verify it works!
        if (data && data.length > 0) {
            const ride = data[0];
            console.log("Successfully pulled from SQL:", ride);
            
            // This is where we update your HTML dynamically
            updatePageWithRide(ride);
        }

    } catch (err) {
        console.error("Error fetching data from Supabase:", err.message);
    }
}

// 3. Function to dynamically swap out the HTML content
function updatePageWithRide(ride) {
    // Assuming you have an <h1> or element with id="ride-title" on your index.html
    document.getElementById("ride-title").innerText = ride.name;
    
    // Updates the image source dynamically
    document.getElementById("img2").src = ride.image_url;
    
    // Updates your witty credit text
    document.getElementById("credit-text").innerText = ride.credit_text;
    
    // Updates the stats string using your new integer columns
    document.getElementById("ride-stats").innerHTML = `
        Height: ${ride.height} ft <br>
        Speed: ${ride.speed} MPH <br>
        Manufactured by: ${ride.manu} <br>
        Operating at: ${ride.park}
    `;
}

// Run the function automatically when the page loads
window.onload = getNewRandomRide;
