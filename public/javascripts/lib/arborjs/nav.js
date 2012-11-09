define(
["jquery", "arborjs/arbor", "arborjs/arbor-tween", "arborjs/arbor-graphics"], function($) {

    var Nav = function(elt) {
            var dom = $(elt)

            var _path = null

            var that = {
                init: function() {
                    $(window).bind('popstate', that.navigate)
                    dom.find('> a').click(that.back)
                    $('.more').one('click', that.more)

                    $('#docs dl:not(.datastructure) dt').click(that.reveal)
                    that.update()
                    return that
                },
                more: function(e) {
                    $(this).removeAttr('href').addClass('less').html('&nbsp;').siblings().fadeIn()
                    $(this).next('h2').find('a').one('click', that.less)

                    return false
                },
                less: function(e) {
                    var more = $(this).closest('h2').prev('a')
                    $(this).closest('h2').prev('a').nextAll().fadeOut(function() {
                        $(more).text('creation & use').removeClass('less').attr('href', '#')
                    })
                    $(this).closest('h2').prev('a').one('click', that.more)

                    return false
                },
                reveal: function(e) {
                    $(this).next('dd').fadeToggle('fast')
                    return false
                },
                back: function() {
                    _path = "/"
                    if(window.history && window.history.pushState) {
                        window.history.pushState({
                            path: _path
                        }, "", _path);
                    }
                    that.update()
                    return false
                },
                navigate: function(e) {
                    var oldpath = _path
                    if(e.type == 'navigate') {
                        _path = e.path
                        if(window.history && window.history.pushState) {
                            window.history.pushState({
                                path: _path
                            }, "", _path);
                        } else {
                            that.update()
                        }
                    } else if(e.type == 'popstate') {
                        var state = e.originalEvent.state || {}
                        _path = state.path || window.location.pathname.replace(/^\//, '')
                    }
                    if(_path != oldpath) that.update()
                },
                update: function() {
                    var dt = 'fast'
                    if(_path === null) {
                        // this is the original page load. don't animate anything just jump
                        // to the proper state
                        _path = window.location.pathname.replace(/^\//, '')
                        dt = 0
                        dom.find('p').css('opacity', 0).show().fadeTo('slow', 1)
                    }

                    switch(_path) {
                    case '':
                    case '/':
                        dom.find('p').text('a graph visualization library using web workers and jQuery')
                        dom.find('> a').removeClass('active').attr('href', '#')

                        $('#docs').fadeTo('fast', 0, function() {
                            $(this).hide()
                            $(that).trigger({
                                type: 'mode',
                                mode: 'visible',
                                dt: dt
                            })
                        })
                        break

                    case 'introduction':
                    case 'reference':
                        $(that).trigger({
                            type: 'mode',
                            mode: 'hidden',
                            dt: dt
                        })
                        dom.find('> p').text(_path)
                        dom.find('> a').addClass('active').attr('href', '#')
                        $('#docs').stop(true).css({
                            opacity: 0
                        }).show().delay(333).fadeTo('fast', 1)

                        $('#docs').find(">div").hide()
                        $('#docs').find('#' + _path).show()
                        break
                    }

                }
            }
            return that
        }

    return Nav;

});