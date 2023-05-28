export const singleJS = () => {
  const editButton = document.getElementById('edit');
  const cancelButton = document.getElementById('cancel-edit');
  const valuePost = document.querySelectorAll('.value-post');
  const buttonsEdit = document.querySelector('.buttons-edit');

  if (editButton) {
    editButton.addEventListener('click', function (event) {
      event.preventDefault();
      editButton.style.display = 'none';
      buttonsEdit.style.display = '';
  
      for (let i = 0; i < valuePost.length; i++) {
        const pTag = valuePost[i].querySelector('p');
        const nonPTags = valuePost[i].querySelectorAll(':scope > :not(p)');
  
        if (nonPTags.length > 0) {
          pTag.style.display = 'none';
          for (let j = 0; j < nonPTags.length; j++) {
            nonPTags[j].style.display = '';
          }
        }
      }
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', function (event) {
      event.preventDefault();
      editButton.style.display = '';
      buttonsEdit.style.display = 'none';
  
      for (let i = 0; i < valuePost.length; i++) {
        const pTag = valuePost[i].querySelector('p');
        const nonPTags = valuePost[i].querySelectorAll(':scope > :not(p)');
  
        if (nonPTags.length > 0) {
          pTag.style.display = '';
          for (let j = 0; j < nonPTags.length; j++) {
            nonPTags[j].style.display = 'none';
          }
        }
      }
    });
  }

}