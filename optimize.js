const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

async function optimize() {
    console.log('Converting logo.png to WebP...');
    await sharp('public/logo.png')
        .webp({ quality: 80 })
        .toFile('public/logo.webp');
        
    console.log('Converting pipe.jpeg to WebP...');
    await sharp('public/pipe.jpeg')
        .webp({ quality: 80 })
        .toFile('public/pipe.webp');
        
    console.log('Inlining Critical CSS to index.html...');
    const css = fs.readFileSync('css/styles.css', 'utf8');
    let html = fs.readFileSync('index.html', 'utf8');
    
    // Replace <link href="css/styles.css" rel="stylesheet"> with <style>...</style>
    html = html.replace(
        '<link href="css/styles.css" rel="stylesheet">',
        `<style id="critical-css">\n${css}\n    </style>`
    );
    
    fs.writeFileSync('index.html', html);
    console.log('Optimization Complete!');
}

optimize().catch(err => {
    console.error('Error during optimization:', err);
    process.exit(1);
});
