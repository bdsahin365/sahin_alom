const fs = require('fs');
const files = [
  'e:/Sahin Alom/sahin-alom/app/resume/page.tsx',
  'e:/Sahin Alom/sahin-alom/components/ResumeContact.tsx',
  'e:/Sahin Alom/sahin-alom/components/Tools/ElectricalToolsApp.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/\bbg-black\b(?!\/)/g, 'bg-background');
  content = content.replace(/\bbg-\[\#0A0A0A\]\b/g, 'bg-background');
  content = content.replace(/\bbg-\[\#111\]\b/g, 'bg-card-bg');
  content = content.replace(/\bfrom-zinc-900 to-black\b/g, 'from-card-hover-bg to-card-bg');
  
  // Surfaces and cards
  content = content.replace(/\bbg-white\/5\b/g, 'bg-card-bg');
  content = content.replace(/\bhover:bg-white\/10\b/g, 'hover:bg-card-hover-bg');
  content = content.replace(/\bbg-black\/20\b/g, 'bg-surface');
  content = content.replace(/\bbg-black\/40\b/g, 'bg-surface');
  content = content.replace(/\bbg-black\/50\b/g, 'bg-surface');
  
  // Text
  content = content.replace(/\btext-white\b(?!\/)/g, 'text-foreground');
  content = content.replace(/\btext-gray-[23]00\b/g, 'text-foreground');
  content = content.replace(/\btext-gray-[45]00\b/g, 'text-text-secondary');
  content = content.replace(/\btext-white\/[5678]0\b/g, 'text-text-secondary');
  content = content.replace(/\bplaceholder:text-white\/20\b/g, 'placeholder:text-text-secondary\/50');

  // Borders
  content = content.replace(/\bborder-white\/[5]\b/g, 'border-card-border');
  content = content.replace(/\bborder-white\/10\b/g, 'border-card-border');
  content = content.replace(/\bvia-white\/10\b/g, 'via-card-border');
  
  // Restore text-white to buttons that have distinct background colors (like indigo)
  content = content.replace(/(bg-indigo-[0-9]+.*?)text-foreground/g, '$1text-white');
  content = content.replace(/text-foreground(.*?)bg-indigo-[0-9]+/g, 'text-white$1bg-indigo-600');
  
  if(original !== content) {
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
});
