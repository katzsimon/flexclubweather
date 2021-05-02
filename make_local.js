/*
 Set the js & css links to be relative so the app will run without a server
 */
const replace = require('replace-in-file');
replace.sync({
    files: 'dist/index.html',
    from: /"\/js/g,
    to: '"js',
});
replace.sync({
    files: 'dist/index.html',
    from: /"\/css/g,
    to: '"css',
});

console.log('You can now run /dist/index.html without a server');
