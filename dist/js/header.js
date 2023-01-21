$(function(){
    // localStorage.clear();
    console.log(localStorage.getItem('num_tabs'));
    if(localStorage.getItem('num_tabs') === null){
        localStorage.setItem('num_tabs', 1);
        localStorage.setItem('tab_' + 1, JSON.stringify({text: 'Home', href: '/'}));
    }
    var num_tabs = parseInt(localStorage.getItem('num_tabs'));
    function addTab(num){
        if(localStorage.getItem('tab_' + num) === null){
            return false;
        }
        let tab_data = JSON.parse(localStorage.getItem('tab_' + num));
        if(tab_data === null) return false;
        $('#new_tab').before(' <li id="tab_'+(num)+'" data-href="'+tab_data.href+'" class="tab">'+tab_data.text+'</li> ');
    }
    $(document).on('click', '.tab_delete', function(e){
        var thiz = $(this);
        //id of tab to be deleted
        var _id = thiz.parent().attr('id');
        var _num = _id.split('_')[1];
        //thiz.remove();
        var num_tabss = $('.tab').length;
        $('.tab').each(function(){
            //id of tab
            let tabId = $(this).attr('id');
            let tabNum = tabId.split('_')[1];
            if(localStorage.getItem('tab_' + tabNum) === null){
                return false;
            }
            if(tabNum > _num){
                //push back tab ids
                $('#tab_' + tabNum).attr('id', '#tab_' + tabNum - 1);
                let tabData = JSON.parse(localStorage.getItem('tab_' + tabNum));
                let text = tabData.text;
                let href = tabData.href;
                localStorage.setItem('tab_' + tabNum - 1, JSON.stringify({text: text, href: href}));
                //remove last tab
                if(tabNum == num_tabss - 1){
                    localStorage.setItem('tab_' + tabNum, null);
                }
            }
        });
        //remove deleted tab    
        localStorage.setItem('tab_' + _num, null);
        $(this).parent().remove();
        e.stopPropagation();
    });
    $(document).on('click', '#new_tab', function(){
        let tab_num = num_tabs + 1; 
        localStorage.setItem('num_tabs', tab_num);
        var text = 'New Tab';
        if($('.tab').length - 1 === 0){
            text = 'Home';
        }
        localStorage.setItem('tab_' + tab_num, JSON.stringify({text: text, href: '/'}));
        addTab(tab_num);
        console.log(localStorage.getItem('num_tabs'));
    });
    //populate tabs from localStorage
    for(let i = 1; i <= num_tabs; ++i){
        addTab(i);
        let tab_data = JSON.parse(localStorage.getItem('tab_' + i));
        if(tab_data !== null){
            $('#tab_' + i).html('<span class="tab_delete">X</span>' + tab_data.text);
            $('#tab_' + i).data('href', tab_data.href);
        }
    }
    let active_tab_id = localStorage.getItem('active_tab');
    let active_tab_data = JSON.parse(localStorage.getItem(active_tab_id));
    if(active_tab_data !== null){
        $('#' + active_tab_id).html('<span class="tab_delete">X</span>' + active_tab_data.text);
        $('#' + active_tab_id).data('href', active_tab_data.href);
    }
    if(localStorage.getItem('active_tab') === null){
        localStorage.setItem('active_tab', 'tab_1');
    }
    $('#' + localStorage.getItem('active_tab')).addClass('active_tab');
    $(document).on('click', '#login_register_link', function(){
        window.location.href = "/loginform";
    });
    $(document).on('click', '#home_link', function(){
        var title = 'Home';
        let href = '/';
        $('.active_tab').html('<span class="tab_delete">X</span>' + title);
        let tab_id = $('.active_tab').attr('id');
        localStorage.setItem(tab_id, JSON.stringify({text: title, href: href}));
        localStorage.setItem('active_tab', tab_id);
        window.location.href = "/";
    });
    $(document).on('click', '#profile_link', function(){
        window.location.href = "/profile/";
    });
    $(document).on('click', '#help_link', function(){
        
    });
    $('.tab').droppable({
        drop: () => {
            // alert('dropped');
        },
        over: (event, ui) => {
            $('#' + event.target.id).css('background', 'yellow');
        },
        out: (event) => {
            $('#' + event.target.id).css('background', 'gold');
        },
        tolerance: 'pointer'
    });
    $(document).on('click', '.tab:not(".tab_delete")', function(){
        var href = window.location.href.split('/');
        let title = href[href.length - 2];
        let passage_id = href[href.length - 1];
        var _id = $(this).attr('id');
        console.log(_id);
        href = title + '/' + passage_id;
        if($(this).attr('id') !== 'new_tab'){
            $('.tab:not(#new_tab)').css('background', 'gold');
            $(this).css('background', 'yellow');
            localStorage.setItem('active_tab', _id);
            window.location.href = $(this).data('href');
            // localStorage.setItem(_id, href);
            // $(this).text(title);
            // $.ajax({
            //     type: 'get',
            //     url: '/tab/' + href,
            //     success: function(data){
            //         $('#passage_wrapper').html(data);
            //     }
            // });
        }
    });
});