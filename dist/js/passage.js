"use strict";

// const { default: hljs } = require("highlight.js");

$(function(){
    hljs.configure({   // optionally configure hljs
        languages: ['javascript', 'ruby', 'python', 'cpp', 'html', 'css', 'r', 'c', 'php']
      });
      window.onload = function() {
        syntaxHighlight();
    };
    function syntaxHighlight(){
        var codes = document.getElementsByTagName('pre');
        for (var i=0; i < codes.length; i++) {
            if(codes[i].parentElement.nodeName !== 'CODE-INPUT'){
                console.log('test');
                hljs.highlightBlock(codes[i]);
            }
        }
    }
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
    $(document).on('click', '[id^="passage_edit_"]', function(e){
        var _id = $(this).attr('id').split('_').at(-1);
        if($(this).data('quill') == false){
            // hljs.configure({   // optionally configure hljs
            //     languages: ['javascript', 'ruby', 'python', 'cpp', 'html', 'css', 'r', 'c', 'php']
            // });
            var toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                ['link', 'image'],
            
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
            
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
            
                ['clean']                                         // remove formatting button
            ];
            // Only do if quill container exists (rtf)
            try{
                var quill = new Quill('#passage_content_' + _id, {
                modules: {
                    syntax: true,              // Include syntax module
                    toolbar: toolbarOptions,  // Include button in toolbar
                },
                theme: 'snow'
                });
                quill.root.innerHTML = document.getElementById('quill-data-' + _id).value;
                quill.on('text-change', function(delta, source) {
                    var justHtml = quill.root.innerHTML;
                    document.getElementById('quill-data-' + _id).value = justHtml;
                });
            }
            catch(error){
                console.log(error);
            }
            finally{

            }
            $(this).data('quill', true);
        }
        $('#passage_form_' + _id).slideToggle();
    });

    // $(document).on('click', '.passage_tab_open_advanced', function(e){
    //     $('.passage_advanced').fadeToggle().css('display', 'inline-block');
    // });
    $(document).on('click', '[id^="passage_executable_"]', function(e){
        let _id = $(this).attr('id').split('_').at(-1);
        $('#passage_advanced_' + _id).fadeToggle();
    });
    $(document).on('click', '[id^="passage_details_executable_"]', function(e){
        let _id = $(this).attr('id').split('_').at(-1);
        $('#passage_details_advanced_' + _id).fadeToggle();
    });
    $(document).on('change', '[id^="passage_file_"]', function(e){
        let _id = $(this).attr('id').split('_').at(-1);
        var mimeType = $(this)[0].files[0].type.split('/')[0];
        var isSVG = false;
        if($(this)[0].files[0].type.split('/')[0] == 'image'
        && $(this)[0].files[0].type.split('+')[0].split('/')[1] == 'svg'){
            isSVG = true;
            mimeType = 'svg';
        }
        else{
            isSVG = false;
        }
        var file = $(this)[0].files[0];
        //create temp source link from uploaded file
        var srcLink = URL.createObjectURL(file);
        var thiz = $(this);
        switch(mimeType){
            case 'image':
                //set src
                $('#thumbnail_image_' + _id).attr('src', srcLink);
            break;
            //inject into 3js and cut from canvas to save thumbnail
            case 'model':
                //create scene in three js
                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera( 75, 300 / 300, 0.1, 1000 );

                const renderer = new THREE.WebGLRenderer();
                renderer.domElement.id = "model_thumbnail_canvas_" + _id;
                renderer.domElement.style = "display:none;";
                renderer.setSize( 300, 300 );
                thiz.after(renderer.domElement);
                //load model into scene
                var loader = new THREE.GLTFLoader();
                loader.load(srcLink, function(data){
                    scene.add( data.scene );
                    camera.position.z = 5;
                    //make sure there is light to see the object
                    var light = new THREE.PointLight( 0xffffcc, 20, 200 );
                    light.position.set( 4, 30, -20 );
                    scene.add( light );

                    var light2 = new THREE.AmbientLight( 0x20202A, 20, 100 );
                    light2.position.set( 30, -10, 30 );
                    scene.add( light2 );
                    renderer.render(scene, camera);
                    //save snapshot of canvas to thumbnail field as data url
                    var base64Image = renderer.domElement.toDataURL();
                    $('#thumbnail_image_' + _id).attr('src', base64Image);
                    $('#thumbnail_clip_' + _id).val(base64Image);
                });
            break;
            case 'svg':
                // inject svg into canvas and save image as thumbnail
                const canvas = document.getElementById('thumbnail_canvas_' + _id);
                var ctx = canvas.getContext("2d");
                var img = new Image();
                img.onload = function() {
                    ctx.drawImage(img, 0, 0);
                    var thumbnail = canvas.toDataURL();
                    $.ajax({
                        type: 'post',
                        url: DOMAIN + '/update_thumbnail/',
                        data: {
                            passageID: _id,
                            thumbnail: thumbnail
                        },
                        success: function(data){
                            // alert(data);
                        }
                    });
                    $('#thumbnail_image_' + _id).attr('src', thumbnail);
                    $('#thumbnail_clip_' + _id).val(thumbnail);
                }
                img.src = srcLink;
            break;
        }
        $('#passage_thumbnail_' + _id).fadeIn();
    });
    $(document).on('click', '#add_passage_button', function(e){
        var chief = $('#chief_passage_id').val();
        //create a passage and then show it
        $.ajax({
            type: 'post',
            url: DOMAIN + '/create_passage/',
            data: {
                passageID: chief
            },
            success: function(data){
                if(chief == 'root'){
                    $('#passage_wrapper').prepend(data);
                }
                else{
                    $('#passage_wrapper').append(data);
                }
            }
        });
    });
    function getPassageId(thiz){
        //passage_id is the last part of the html id
        return $(thiz).attr('id').split('_')[$(thiz).attr('id').split('_').length - 1];
    }
    function getPassageTitle(_id){
        return encodeURIComponent($('#passage_title_'+_id).val());
    }
    function thisPassage(thiz){
        return $('#passage_' + getPassageId(thiz));
    }
    $(document).on('click', '[id^="passage_delete_"]', function(e){
        var _id = getPassageId(this);
        $.ajax({
            type: 'post',
            url: DOMAIN + '/delete_passage/',
            data: {
                _id: _id
            },
            success: function(data){
                $('#passage_'+_id).remove();
            }
        });
    });
    $(document).on('click', '[id^="passage_install_"]', function(e){
        var _id = getPassageId(this);
        $.ajax({
            type: 'post',
            url: DOMAIN + '/install_passage/',
            data: {
                _id: _id
            },
            success: function(data){
                flashIcon($('#passage_install_' + _id), 'green');
            }
        });
    });
    $(document).on('click', '[id^="passage_more_"]', function(e){
        let _id = getPassageId(this);
        let title = getPassageTitle(_id) == '' ? 'Untitled' : getPassageTitle(_id);
        let href = '/passage/'+ title +'/' + _id;
        $('.active_tab').html('<span class="tab_delete">X</span>' + decodeURIComponent(title));
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
            url: DOMAIN + '/copy_passage',
            data: {
                _id: _id,
                parent: $('#chief_passage_id').val()
            },
            success: function(data){
                $('#passage_' + _id).after(data);
                flashIcon($('#passage_copy_' + _id), 'green');
            }
        });
    });
    $(document).on('click', '[id^="passage_bookmark_"]', function(e){
        var _id = getPassageId(this);
        var thiz = $(this);
        $.ajax({
            type: 'post',
            url: DOMAIN + '/bookmark_passage',
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
                url: DOMAIN + '/add_user',
                type: 'POST',
                data: {
                    passageId: thiz.attr('id').split('_').at(-1),
                    username: thiz.val()
                },
                success: function (data) {
                    alert(data);
                    window.location.reload();
                }
            });
        }
    });
    $(document).on('click', '.passage_remove_user', function(e){
        $.ajax({
            url: DOMAIN + '/remove_user',
            type: 'POST',
            data: {
                passageId: $(this).attr('id').split('_').at(-1),
                username: thiz.data('userId')
            },
            success: function (data) {
                window.location.reload();
            }
        });
    });
    $(document).on('click', '#parent_title', function(e){
        window.location.href = $(this).data('url');
    });
    $(document).on('click', '.passage_setting', function(){
        let _id = $(this).attr('id').split('_').at(-1);
        let setting = $(this).data('setting');
        var thiz = $(this);
        $.ajax({
            url: DOMAIN + '/passage_setting',
            type: 'POST',
            data: {
                _id: _id,
                setting: setting
            },
            success: function (data) {
                if(thiz.data('setting') != 'request-public-daemon'){
                    if(thiz.hasClass('green')){
                        thiz.removeClass('green');
                        thiz.addClass('red');
                    }
                    else if(thiz.hasClass('red')){
                        thiz.removeClass('red');
                        thiz.addClass('green');
                    }
                }
                switch (thiz.data('setting')) {
                    case 'public':
                        let privateSetting = $('#passage_setting_make_private_' + _id);
                        if(privateSetting.hasClass('green')){
                            privateSetting.removeClass('green');
                            privateSetting.addClass('red');
                        }
                        else if(privateSetting.hasClass('red')){
                            privateSetting.removeClass('red');
                            privateSetting.addClass('green');
                        }
                        break;
                    case 'private':
                        let publicSetting = $('#passage_setting_make_public_' + _id);
                        if(publicSetting.hasClass('green')){
                            publicSetting.removeClass('green');
                            publicSetting.addClass('red');
                        }
                        else if(publicSetting.hasClass('red')){
                            publicSetting.removeClass('red');
                            publicSetting.addClass('green');
                        }
                        break;
                    case 'request-public-daemon':
                        if(thiz.hasClass('yellow')){
                            thiz.removeClass('yellow');
                            thiz.addClass('red');
                        }
                        else if(thiz.hasClass('red')){
                            thiz.removeClass('red');
                            thiz.addClass('yellow');
                        }
                        break;
                    case 'personal':
                        if(thiz.hasClass('green')){
                            thiz.removeClass('green');
                            thiz.addClass('red');
                        }
                        else if(thiz.hasClass('red')){
                            thiz.removeClass('red');
                            thiz.addClass('green');
                        }
                        break;
                    
                    default:
                        
                        break;
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
            url: DOMAIN + '/update_passage',
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
            url: DOMAIN + '/star_passage/',
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
    $(document).on('click', '[id^="passage_push_"]', function(e){
        var _id = getPassageId(this);
        var passage = $('#full_push_passage_' + _id).val();
        $.ajax({
            type: 'post',
            url: '/push',
            data: {
                _id: _id,
                passage: passage
            },
            success: function(data){
                flashIcon($('#passage_push_' + _id), 'green');
                alert(data);
            }
        });
    });
    $(document).on('click', '[id^=passage_update_]', function(){
        var _id = getPassageId(this);
        flashIcon($('#passage_update_' + _id), 'green');
        // var content = $('#passage_content_' + _id).html();
        // $('#quill-data-' + _id).val(content);
        $('#passage_form_' + _id).submit();
        syntaxHighlight();
        //if chapter passage in view,
        //update passage order according to sortable
        //pending ....
        // ....
        if($('#chief_passage_id').val() == _id){
            var orderList = [];
            if($('#sub_passages').length){
                orderList = $('#sub_passages').sortable('toArray');
                orderList.forEach(function(p, i){
                    orderList[i] = orderList[i].split('_')[1];
                });
            }
            $.ajax({
                url: DOMAIN + '/update_passage_order',
                type: 'POST',
                data: {
                    _id: _id,
                    passageOrder: JSON.stringify(orderList)
                },
                success: function (data) {
                    //alert(data);
                }
            });
        }
    });
    //For Home, Search, and Profile
    $(document).on('click', '#view_more', function(){
        //check if home, search, or profile
        var isProfile = $('#is_profile').val();
        page += 1;
        $.ajax({
            type: 'post',
            url: DOMAIN + '/paginate',
            data: {
                page: page,
                passage: $('#chief_passage_id').val(),
                profile: isProfile,
                search: $('#search').val()
            },
            success: function(data){
                $('#passage_wrapper').append(data);
            }
        });
    });
    $(document).on('keyup', '[id^=display_html_]', function(){
        var _id = getPassageId(this);
        $('#passage_html_' + _id).val($(this).val());
    });
    $(document).on('keyup', '[id^=display_css_]', function(){
        var _id = getPassageId(this);
        $('#passage_css_' + _id).val($(this).val());
    });
    $(document).on('keyup', '[id^=display_js_]', function(){
        var _id = getPassageId(this);
        $('#passage_js_' + _id).val($(this).val());
    });
    $(document).on('keyup', '[id^=display_code]', function(){
        var _id = getPassageId(this);
        $('#passage_code_' + _id).val($(this).val());
    });
    $(document).on('click', '.view_code', function(){
        syntaxHighlight();
    });
    // $(document).on('keyup', '.passage_ext', function(){
    //     var _id = $(this).attr('id').split('_').at(-1);
    //     var code = $('#display_code_'+_id).val();
    //     $('#display_code_'+_id).replaceWith('<code-input value="'+code+'"lang="'+$(this).val()+'"class="code_display display_code" id="display_ext_'+_id+'>"></code-input>');
    // });
});