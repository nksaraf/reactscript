/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";

import { WorkerManager } from "./workerManager";
import { ReactScriptWorker } from "./reactscript";
import { LanguageServiceDefaultsImpl } from "./monaco.contribution";
import * as languageFeatures from "./languageFeatures";

import Uri = monaco.Uri;
let reactScriptWorker: (
  first: Uri,
  ...more: Uri[]
) => Promise<ReactScriptWorker>;

export function setupReactScript(defaults: LanguageServiceDefaultsImpl): void {
  reactScriptWorker = setupMode(defaults, "reactscript");
}

export function getReactScriptWorker(): Promise<
  (first: Uri, ...more: Uri[]) => Promise<ReactScriptWorker>
> {
  return new Promise((resolve, reject) => {
    if (!reactScriptWorker) {
      return reject("ReactScript not registered!");
    }

    resolve(reactScriptWorker);
  });
}

function setupMode(
  defaults: LanguageServiceDefaultsImpl,
  modeId: string
): (first: Uri, ...more: Uri[]) => Promise<ReactScriptWorker> {
  const client = new WorkerManager(modeId, defaults);
  const worker = (first: Uri, ...more: Uri[]): Promise<ReactScriptWorker> => {
    return client.getLanguageServiceWorker(...[first].concat(more));
  };

  monaco.languages.registerCompletionItemProvider(
    modeId,
    new languageFeatures.SuggestAdapter(worker)
  );
  monaco.languages.registerSignatureHelpProvider(
    modeId,
    new languageFeatures.SignatureHelpAdapter(worker)
  );
  monaco.languages.registerHoverProvider(
    modeId,
    new languageFeatures.QuickInfoAdapter(worker)
  );
  monaco.languages.registerDocumentHighlightProvider(
    modeId,
    new languageFeatures.OccurrencesAdapter(worker)
  );
  monaco.languages.registerDefinitionProvider(
    modeId,
    new languageFeatures.DefinitionAdapter(worker)
  );
  monaco.languages.registerReferenceProvider(
    modeId,
    new languageFeatures.ReferenceAdapter(worker)
  );
  monaco.languages.registerDocumentSymbolProvider(
    modeId,
    new languageFeatures.OutlineAdapter(worker)
  );
  monaco.languages.registerDocumentRangeFormattingEditProvider(
    modeId,
    new languageFeatures.FormatAdapter(worker)
  );
  monaco.languages.registerOnTypeFormattingEditProvider(
    modeId,
    new languageFeatures.FormatOnTypeAdapter(worker)
  );
  monaco.languages.registerCodeActionProvider(
    modeId,
    new languageFeatures.CodeActionAdaptor(worker)
  );
  monaco.languages.registerRenameProvider(
    modeId,
    new languageFeatures.RenameAdapter(worker)
  );
  monaco.languages.registerDocumentFormattingEditProvider(modeId, {
    async provideDocumentFormattingEdits(model, options, token) {
      const resource = model.uri;
      const w = await worker(resource);
      console.log(resource, w);

      const edits = await w.getFormattingEditsForDocument(
        resource.toString(),
        {}
      );
      console.log(edits);
      return [{ range: model.getFullModelRange(), text: edits }];
    }
  });
  new languageFeatures.DiagnosticsAdapter(defaults, modeId, worker);

  return worker;
}
