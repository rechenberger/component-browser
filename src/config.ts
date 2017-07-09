export const config = {
  folderName: '.vscode/component-browser',
  ending: `.component.ts`,
  searchString: null,
  excludeString: `**/node_modules/**`,
  selectorPrefix: `app-`,

  // FROM CDP  
  url: 'https://kolibri-29df0.firebaseapp.com/',
  format: 'png',
  viewportWidth: 375,
  viewportHeight: 667,
  delay: 2000,
  userAgent: false,
  fullPage: false,
  chromeShellCommand: '"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome" --disable-gpu  --remote-debugging-port=9222',
  screenshotKey: 'k'
}

config.searchString = `**/*${config.ending}`