const dragStatus = document.getElementById('drag-status');
let dragCard = null;

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('dragstart', e => {
    dragCard = card;
    setTimeout(() => card.classList.add('dragging'), 0);
    dragStatus.textContent = `MOVING: ${card.querySelector('.card-id').textContent.trim().split('\n')[0]}`;
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    dragCard = null;
    dragStatus.textContent = 'OK';
    updateCounts();
  });
});

document.querySelectorAll('.cards').forEach(zone => {
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
    const afterEl = getDragAfterElement(zone, e.clientY);
    if (afterEl == null) {
      zone.appendChild(dragCard);
    } else {
      zone.insertBefore(dragCard, afterEl);
    }
  });

  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
  });
});

function getDragAfterElement(container, y) {
  const cards = [...container.querySelectorAll('.card:not(.dragging)')];
  return cards.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateCounts() {
  document.querySelectorAll('.column').forEach(col => {
    const count = col.querySelectorAll('.card').length;
    col.querySelector('.col-count').textContent = count;
  });
}
