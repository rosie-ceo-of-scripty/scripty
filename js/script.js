/* eslint-disable curly */
/* NORMAL COLOURS | Temp changed to Nick's colours. Uncomment and remove Nick's below section to revert
const tagSectors = [
  { color: "#B03A2E", label: "Damian  " },  // Festive Red
  { color: "#C0392B", label: "Jay  " },     // Deep Holiday Red
  { color: "#1ABC9C", label: "Phil  " },    // Festive Green
  { color: "#27AE60", label: "Rosie  " },   // Christmas Tree Green
  { color: "#F39C12", label: "Tim  " },     // Gold
  { color: "#D35400", label: "Devon  " },   // Warm Orange
  { color: "#16A085", label: "Adam  " },    // Dark Green
  { color: "#F1C40F", label: "Mykola  " },  // Bright Gold
  { color: "#9B59B6", label: "Nick  " },    // Purple (to contrast, for elegance)
];
NORMAL COLOURS END */
/* Nick's colours for the wheel */
const tagSectors = [
  { color: "#D00027", label: "Damian  " },  // Liverpool Red
  { color: "#00967F", label: "Jay  " },     // Liverpool Aqua
  { color: "#FEE942", label: "Phil  " },    // Liverpool Gold
  { color: "#D00027", label: "Rosie  " },   // Liverpool Red
  { color: "#00967F", label: "Tim  " },     // Liverpool Aqua
  { color: "#FEE942", label: "Devon  " },   // Liverpool Gold
  { color: "#D00027", label: "Adam  " },    // Liverpool Red
  { color: "#00967F", label: "Mykola  " },  // Liverpool Aqua
  { color: "#FEE942", label: "Kris  " },    // Liverpool Gold
];

// Team meeting taggers
const teamMeetingTagSectors = [
  { color: "#D00027", label: "Damian  " },  // Liverpool Red
  { color: "#00967F", label: "Jay  " },     // Liverpool Aqua
  { color: "#FEE942", label: "Phil  " },    // Liverpool Gold
  { color: "#D00027", label: "Rosie  " },   // Liverpool Red
  { color: "#00967F", label: "Tim  " },     // Liverpool Aqua
  { color: "#FEE942", label: "Devon  " },   // Liverpool Gold
];

// Team meeting developers
const devSectors = [
  { color: "#D00027", label: "Adam  " },    // Liverpool Red
  { color: "#00967F", label: "Mykola  " },  // Liverpool Aqua
  { color: "#FEE942", label: "Kris  " },    // Liverpool Gold
];

// Only running wheel function after previous presenter is selected
// wheelFunction(tagSectors, "#spin1", "#wheel1");

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
  const friction = 0.98; // Increased friction for faster deceleration
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
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
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
    } else {
      // Update text to the sector label while spinning
      elSpin.textContent = sector.label.trim();
    }
    elSpin.style.background = sector.color; // Update background color based on current sector
  };

  const frame = () => {
    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
      angVel ||= angVelMin; // Initial velocity kick
      angVel *= 1.06; // Accelerate
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
    elSpin.textContent = "SPIN";  // Show "SPIN" initially before spinning
    engine(); // Start engine!
  });

  // INIT!
  sectors.forEach(drawSector);
  elSpin.textContent = "SPIN";  // Show "SPIN" before any interaction
  rotate(); // Initial rotation
}

// PREVIOUS PRESENTERS
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
        var devTeam = ["Adam", "Mykola", "Nick"];
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
