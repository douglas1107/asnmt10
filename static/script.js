function fetchBlobs() {
    fetch('/blobs/all')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Expected an array of blobs, but got:', data);
                return;
            }
            console.log(data);
            const blobList = document.getElementById('blobList');
            blobList.innerHTML = ''; 
            data.forEach(blob => {
                const blobItem = document.createElement('div');
                blobItem.innerHTML = `ID: ${blob.id}, Name: ${blob.name}, Content: ${blob.content} 
                <button class="deleteBtn" onclick="deleteBlob('${blob.id}')">Delete</button>
                <button class="editBtn" onclick="editBlob('${blob.id}')">Edit</button>`;
                blobList.appendChild(blobItem);
            });
        })
        .catch(error => console.error('Error fetching blobs:', error));
}


document.getElementById('createForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/blobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        console.log('Blob created successfully:', data);
        fetchBlobs();
    })
    .catch(error => console.error('Error creating blob:', error));
});

function deleteBlob(blobId) {
    fetch(`/blobs/${blobId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log(`Blob with ID ${blobId} deleted successfully`);
            fetchBlobs();
        } else {
            console.error(`Error deleting blob with ID ${blobId}`);
        }
    })
    .catch(error => console.error('Error deleting blob:', error));
}

function editBlob(blobId) {
    fetch('/blobs/all')
        .then(response => response.json())
        .then(blobs => {
            const blob = blobs.find(blob => blob.id === blobId);
            if (!blob) {
                console.error('Blob not found:', blobId);
                return;
            }

            const form = document.getElementById('editForm');
            form.elements['id'].value = blob.id;
            form.elements['name'].value = blob.name;
            form.elements['content'].value = blob.content;

            form.onsubmit = function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                fetch(`/blobs/${blobId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Blob updated successfully:', data);
                    fetchBlobs();
                })
                .catch(error => console.error('Error updating blob:', error));
            };
        })
        .catch(error => console.error('Error fetching blobs:', error));
}

fetchBlobs();
