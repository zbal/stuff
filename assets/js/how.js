// DISCLAIMER: This is probably the worst code I have ever written

(function($) {
    $.fn.typeText = function(content, code) {
        code = typeof code !== 'undefined' ? code : false;

        if (content.length > 0) {
            var line = content.shift(),
                elem = this;

            if (line.charAt(0) == '$' || code) {
                var cursor = $('<span class="cursor">|</span>');
                var blinking = setInterval(function () {
                    cursor.toggle();
                }, 500);
                if (!code) {
                    elem.append('$ ');
                }
                else {
                    highlight(elem);
                }
                elem.append(cursor);
                
                var lineArray = code ? line.substring(0).split('') : line.substring(2).split(''),
                    current = 0;

                setTimeout(function() {
                    elem.scrollTop(elem[0].scrollHeight);
                    var typing = setInterval(function() {
                        if (current < lineArray.length) {
                            cursor.before(lineArray[current++]);
                        }
                        else {
                            clearInterval(typing);
                            setTimeout(function() {
                                cursor.after("\n");
                                if (content.length > 0) {
                                    cursor.remove();
                                    elem.typeText(content, code);
                                    elem.scrollTop(elem[0].scrollHeight);
                                }
                            }, 400);
                        }
                        return;
                    }, 40);
                }, 400);
            }
            else {
                setTimeout(function() {
                    elem.append(line + "\n");
                    elem.scrollTop(elem[0].scrollHeight);
                    elem.typeText(content, code);
                }, 120);
            }
        }
    };
})(jQuery);

function highlight(elem) {
    var text = elem.text(),
        lines = text.split("\n"),
        highlight = '';

    for (i = 0; i < lines.length; i++) {
        if (lines[i].indexOf(':') > -1) {
            var split = lines[i].split(':');
            highlight += '<i>'+ split[0] + '</i>:<b>' + split[1] +'</b>';
        }
        else {
            highlight += lines[i];
        }
        if (i < lines.length - 1) highlight += "\n";
    }
    elem.html(highlight);
}

$(function() {
    if (!$('body.page-front').length) return;

    var slideshow_lock = false; // Disable slideshow on hover
    var browser_lock = false;
    var console_lock = false;
    var editor_lock = false;
    
    var terminal = $('#main .how .console .body pre'),
        terminal_lines = terminal.html().split("\n");
    terminal.empty();

    var editor = $('#main .how .editor .body pre'),
        editor_lines = editor.text().split("\n");
    editor.empty();
    
    $('#main .how .steps .step').hover(function () {
        slideshow_lock = true;
        $('#main .how .steps .step').removeClass('active');
        $(this).addClass('active');
        $('#main .how .illustration').removeClass('active');
        $('#main .how .illustration.'+ $(this).attr('rel')).addClass('active');
        switch ($(this).attr('rel')) {
            case 'browser':
                if (browser_lock) return;
                browser_lock = true;
                setTimeout(function() {
                    $('#main .how .browser ul li:first-child').removeClass('running').addClass('success');
                }, 4000);
                break;

            case 'console':
                terminal.scrollTop(terminal[0].scrollHeight);
                if (console_lock) return;
                console_lock = true;
                terminal.typeText(terminal_lines);
                break;

            case 'editor':
                editor.scrollTop(editor[0].scrollHeight);
                if (editor_lock) return;
                editor_lock = true;

                for (i = 0; i < 8; i++) {
                    var line = editor_lines.shift();
                    editor.append(line + "\n");
                    editor.scrollTop(editor[0].scrollHeight);
                }
                highlight(editor);
                editor.append("\n");
                editor.html(editor.html().substring(0, editor.html().length - 1));
                editor.typeText(editor_lines, true);
                break;
        }
    });

    $('#main .how .steps .step:first-child').trigger('mouseenter');

    setInterval(function() {
        if (!slideshow_lock) {
            var active = $('#main .how .steps .step.active');
            
            if (active.next('.step').length) {
                var next = active.next('.step');
            }
            else {
                var next = $('.steps .step:first-child');
            }
            next.trigger('hover');
            slideshow_lock = false;
        }
    }, 8000);
});
