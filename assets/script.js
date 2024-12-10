const totalPokemon = 151, perPage = 8;
let currentPage = 1;
const pokemonList = document.getElementById('pokemon-list'),
  prevButton = document.getElementById('prev-button'),
  nextButton = document.getElementById('next-button');

const colors = {
  fire: "#f08030", water: "#6890f0", grass: "#78c850", electric: "#f8d030", ice: "#98d8d8", 
  fighting: "#c03028", poison: "#a040a0", ground: "#e0c068", flying: "#a890f0", psychic: "#f85888",
  bug: "#a8b820", rock: "#b8a038", ghost: "#705898", dragon: "#7038f8", dark: "#705848", 
  steel: "#b8b8d0", fairy: "#ee99ac", normal: "#a8a878"
};

const createPokemonHTML = (pokemon) => `
  <li class="pokemon-item" style="background-color: ${colors[pokemon.types[0].type.name] || "#fff"}">
    <p>#${String(pokemon.id).padStart(3, '0')}</p>
    <img src="${pokemon.sprites.other['official-artwork'].front_default || 'fallback.png'}" 
         alt="${pokemon.name}" class="pokemon-image">
    <p class="pokemon-name"><strong>${pokemon.name}</strong></p>
    <div class="atacks">
      ${pokemon.types
        .map(t => `<span class="type-badge" style="background-color: ${colors[t.type.name]}">${t.type.name}</span>`)
        .join('')}    
    <div class="statistics">
      <ul class="stats-list">
        ${pokemon.stats.map(stat => `<li><strong>${stat.stat.name}:</strong> ${stat.base_stat}</li>`).join('')}
      </ul>
    </div>
  </li>`;

const loadPokemon = (page) => {
  pokemonList.innerHTML = '';
  const startId = (page - 1) * perPage + 1, endId = Math.min(page * perPage, totalPokemon);

  const requests = Array.from({ length: endId - startId + 1 }, (_, i) => 
    fetch(`https://pokeapi.co/api/v2/pokemon/${startId + i}`).then(res => res.json())
  );

  Promise.all(requests)
    .then(pokemonArray => {
      pokemonArray.forEach(pokemon => pokemonList.innerHTML += createPokemonHTML(pokemon));
      prevButton.disabled = page === 1;
      nextButton.disabled = page >= Math.ceil(totalPokemon / perPage);
    })
    .catch(err => console.error('Erro ao carregar Pokémon:', err));
};

prevButton.onclick = () => loadPokemon(--currentPage);
nextButton.onclick = () => loadPokemon(++currentPage);
loadPokemon(currentPage);
