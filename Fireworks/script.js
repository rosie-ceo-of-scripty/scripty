function random(min, max) {
    return min + Math.random() * (max + 1 - min);
  }
  
  const createFirework = (event) => {
    const xPos = event.clientX
    const yPos = event.clientY
    const colour = '#'+Math.random().toString(16).substr(2,6);
    
    // Create 50 divs, start them on top of each other
    // so they can radiate out from the centre
    for (let i = 1; i <= 50; i++) {
      const firework = document.createElement('div')
      firework.className = 'firework'
      firework.classList.add(`firework${i}`)
      firework.classList.add(`set${set}`)
      firework.style.backgroundColor = colour
      firework.style.left = xPos + 'px'
      firework.style.top = yPos + 'px'
      document.body.appendChild(firework)
    }  
    
    set += 1
  }
  
  const deleteFirework = () => {
    const setToDelete = set - 3
    if (set >= 0) {
      const oldFireworks = document.querySelectorAll(`.set${setToDelete}`);
  
      oldFireworks.forEach(firework => {
        firework.remove();      
      });      
    }
  }
  
  let set = 0
  
  document.body.addEventListener('click', (event) => {
    deleteFirework()
    createFirework(event)
  })