import * as vscode from "vscode";
var path = require('path');

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "search-in-current-file.searchInCurrentFile",
    async () => {
      await searchInCurrentFile();
    }
  );

  let disposable2 = vscode.commands.registerCommand(
    "search-in-current-file.searchInAllFiles",
    async () => {
      await searchInAlltFiles();
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2)
}

export function deactivate() {}

async function searchInCurrentFile(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    return;
  }

  var selection = getQueryFromTextEditor();

  var currentFilePath = vscode.workspace.asRelativePath(
    activeEditor.document.uri
  );

  if(path.isAbsolute(currentFilePath)) {
    // workaround: when file not in workspace. "a system error occurred(spawn ENOTDIR)"
    // https://github.com/microsoft/vscode/issues/63226
    currentFilePath += "*";
  }

  await vscode.commands.executeCommand("workbench.action.findInFiles", {
    // Fill-in selected text to query
    query: selection,
    filesToInclude: currentFilePath,
  });
}

function getQueryFromTextEditor()
{
    var selection = "";
    const activeEditor = vscode.window.activeTextEditor;
    if(activeEditor)
    {
      selection = activeEditor.document.getText(activeEditor.selection)
      if(selection == "")
      {
        const range = activeEditor.document.getWordRangeAtPosition(activeEditor.selection.active,/\S+/);
      
        if (range) {
            // then you can get the word that's there:
            const word = activeEditor.document.getText(range); // get the word at the range
            selection = word;
            // or modify the selection if that's really your goal:
            //vscode.window.activeTextEditor.selection = new vscode.Selection(range.start, range.end);
        }
      }
    }

    return selection;
}

async function searchInAlltFiles(): Promise<void> {

  let selection = getQueryFromTextEditor();

  await vscode.commands.executeCommand("workbench.action.findInFiles", {
    query: selection,
    filesToInclude: "",
    //onlyOpenEditors : false,
  });
}
