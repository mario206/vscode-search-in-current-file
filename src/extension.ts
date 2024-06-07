import * as vscode from "vscode";
var path = require('path');

class HistoryItem
{
  constructor(query: string,filesToInclude:string) {
    this.query = query;
    this.filesToInclude = filesToInclude;
  }
  query : string;
  filesToInclude : string;

}

let m_history = new Array<HistoryItem>();
let m_index = -1;

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

  let disposable3 = vscode.commands.registerCommand(
    "search-in-current-file.goBack",
    async () => {
      await goBack();
    }
  );

  let disposable4 = vscode.commands.registerCommand(
    "search-in-current-file.goForward",
    async () => {
      await goForward();
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2)
  context.subscriptions.push(disposable3)
  context.subscriptions.push(disposable4)
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

  doQuery(selection,currentFilePath,true);
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
  await doQuery(selection,"",true);

}

async function doQuery(query : string,filesToInclude:string,pushHistory:boolean)
{
  await vscode.commands.executeCommand("workbench.action.findInFiles", {
    query: query,
    filesToInclude: filesToInclude,
    useExcludeSettingsAndIgnoreFiles : true
  });

  if(pushHistory)
  {
    var item = new HistoryItem(query,filesToInclude);
    m_history.push(item);
    m_index = m_history.length - 1;
  }
}

async function goBack(): Promise<void> {
  var index = m_index - 1;
  if(index >= 0) {
    var item = m_history[index];
    m_index = index;
    console.log(`goBack ${m_index}/${m_history.length}`)
    await doQuery(item.query,item.filesToInclude,false);
  }
}
async function goForward(): Promise<void> {
  var index = m_index + 1;
  if(0 <= index && index <= m_history.length -1) {
    var item = m_history[index];
    m_index = index;
    console.log(`goForward ${m_index}/${m_history.length}`)
    await doQuery(item.query,item.filesToInclude,false);
  }

}