"use strict"
$(function(){
    $('#sub_passages').sortable({
        handle: '.passage_options'
    });
    //sub passages are only hidden for index and search
    var inRoot = $('#chief_passage_id').val() === 'root';
    if($('#chief_passage_id').val() != 'root'){
        $('.sub_passages').show();
    }
    $(document).on('click', '[id^="passage_executable_"]', function(e){
        let _id = $(this).attr('id').split('_').at(-1);
    });

    $(document).on('click', '.passage_tab_open_advanced', function(e){
        $('.passage_advanced').fadeToggle().css('display', 'inline-block');
    });
    $(document).on('click', '#add_passage_button', function(e){
        //create a passage and then show it
        $.ajax({
            type: 'post',
            url: '/create_passage/',
            data: {
                passageID: $('#chief_passage_id').val()
            },
            success: function(data){
                $('#passage_wrapper').prepend(data);
            }
        });
    });
    function getPassageId(thiz){
        //passage_id is the last part of the html id
        return $(thiz).attr('id').split('_')[$(thiz).attr('id').split('_').length - 1];
    }
    function getPassageTitle(_id){
        return $('#passage_title_'+_id).val();
    }
    function thisPassage(thiz){
        return $('#passage_' + getPassageId(thiz));
    }
    $(document).on('click', '[id^="passage_delete_"]', function(e){
        var _id = getPassageId(this);
        $.ajax({
            type: 'post',
            url: '/delete_passage/',
            data: {
                _id: _id
            },
            success: function(data){
                $('#passage_'+_id).remove();
            }
        });
    });
    $(document).on('click', '[id^="passage_more_"]', function(e){
        let _id = getPassageId(this);
        let title = getPassageTitle(_id) == '' ? 'Untitled' : getPassageTitle(_id);
        let href = '/passage/'+ title +'/' + _id;
        $('.active_tab').html('<span class="tab_delete">X</span>' + title);
        let tab_id = $('.active_tab').attr('id');
        localStorage.setItem(tab_id, JSON.stringify({text: title, href: href}));
        localStorage.setItem('active_tab', tab_id);
        window.location.href = href;
    });
    $(document).on('click', '[id^="passage_copy_"]', function(e){
        var _id = getPassageId(this);
        var thiz = $(this);
        $.ajax({
            type: 'post',
            url: '/copy_passage',
            data: {
                _id: _id,
                parent: $('#chief_passage_id').val()
            },
            success: function(data){
                $('#passage_wrapper').prepend(data);
                flashIcon($('#passage_copy_' + _id), 'green');
            }
        });
    });
    $(document).on('click', '[id^="passage_bookmark_"]', function(e){
        var _id = getPassageId(this);
        var thiz = $(this);
        $.ajax({
            type: 'post',
            url: '/bookmark_passage',
            data: {
                _id: _id,
            },
            success: function(data){
                updateBookmarks();
                flashIcon($('#passage_bookmark_' + _id), 'green');
            }
        });
    });
    $(document).on('keyup', '.passage_add_user', function(e){
        if(e.keyCode == 13){
            var thiz = $(this);
            $.ajax({
                url: '/add_user',
                type: 'POST',
                data: {
                    passageId: thiz.attr('id').split('_').at(-1),
                    username: thiz.val()
                },
                success: function (data) {
                    console.log(data);
                }
            });
        }
    });
    $(document).on('click', '.passage_remove_user', function(e){
        $.ajax({
            url: '/remove_user',
            type: 'POST',
            data: {
                passageId: $(this).attr('id').split('_').at(-1),
                username: thiz.data('userId')
            },
            success: function (data) {
                console.log(data);
            }
        });
    });
    $(document).on('click', '.passage_setting', function(){
        let _id = $(this).attr('id').split('_').at(-1);
        let setting = $(this).data('setting');
        var thiz = $(this);
        $.ajax({
            url: '/passage_setting',
            type: 'POST',
            data: {
                _id: _id,
                setting: setting
            },
            success: function (data) {
                if(thiz.hasClass('green')){
                    thiz.removeClass('green');
                    thiz.addClass('red');
                }
                else if(thiz.hasClass('red')){
                    thiz.removeClass('red');
                    thiz.addClass('green');
                }
                // alert(data);
            }
        });
    });
    $(document).on('submit', '[id^=passage_form_]', function(e){
        e.preventDefault();
        var thiz = $(this);
        var formData = new FormData(this);
        $.ajax({
            url: '/update_passage',
            type: 'POST',
            data: formData,
            success: function (data) {
                thisPassage(thiz).replaceWith(data);
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });
    $(document).on('click', '.add_stars', function(){
        var thiz = $(this);
        var passage_id = $(this).attr('id').split('_').at(-1);
        var amount = $('#star_number_' + passage_id).val();
        $.ajax({
            url: '/star_passage/',
            type: 'POST',
            data: {
                passage_id: passage_id,
                amount: amount
            },
            success: function(data){
                thisPassage(thiz).replaceWith(data);
            }
        });
    });
    $(document).on('click', '.change_passage_file', function(){
        let _id = $(this).attr('id').split('_')[$(this).attr('id').split('_').length - 1];
        // $('#passage_file_' + _id).
    });
    $(document).on('click', '[id^=passage_update_]', function(){
        var _id = getPassageId(this);
        flashIcon($('#passage_update_' + _id), 'green');
        $('#passage_form_' + _id).submit();
        //if chapter passage in view,
        //update passage order according to sortable
        //pending ....
        // ....
        
        var orderList = [];
        if($('#sub_passages').length){
            orderList = $('#sub_passages').sortable('toArray');
            orderList.forEach(function(p, i){
                orderList[i] = orderList[i].split('_')[1];
            });
        }
        $.ajax({
            url: '/update_passage_order',
            type: 'POST',
            data: {
                passageOrder: JSON.stringify(orderList)
            },
            success: function (data) {
                alert(data);
            }
        });
    });
    $(document).on('click', '[id^=passage_flag_]', function(){
        var _id = getPassageId(this);
        $.ajax({
            type: 'post',
            url: '/flag_passage',
            data: {
                _id: _id
            },
            success: function(data){
                
            }
        });
    });
});