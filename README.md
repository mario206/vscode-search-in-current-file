# Search in Current File Plus

Makes it easy to search between the 'current file' and the 'workspace' using the keyboard shortcuts 'Cmd + F' or 'Cmd + Shift + F'.

![Demo](images/demo.gif)

## Commands
### Search in Current File Plus

Search in Current File : `cmd+f` 
Search all Files : `cmd+shift+f`

## Useful Keyboard Shortcuts Example
```json
// Only type ctrl+o when using Find.
// the query in Find is filled into the query in Search.
{
    "key": "cmd+f",
    "command": "search-in-current-file.searchInCurrentFile",
    "when": "editorFocus"
  },
  {
    "key": "shift+cmd+f",
    "command": "search-in-current-file.searchInAllFiles",
}
```

## Publish
```
yarn install
$ cd myExtension
$ vsce package
# upload *.vsix to https://marketplace.visualstudio.com/manage/publishers/
```