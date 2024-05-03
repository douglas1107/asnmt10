const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

function readBlobsFromFile(callback) {
  const blobsFilePath = path.join(__dirname, 'blobs.json');
  fs.readFile(blobsFilePath, (err, data) => {
      if (err) {
          console.error('Error reading blobs from file:', err);
          return callback(err, null);
      }
      const blobs = JSON.parse(data);
      callback(null, blobs);
  });
}

function writeBlobsToFile(blobs, callback) {
  const blobsFilePath = path.join(__dirname, 'blobs.json');
  fs.writeFile(blobsFilePath, JSON.stringify(blobs, null, 2), (err) => {
      if (err) {
          console.error('Error writing blobs to file:', err);
          return callback(err);
      }
      callback(null);
  });
}


router.post('/', (req, res) => {
    const blobData = req.body;
    const blobId = uuidv4();
    readBlobsFromFile((err, blobs) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        blobs.push({ id: blobId, ...blobData });
        writeBlobsToFile(blobs, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ id: blobId, ...blobData });
        });
    });
});

router.get('/', (req, res) => {
  readBlobsFromFile((err, blobs) => {
      if (err) {
          return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(blobs);
  });
});



router.put('/:id', (req, res) => {
  const id = req.params.id;
  const newBlob = req.body;

  if (newBlob.id !== id) {
      return res.status(400).json({ error: 'Blob id in body must match id in URL' });
  }

  readBlobsFromFile((err, blobs) => {
      if (err) {
          return res.status(500).json({ error: 'Internal server error' });
      }

      const index = blobs.findIndex(blob => blob.id === id);

      if (index === -1) {
          return res.status(404).json({ error: 'Blob not found' });
      }

      blobs[index] = newBlob;

      writeBlobsToFile(blobs, (err) => {
          if (err) {
              return res.status(500).json({ error: 'Internal server error' });
          }
          res.json(newBlob);
      });
  });
});






router.delete('/:id', (req, res) => {
    const blobId = req.params.id;
    readBlobsFromFile((err, blobs) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        const index = blobs.findIndex((blob) => blob.id === blobId);
        if (index === -1) {
            return res.status(404).json({ error: 'Blob not found' });
        }
        blobs.splice(index, 1);
        writeBlobsToFile(blobs, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: `Blob with ID ${blobId} deleted successfully` });
        });
    });
});

module.exports = router;

router.get('/all', (req, res) => {
  readBlobsFromFile((err, blobs) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(blobs);
  });
});