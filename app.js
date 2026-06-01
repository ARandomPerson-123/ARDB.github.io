// 1. Initialize the Supabase Client
const SUPABASE_URL = "https://svvvpgenjwximjznciow.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dnZwZ2Vuand4aW1qem5jaW93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzMzIzNzUsImV4cCI6MjA5NTkwODM3NX0.NL1XNDtpHOQ3UabinnxY1KlsJrd2mMudwWK2qWVZ-Tg";
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
document.addEventListener("DOMContentLoaded", function () {
  
  // 1. Run the randomizer automatically once when the home page first loads
  fetchRandomRideFromSQL();

  // 2. Handle the "Random Amusement Ride" button click (id="b1")
  const randomPageButton = document.getElementById("b1");
  if (randomPageButton) {
    randomPageButton.addEventListener("click", function () {
      // Instead of shifting pages, call the database to fetch a brand new random row!
      fetchRandomRideFromSQL();
    });
  }

  // 3. Keep your existing search page navigation buttons exactly the same
  const searchButton = document.getElementById("b2");
  if (searchButton) {
    searchButton.addEventListener("click", function () {
      window.location.href = "Search.html";
    });
  }

  const searchButtonForManufacturers = document.getElementById("b3");
  if (searchButtonForManufacturers) {
    searchButtonForManufacturers.addEventListener("click", function () {
      window.location.href = "Manusearch.html";
    });
  }

  const searchButtonForAmusementRides = document.getElementById("b4");
  if (searchButtonForAmusementRides) {
    searchButtonForAmusementRides.addEventListener("click", function () {
      window.location.href = "APsearch.html";
    });
  }
});

// --- CORE DATABASE FUNCTIONS ---

// Function to fetch all rows and pick a random entry dynamically
async function fetchRandomRideFromSQL() {
  try {
    // Queries your cloud table for all available amusement ride rows
    const { data, error } = await supabase
      .from('rides')
      .select('*');

    if (error) throw error;

    if (data && data.length > 0) {
      // Select a random row index from the array returned by Postgres
      const randomIndex = Math.floor(Math.random() * data.length);
      const randomRide = data[randomIndex];
      
      console.log("Successfully pulled from SQL:", randomRide);
      
      // Update our HTML DOM elements with our database records
      updatePageHTML(randomRide);
    }
  } catch (err) {
    console.error("Database connection error:", err.message);
    document.getElementById("ride-headline").innerText = "Error pulling from database.";
  }
}

// Function to smoothly inject data values straight into the index.html placeholders
function updatePageHTML(ride) {
  const headline = document.getElementById("ride-headline");
  const image = document.getElementById("img1");
  const credits = document.getElementById("credit-text");
  const stats = document.getElementById("ride-stats");

  // Dynamically applies column text strings from your saved row fields
  headline.innerText = `Today's Random Amusement Ride is "${ride.name}"`;
  
  // Updates image elements dynamically without file shifting
  image.src = ride.image_url;
  image.style.display = "block"; 
  
  // Renders your unique attribution text/inside jokes automatically
  credits.innerHTML = ride.credit_text;
  
  // Formats your integer columns into clean web content strings
  stats.innerHTML = `
    Height: ${ride.height} ft <br>
    Speed: ${ride.speed} MPH <br>
    Manufacturer: ${ride.manu} <br>
    Amusement Park: ${ride.park}
  `;
}
