export const singleJS = () => {
  const editButton = document.getElementById('edit');
  const buttonsEdit = document.querySelector('.buttons-edit');

  if (editButton) {
    editButton.addEventListener('click', function (event) {
      const valuePost = document.querySelectorAll('.value-post');
      event.preventDefault();
      editButton.style.display = 'none';
      buttonsEdit.style.display = '';

      for (let i = 0; i < valuePost.length; i++) {
        const pTag = valuePost[i].querySelector('p');
        const nonPTags = valuePost[i].querySelectorAll(':scope > :not(p)');

        if (nonPTags.length > 0) {
          if (pTag) {
            pTag.style.display = 'none';
          }
          for (let j = 0; j < nonPTags.length; j++) {
            nonPTags[j].style.display = '';
          }
        }
      }
    });
    
    const cancelButton = document.getElementById('cancel-edit');
    cancelButton.addEventListener('click', function (event) {
      const valuePost = document.querySelectorAll('.value-post');
      event.preventDefault();
      editButton.style.display = '';
      buttonsEdit.style.display = 'none';

      for (let i = 0; i < valuePost.length; i++) {
        const pTag = valuePost[i].querySelector('p');
        const nonPTags = valuePost[i].querySelectorAll(':scope > :not(p)');

        if (nonPTags.length > 0) {
          if (pTag) {
            pTag.style.display = '';
          }
          for (let j = 0; j < nonPTags.length; j++) {
            nonPTags[j].style.display = 'none';
          }
        }
      }
    });
  }

}