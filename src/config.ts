export const config = {
  folderName: '.vscode/component-browser',
  ending: `.component.ts`,
  searchString: null,
  excludeString: `**/node_modules/**`,
  selectorPrefix: `app-`,

  // FROM CDP  
  url: 'https://kolibri-29df0.firebaseapp.com/',
  format: 'png',
  viewportWidth: 1440,
  viewportHeight: 900,
  delay: 2000,
  userAgent: false,
  fullPage: false
}

config.searchString = `**/*${config.ending}`