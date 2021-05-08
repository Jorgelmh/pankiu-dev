"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("next/document");
class MyDocument extends document_1.default {
    render() {
        return (<document_1.Html lang="en">
        <document_1.Head>
          {/** FavIcon */}
          {/** WebFont */}
          {/** stylesheets */}
          {/** scripts */}
        </document_1.Head>
        <body>
          <document_1.Main />
          <document_1.NextScript />
        </body>
      </document_1.Html>);
    }
}
exports.default = MyDocument;
//# sourceMappingURL=_document.js.map