document.addEventListener('DOMContentLoaded', () => {
    let offset = 0;
    const limit = 50;
    const monsterContainer = document.getElementById('monster-container');
    const loadMoreButton = document.getElementById('forward');
    const previousButton = document.getElementById('back');

    // Fetch and display the initial set of monsters
    fetchMonsters(offset, limit);

    const form = document.getElementById('monsterForm');
    form.addEventListener('submit', addNewMonster);

    // Handle Load More button click
    loadMoreButton.addEventListener('click', () => {
        offset += limit;
        fetchMonsters(offset, limit);
    });

    // Handle Previous button click
    previousButton.addEventListener('click', () => {
        if (offset > 0) {
            offset -= limit;
            fetchMonsters(offset, limit);
        }
    });

    function fetchMonsters(offset, limit) {
        fetch(`http://localhost:3000/monsters?_start=${offset}&_limit=${limit}`)
        .then(res => res.json())
        .then(data => {
            // Clear the container before appending new monsters
            monsterContainer.innerHTML = '';
            
            // Check if no more data is returned
            if (data.length === 0) {
                loadMoreButton.style.display = 'none'; // Hide button if no more monsters
            } else {
                loadMoreButton.style.display = 'block'; // Show button if more monsters are available
            }

            // Display the monsters
            data.forEach(monster => {
                displayMonster(monster);
            });

            // Show Previous button if not at the start
            previousButton.style.display = offset > 0 ? 'block' : 'none';
        })
        .catch(error => console.error('Error fetching monsters:', error));
    }

    function addNewMonster(e) {
        e.preventDefault()
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const description = document.getElementById('description').value;

        const newMonster = {
            name: name,
            age: age,
            description: description
        };

        fetch('http://localhost:3000/monsters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(newMonster)
        })
        .then(res => res.json())
        .then(data => {
            data
            form.reset();
        })
    }

    function displayMonster(monster) {
        const monsterContainer = document.getElementById('monster-container');
        
        // Create the necessary HTML structure
        const divCol = document.createElement('div');
        divCol.className = "col";
        const divCard = document.createElement('div');
        divCard.className = "card h-100";
        const divCardBody = document.createElement('div');
        divCardBody.className = "card-body";
        const p1 = document.createElement('p');
        p1.innerHTML = `<strong>Name</strong>: ${monster.name}`;
        const p2 = document.createElement('p');
        p2.innerHTML = `<strong>Age</strong>: ${monster.age}`;
        const p3 = document.createElement('p');
        p3.innerHTML = `<strong>Description</strong>: ${monster.description}`;

        divCardBody.appendChild(p1);
        divCardBody.appendChild(p2);
        divCardBody.appendChild(p3);
        divCard.appendChild(divCardBody);
        divCol.appendChild(divCard);
        monsterContainer.appendChild(divCol);
    }
});
