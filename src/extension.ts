import * as vscode from 'vscode';
import * as cp from 'child_process';

const haskellLangId = 'haskell';

export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
      const text = document.getText(range);
      try {
        const hfmt = cp.execSync('hfmt -', { input: text });
        const formattedText = hfmt.toString();
        // hfmt returns an empty string if everything's been already formatted
        if (formattedText.trim().length > 1) {
          return [vscode.TextEdit.replace(range, hfmt.toString())];
        }
      } catch (e) {
        vscode.window.showErrorMessage("hfmt failed to format the code. " + e.stdout.toString());
        console.log(e.stdout.toString());
      }
    }
  });
}
