var fs = require('fs')
var path = require('path')
var through = require('through2')
var streamft = require('stream-from-to')
var marked = require('marked')
var extend = require('extend')
var duplexer = require('duplexer')
var wkhtmltopdf = require('wkhtmltopdf')

marked.setOptions({
	highlight: function (code) {
		return require('highlight.js').highlightAuto(code).value
	}
})

function mkpdf (opts) {
	opts = opts || {}
	opts.cssPath = opts.cssPath ? path.resolve(opts.cssPath) : path.join(__dirname, 'assets/pdf.css')
	opts.highlightCssPath = opts.highlightCssPath ? path.resolve(opts.highlightCssPath) : path.join(__dirname, 'assets/github-gist.css')
	opts.htmlPath = opts.htmlPath ? path.resolve(opts.htmlPath) : path.join(__dirname, 'assets/index.html')
	opts.preProcessMd = opts.preProcessMd || function () { return through() }
	opts.preProcessHtml = opts.preProcessHtml || function () { return through() }
	opts.paperFormat = opts.paperFormat || 'A4'
	opts.paperOrientation = opts.paperOrientation || 'portrait'
	opts.paperBorder = opts.paperBorder || '2cm'
	opts.disableToc = opts.disableToc || false
	opts.tocTitle = opts.tocTitle || 'Table of Contents'

	var md = ''
	var mdToHtml = through(
		function transform (chunk, enc, cb) {
			md += chunk + '\n\n'
			cb()
		},
		function flush (cb) {
			this.push(marked(md))
			this.push(null)
		}
	)
	var htmlTemplate = fs.readFileSync(opts.htmlPath, 'utf8')

	var wkopts = { 
		toc: !opts.disableToc,
		outlineDepth: 2,
		pageSize: opts.paperFormat,
		orientation: opts.paperOrientation,
		marginLeft: opts.paperBorder,
		marginRight: opts.paperBorder,
		marginTop: opts.paperBorder,
		marginBottom: opts.paperBorder
	}
	if (!opts.disableToc) {
		wkopts['tocHeaderText'] = opts.tocTitle
	}

	var html = ''
	var htmlToPdf = through(
		function transform (chunk, enc, cb) {
			html += chunk
			cb()
		},
		function flush (cb) {
			var content = htmlTemplate.replace('{{content}}', html)
				.replace('{{cssPath}}', opts.cssPath)
				.replace('{{highlightCssPath}}', opts.highlightCssPath)

			wkhtmltopdf(content, wkopts).pipe(outputStream)
		}
	)

	var inputStream = through()
	var outputStream = through()

	inputStream
		.pipe(opts.preProcessMd())
		.pipe(mdToHtml)
		.pipe(opts.preProcessHtml())
		.pipe(htmlToPdf)

	return extend(
		duplexer(inputStream, outputStream),
		streamft(function () {
			return mkpdf(opts)
		})
	)
}

module.exports = mkpdf