import * as ReactDOMServer from "react-dom/server";
import {
  WebviewViewProvider,
  WebviewView,
  Webview,
  Uri,
  EventEmitter,
  window,
} from "vscode";
import Sidebar from "./components/SideBar";
import { create } from "./util/util";

export class SidebarProvider implements WebviewViewProvider {
  constructor(
    private readonly extensionPath: Uri,
    private data: any,
    private _view: WebviewView = null
  ) {}

  private onDidChangeTreeData: EventEmitter<any | undefined | null | void> =
    new EventEmitter<any | undefined | null | void>();

  refresh(context: any): void {
    this.onDidChangeTreeData.fire(null);
    this._view.webview.html = this._getHtmlForWebview(this._view?.webview);
  }

  //called when a view first becomes visible
  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionPath],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    this._view = webviewView;
    this.activateMessageListener();
  }

  private activateMessageListener() {
    this._view.webview.onDidReceiveMessage(async (message: any) => {
      switch (message.action) {
        case "GENERATE_MIGRATION":
          await create(this.data.workspacePath, {
            key:
              message.data.key && message.data.key.toString() !== "true"
                ? message.data.key.trim()
                : undefined,
            value:
              message.data.value && message.data.value.toString() !== "true"
                ? message.data.value
                    .replace(/(\r\n|\n|\r)/gm, "")
                    .replace(/"/g, '\\"')
                : undefined,
            desc:
              message.data.desc && message.data.desc.toString() !== "true"
                ? message.data.desc.trim()
                : undefined,
          });
          break;
        default:
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    // Script to handle user action
    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(this.extensionPath, "script", "sidebar-provider.js")
    );
    // CSS file to handle styling
    const styleUri = webview.asWebviewUri(
      Uri.joinPath(this.extensionPath, "script", "sidebar-provider.css")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();
    if (
      !this.data.isMigrateConsulProject ||
      !this.data.isMigrateConsulInstalledGlobal
    ) {
      return `<html>
  <head>
  </head>
  <body>
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div style="text-align: center;">
          <p>It seems like you are not in a migrate-consul project.</p>
          <p>Please open a migrate-consul project to use this extension</p>
          <p>You may create a new migrate-consul project by opening the Command Palette with Ctrl+Shift+P and running "Migrate Consul: New Project".</p>
          ${
            !this.data.isMigrateConsulInstalledGlobal
              ? '<p>You may need to install migrate-consul globally by opening the Command Palette with Ctrl+Shift+P and running "Migrate Consul: Install" or running "npm install --global typescript" and "npm install --global migrate-mongo".</p>'
              : ""
          }
        </div>
      </div>
  </body>`;
    }
    return `<html>
              <head>
                  <meta charSet="utf-8"/>
                  <meta http-equiv="Content-Security-Policy" 
                          content="default-src 'none';
                          img-src vscode-resource: https:;
                          font-src ${webview.cspSource};
                          style-src ${webview.cspSource} 'unsafe-inline';
                          script-src 'nonce-${nonce}'
                          
                          ;">             

                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <link href="${styleUri}" rel="stylesheet">

              </head>
              <body>
                  ${ReactDOMServer.renderToString(
                    <Sidebar message={"Create New Migration"} />
                  )}
                  <script nonce="${nonce}" src="${scriptUri}"></script>
              </body>
          </html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
