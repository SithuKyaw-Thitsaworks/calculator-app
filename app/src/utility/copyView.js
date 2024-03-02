const fs = require('fs-extra');

fs.copy('./app/src/public', 'dist/public')
  .then(() => console.log('View folder copied successfully'))
  .catch((err) => {
    console.error(err)
  });

