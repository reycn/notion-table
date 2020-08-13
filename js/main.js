var info = new Vue({
    el: '#info',
    data: {
        author: 'Reynard',
        author_site: 'https://quoth.win/',
        description: 'A Katex Compatible Table Generator For Notion',
        notion_site: 'https://notion.so/'
    },
});

var content = new Vue({
    el: '#content',
    data: {
        text: 'Test',
        code: "",
        col: 3,
        row: 2,
        begin: '\\begin{array}',
        end: '\\end{array}',
        hline: '\\\\\\hline\n',
        head: '',
        line: '',
        bold_head: 'false',
        copied_message: '',
        clicks: false,
        output: 'Message: the output is currently null!'
    },
    methods: {
        text_to_code: function() {
            if (this.bold_head == 'true') {
                this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\textbf{Col}\&').repeat(this.col).slice(0, -1) + this.hline;
            } else if (this.bold_head == 'false') {
                this.head = '{' + ('c').repeat(this.col) + '}' + this.hline.slice(2) + ('\\text{Col}\&').repeat(this.col).slice(0, -1) + this.hline;
            }
            this.line = ('c&').repeat(this.col).slice(0, -1) + this.hline
            this.output = this.begin + this.head + this.line.repeat(this.row) + this.end;
            katex.render(this.output, document.getElementsByClassName('preview')[0], {
                throwOnError: false
            });

            try {
                this.copied_message = 'Copied!'
                navigator.clipboard.writeText(this.output);
            } catch (err) {
                this.copied_message = 'Failed to copy: ' + err
                console.error('Failed to copy: ', err);
            }
            // if (this.clicks) {
            // }
        },
    },
    watch: {
        col: function() {
            this.text_to_code();
            this.clicks = true;
        },
        row: function() {
            this.text_to_code();
            this.clicks = true;
        },
        bold_head: function() {
            this.text_to_code();
            this.clicks = true;
        }
    },
    mounted: function() {
        this.text_to_code();
    }
});