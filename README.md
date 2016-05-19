# mkpdf 

[![npm version](https://badge.fury.io/js/mkpdf.svg)](https://badge.fury.io/js/mkpdf)

Convert Markdown to PDF using [marked](https://github.com/chjj/marked) and [wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf). You can use multiple Markdown input files and customize the resulting PDF using HTML and CSS.

### Credits 

Thanks to [https://github.com/alanshaw/markdown-pdf](https://github.com/alanshaw/markdown-pdf), which also converts Markdown files to PDF using remarkable and PhantomJS.

### wkhtmltopdf

> mkpdf is using [wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf) to convert HTML to PDF using Webkit (QtWebKit). Before you can use mkpdf, you'll have to install wkhtmltopdf command line tool.

You can either [download a prebuilt version](http://wkhtmltopdf.org/downloads.html#stable) for your system or use a package manager, for example on OS X:

##### Install wkhtmltopdf with Homebrew

```bash
brew install Caskroom/cask/wkhtmltopdf
```

## Command line usage

### Installation

> Install mkpdf as a global module:

```bash
npm install -g mkpdf
```

### Usage

```bash
Usage: mkpdf [options] <markdown-files...>

Options:

-h, --help                             output usage information
-V, --version                          output the version number
-f, --paper-format [format]            "A3", "A4", "A5", "Legal", "Letter" or "Tabloid"
-r, --paper-orientation [orientation]  "portrait" or "landscape"
-b, --paper-border [measurement]       Supported dimension units are: "mm", "cm", "in", "px"
-o, --out [path]                       Path for saving the PDF
--disable-toc                          Don't create a table of contents
--toc-title [title]                    The table of contents title. Defaults to "Table of Contents"
--css-path [path]                      Path to custom CSS file
--highlight-css-path [path]            Path to custom highlight.js CSS file
--html-path [path]                     Path to custom HTML file
```

> For example, convert `README.md` to `README.pdf`:

```bash
mkpdf README.md
```

> Or, combine multiple markdown files to a single PDF:

```bash
mkpdf -o welcome.pdf README.md LICENSE.md CONTRIBUTING.md
```

## Programmatic usage

### Installation

> Install mkpdf as a local module into your project:

```bash
npm install mkpdf
```

### Usage

```js
var mkpdf = require('mkpdf')

mkpdf().from('/path/to/document.md').to('/path/to/document.pdf', function () {
	console.log('Done')
})

// Or using streams
var fs = require('fs')

fs.createReadStream('/path/to/document.md')
	.pipe(mkpdf())
	.pipe(fs.createWriteStream('/path/to/document.pdf'))
```

### API

mkpdf returns a [stream-from-to](https://github.com/alanshaw/stream-from-to) object which simplifies the construction of various source and destination streams.

### Options

Pass an options object to `mkpdf` to configure the output.

```js
mkpdf(options)
```

#### options.paperFormat

> The paper size. Defaults to `A4`

#### options.paperBorder

> The paper margin. Defaults to `2cm`

#### options.paperOrientation

> The paper orientation. Defaults to `portrait`

#### options.disableToc

> Don't create a table of contents. Defaults to `false`

#### options.tocTitle

> The table of contents title. Defaults to `Table of Contents`

#### options.cssPath

> Path to custom CSS file, relative to the current directory. Defaults to `[mkpdf_path]/assets/pdf.css`

#### options.highlightCssPath

> Path to custom [highlight.js](https://github.com/isagalaev/highlight.js) CSS file, relative to the current directory. Defaults to `[mkpdf_path]/assets/github-gist.css`

#### options.htmlPath

> Path to custom HTML file, relative to the current directory. Defaults to `[mkpdf_path]/assets/index.html`

#### options.preProcessMd

> A function that returns a [through2](https://github.com/rvagg/through2) stream that transforms the Markdown before it is converted to HTML. Defaults to `function () { return through() }`

#### options.preProcessHtml

> A function that returns a [through2](https://github.com/rvagg/through2) stream that transforms the HTML before it is converted to PDF. Defaults to `function () { return through() }`