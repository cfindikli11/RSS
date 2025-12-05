export function createCategoryFilter(onFilter) {
    const categories = [
        { id: 'all', label: 'Tümü', icon: '📰' },
        { id: 'Gündem', label: 'Gündem', icon: '📢' },
        { id: 'Dünya', label: 'Dünya', icon: '🌍' },
        { id: 'Teknoloji', label: 'Teknoloji', icon: '💻' },
        { id: 'Ekonomi', label: 'Ekonomi', icon: '💰' },
        { id: 'Bilim', label: 'Bilim', icon: '🔬' },
    ];

    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filter';

    filterContainer.innerHTML = `
    <div class="filter-chips">
      ${categories.map(cat => `
        <button 
          class="filter-chip ${cat.id === 'all' ? 'active' : ''}" 
          data-category="${cat.id}"
        >
          <span class="chip-icon">${cat.icon}</span>
          <span class="chip-label">${cat.label}</span>
        </button>
      `).join('')}
    </div>
  `;

    const chips = filterContainer.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const category = chip.dataset.category;
            onFilter(category === 'all' ? null : category);
        });
    });

    return filterContainer;
}

export default { createCategoryFilter };
