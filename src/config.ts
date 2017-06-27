export const config = {
  folderName: '.vscode/component-browser',
  ending: `.component.ts`,
  searchString: null,
  excludeString: `**/node_modules/**`,
  selectorPrefix: `app-`
}

config.searchString = `**/*${config.ending}`