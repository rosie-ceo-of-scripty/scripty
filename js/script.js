/*
--------------------------- Setting a variable to store the results of Scripty, and setting an event listener for when it's populated ---------------------------
*/

var userSelected;
document.addEventListener("presenterSelected", function(){
  console.log("Next presenter selected, they are " + userSelected);
});

/*
--------------------------- Connecting to out selection history database ---------------------------
*/
const publicDatabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFidWRhamdpbnVxYWlnY2xkcnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNDQxMDgsImV4cCI6MjA1NTcyMDEwOH0.x8qkcmQP7Ll6IKN4o_1eaCdzlOh9bIJe772dEsmMtPo";
const databaseUrl = "https://qbudajginuqaigcldrsb.supabase.co";


// Create a client to the Database
const dbClient = supabase.createClient(databaseUrl, publicDatabaseKey);

// Creating a function that returns requested columns from the database.
async function fetchRows(table_name, table_columns) {
  // Query data from a specific table
  let { data, error } = await dbClient
    .from(table_name) // Replace with your table name
    .select(table_columns); // Select all columns

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }
  return data;
}

// Call the selections table, and prepare a flag variable to let us know when it's done
let selectionList;
let selectionFlag = false;
fetchRows("selections_sum_view", "*").then(data => {
  selectionList = data;
  selectionFlag = true;
});


// A function that will keep running until the data from the database is ready
const readyCheck = setInterval(() => {
  if(selectionFlag){
    const event = new CustomEvent("previousSelectionsLoaded",
      {
        detail: { data: "The scripty selection history is available."}
      });
    document.dispatchEvent(event);
    console.log("Selection list is ready!");
    clearInterval(readyCheck);
  }else{
    console.log("Selection list is not ready.");
  }
}, 500);

// An event listener that prints what's been selected to the console when it's ready
document.addEventListener("previousSelectionsLoaded", function(){
  console.log("Scripty selection history is: " + JSON.stringify(selectionList));
});

/*
--------------------------- Setting the Colours for Selection Wheels ---------------------------
*/

// Function to create a random dark hex code
function getHex() {
  var r, g, b;
  
  // Keep generating colours until a dark one is found
  do {
      r = Math.floor(Math.random() * 128); // Limit to darker range (0-127)
      g = Math.floor(Math.random() * 128);
      b = Math.floor(Math.random() * 128);
  } while ((r * 0.299 + g * 0.587 + b * 0.114) > 130); // Ensure it's dark enough

  // Convert to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to shuffle the return the array of names but shuffled
function shuffleArray(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return arr;
}

const tagSectors = shuffleArray([
  { color: getHex(), label: "Damian" },
  { color: getHex(), label: "Jay" },
  { color: getHex(), label: "Phil" },
  { color: getHex(), label: "Rosie" },
  { color: getHex(), label: "Tim" },
  { color: getHex(), label: "Devon" },
  { color: getHex(), label: "Adam" },
  { color: getHex(), label: "Mykola" },
  { color: getHex(), label: "Kris" },
  { color: getHex(), label: "Imola" },
]);

// Team meeting taggers
const teamMeetingTagSectors = shuffleArray([
  { color: getHex(), label: "Damian  " },  // Liverpool Red
  { color: getHex(), label: "Jay  " },     // Liverpool Aqua
  { color: getHex(), label: "Phil  " },    // Liverpool Gold
  { color: getHex(), label: "Rosie  " },   // Liverpool Red
  { color: getHex(), label: "Tim  " },     // Liverpool Aqua
  { color: getHex(), label: "Devon  " },   // Liverpool Gold
]);

// Team meeting developers
const devSectors = shuffleArray([
  { color: getHex(), label: "Adam  " },    // Liverpool Red
  { color: getHex(), label: "Mykola  " },  // Liverpool Aqua
  { color: getHex(), label: "Kris  " },
  { color: getHex(), label: "Imola  " },   // Liverpool Gold
]);
/*
--------------------------- Defining the Wheel Mechanics ---------------------------
*/

// Only running wheel function after previous presenter is selected
// wheelFunction(tagSectors, "#spin1", "#wheel1");
// Setting friction level globally

function wheelFunction(sectors, buttonId, canvasId) {
  // Generate random float in range min-max:
  const rand = (m, M) => Math.random() * (M - m) + m;
  const tot = sectors.length;
  const elSpin = document.querySelector(buttonId);
  const ctx = document.querySelector(canvasId).getContext`2d`;
  const dia = ctx.canvas.width;
  const rad = dia / 2;
  const PI = Math.PI;
  const TAU = 2 * PI;
  const arc = TAU / tot;
  function getRandomSteppedDecimal() {
    var steps = [];
    for (var i = 0.30; i <= 0.90; i += 0.20) {
      steps.push(parseFloat(i.toFixed(2)));
    }
    var random_index = Math.floor(Math.random() * steps.length);
    return steps[random_index];
  }
  
  const friction = getRandomSteppedDecimal(); // Using function above to randomise the wheel friction when each wheel is defined
  console.log("Wheel friction level", friction);
  const angVelMin = 0.005; // Minimum speed to consider it stopped
  let angVelMax = 0; // Random ang.vel. to accelerate to
  let angVel = 0;    // Current angular velocity
  let ang = 0;       // Angle rotation in radians
  let isSpinning = false;
  let isAccelerating = false;
  let animFrame = null; // Engine's requestAnimationFrame

  // Get index of current sector
  const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

  // Draw sectors and prizes texts to canvas
  const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 24px 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(sector.label, rad - 10, 10);
    ctx.restore();
  };

  // CSS rotate CANVAS Element
  const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    if (!isSpinning) {
      // Update text when finished spinning
      elSpin.textContent = sector.label.trim(); // Show the name of the selected sector
      userSelected = sector.label.trim();
      console.log("The selected user is " + userSelected);
      const event = new CustomEvent("presenterSelected",
        {
          detail: { data: "Today's presenter has been selected"}
        });
      document.dispatchEvent(event);
    } else {
      // Update text to the sector label while spinning
      elSpin.textContent = sector.label.trim();
    }
    elSpin.style.background = sector.color; // Update background color based on current sector
  };
  // Random acceleration
  function randomAcc() {
    var min = 1.00;
    var max = 1.15;
    var random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(2)); // Limit to 2 decimal places
  }
  var acc = randomAcc();
  console.log("Wheel acceleration", acc);
  const frame = () => {
    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      // Random acceleration value
      angVel *= acc; // Accelerate
    } else {
      // Decelerate
      angVel *= friction; // Decelerate by friction

      // SPIN END:
      if (angVel < angVelMin) {
        isSpinning = false;
        angVel = 0;
        cancelAnimationFrame(animFrame);
        // Final rotation adjustment after spin ends (stop updating)
        rotate(); // Apply the final rotation once, without further updates
      }
    }

    ang += angVel; // Update angle
    ang %= TAU;    // Normalize angle to keep it within range
    rotate();      // CSS rotate!
  };

  const engine = () => {
    frame();
    animFrame = requestAnimationFrame(engine);
  };

  elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.40); // Random max speed to accelerate to
    console.log ("Max speed", angVelMax);
    elSpin.textContent = "SPIN";  // Show "SPIN" initially before spinning
    engine(); // Start engine!
  });

  // INIT!
  sectors.forEach(drawSector);
  elSpin.textContent = "SPIN";  // Show "SPIN" before any interaction
  rotate(); // Initial rotation
}

/*
--------------------------- Select Previous Presenter ---------------------------
*/

// Getting selection from radio buttons
document.addEventListener("DOMContentLoaded", function () {
  // Function to handle selecting wheel
  // Function to handle the form submission on selecting previous presenters
  function previousPresenterSelection() {
    // Get selected presenter
    const previousPresenterSelection = Array.from(
      document.querySelectorAll("input[name='previousPresenter']:checked"),
    ).map(function (checkbox) {
      return checkbox.value;
    });
    // Check if no presenter is selected
    if (previousPresenterSelection.length === 0) {
      // eslint-disable-next-line
      alert("Please select a presenter before submitting.");
      return; // Prevent form submission if no presenter is selected
    }
    if (previousPresenterSelection.length > 8) {
      // eslint-disable-next-line
      alert("Too many presenters selected. No-one can present.");
      return;
    }
    // On team meeting page
    if(window.location.pathname.includes("/team-meeting")){
      if(previousPresenterSelection.length >= 3) {
        var devTeam = ["Adam", "Mykola", "Kris"];
        var taggingTeam = ["Damian", "Devon", "Jay", "Phil", "Rosie", "Tim"];
        var allDevSelected = devTeam.every(function(name) {
          return previousPresenterSelection.includes(name);
        });
        var allTaggingSelected = taggingTeam.every(function(name) {
          return previousPresenterSelection.includes(name);
        });
        if(allDevSelected || allTaggingSelected){
          // eslint-disable-next-line
          alert("No-one can present from either the dev team or tagging team. Make a new selection.");
          return;
        }
      }
    }
    // Remove the selected presenter from the tagSectors array
    const updatedTagSectors = tagSectors.filter(function (sector) {
      return !previousPresenterSelection.includes(sector.label.trim());
    });
    // Remove the selected presenter from the tagSectors array
    const updatedDevSectors = devSectors.filter(function (sector) {
      return !previousPresenterSelection.includes(sector.label.trim());
    });
    // Remove the selected presenter from the tagSectors array
    const updatedTeamMeetingTagSectors = teamMeetingTagSectors.filter(function (sector) {
      return !previousPresenterSelection.includes(sector.label.trim());
    });
    // Redraw the wheel with updated sectors
    if(document.querySelector("#taggersSelectionWheel")){
      wheelFunction(updatedTagSectors, "#spin1", "#wheel1");
      document.querySelector("#taggersSelectionWheel").style.display = "flex";
    }
    // Second and third wheels for team meetings
    if(document.querySelector("#devSelectionWheel")){
      wheelFunction(updatedDevSectors, "#spin2", "#wheel2");
      wheelFunction(updatedTeamMeetingTagSectors, "#spin3", "#wheel3");
      document.querySelector("#devSelectionWheel").style.display = "flex";
      document.querySelector("#taggersTeamMeetingSelectionWheel").style.display = "flex";
    }
    // Show the wheel and hide the presenter selection
    document.querySelector("#formContainer").style.display = "none";
    // Set the text back to "SPIN" after the previous presenter is removed
    var spinElements = document.querySelectorAll(".spin");
    spinElements.forEach(function(spinner){
      spinner.textContent = "SPIN";
    });
  }
  // Adding event listeners to button on submitting previous presenter
  document.getElementById("submitPresenter").addEventListener("click", previousPresenterSelection);
});


/*
--------------------------- Button to Submit Selected Presenter ---------------------------
*/

// Automatically selecting Adam's checkbox
document.addEventListener("DOMContentLoaded", function() {
  var element = document.querySelector("[value='Adam']");
  if (element) {
      element.checked = true;
  }
});