//shared code for server/client
(function(exports){

  exports.printPropertySelect = function(key, value){
    return `
<div class="property_select">
                            <ion-icon class="remove_property"src="/images/ionicons/remove-circle-outline.svg"></ion-icon> 
                            <!-- For Passages -->
                            <select name="property_key"class="property_key">
                                <option>`+key+`</option>
                                <option>Hyperlink</option>
                                <option>Color</option>
                                <option>CSS</option>
                                <option>Code/Markup</option>
                                <!-- 
                                    Ex.
                                    Javascript
                                    HTML
                                    Markdown
                                    Key Schema
                                    (Syntax highlight inoperable languages
                                    Add run button for JS
                                    Autorun Markdown)
                                 -->
                                <option>Access</option>
                                <option>Key Schema</option>
                                <!-- User inputs JSON with methods -->
                                <option>Canvas</option>
                                <!-- Render passage as canvas -->
                                <option>Tone</option>
                                <!-- Render passage via tone.js -->
                                <option>Hidden</option>
                                <!-- Hide passage -->
                                <option>Autorun</option>
                            </select>
                            <!-- For chapters -->
                            <!-- <select>
                                <option>Access</option>
                                <option>Chapter CSS</option>
                                <option>Passage CSS</option>
                                <option>Distraction Free Mode</option>
                                <option>Impress JS</option>
                                <option>Key Schema</option>
                                <option>Custom</option>
                                <option>Autorun</option>
                            </select> -->
                            <br><br>
                            <input value="`+value+`"name="property_value"class="property_value"type="" name="">
                        </div>
    `;
  };
  exports.printPassage = function(passage){
       var ret = '';
        ret += `
        <div class="passage_`+passage._id+` passage">
            <div class="passage_author">`;
            if(passage.author){
                ret += `<div><a class="basic_link" href="/user/`+passage.author._id+`">`+passage.author.name+`</a></div>`;
            }else{
                ret += `<div><a class="basic_link" href="#">Anonymous</a></div>`;
            }
            ret += `<div id="modal_`+passage._id+`" class="modal">
                <p>PASSAGE OPTIONS</p>
                <div class="passage_details">`;
                    //date.toDateString() in future
                    ret += `<p>Posted: `+passage.date+`</p>`;
                    if(passage.author){
                        ret += `<p>By: `+passage.author.name+` </p>`;
                    }else{
                        ret += `<p>By: Anonymous</p>`;
                    }
                    ret += `<p>`+passage.stars.length+` Stars </p>
                </div>`;
              ret += `<textarea class="control_textarea">`+passage.content+`</textarea>
              Properties:
              <br><br>
              `;
              var i = 0;
              var metadata = JSON.parse(passage.metadata);
              for (let [key, value] of Object.entries(metadata)) {
                    ret += exports.printPropertySelect(key, value);
                }
              ret += `<p class="passage_update">Update passage</p>
              <p class="passage_delete_`+passage._id+`">Delete passage</p>
              <div class="passage_id">`+passage._id+`</div>
            </div>
             <a class="basic_link" href="#modal_`+passage._id+`" rel="modal:open"><ion-icon title="Details"src="/images/ionicons/settings-sharp.svg"></ion-icon></a>
             <ion-icon class="square_icon"title="Add to Queue"src="/images/ionicons/square-outline.svg"></ion-icon>
             <ion-icon id="star_`+passage._id+`"title="Star"class="star_icon" src="/images/ionicons/star-outline.svg"></ion-icon>
             <ion-icon title="Content Warning" class="flag_icon" src="/images/ionicons/flag-sharp.svg"></ion-icon>
             <ion-icon title="Duplicate" src="/images/ionicons/duplicate-outline.svg"></ion-icon>
             <ion-icon title="Play" src="/images/ionicons/play-circle-sharp.svg"></ion-icon>


            </div>
            <input type="hidden" class="original_passage_content" value="`+passage.content+`"/>
                <div class="passage_chapter">Sasame</div>
            <div class="passage_content">`+ passage.content+`</div>
            <canvas class="passage_canvas"></canvas>
            <div class="sub_passages">`;
                passage.passages.forEach(function(sub){
                    ret += `<div class="sub_passage">
                    <div class="passage_author">`;
                    if(sub.author){
                         ret += `<div><a>`+sub.author.name+`</a></div>`;
                     }else{
                         ret += `<div><a class="basic_link" href="#">Anonymous</a></div>`;
                     }
                     ret += `<div id="modal_`+sub._id+`" class="modal">
                        <p>PASSAGE OPTIONS</p>
                      <textarea class="control_textarea">`+sub.content+`</textarea>
                      <p>Update passage</p>
                      <p>Delete passage</p>
                      <a href="#" rel="modal:close">Close</a>
                    </div>
                     <a class="basic_link" href="#modal_`+sub._id+`" rel="modal:open"><ion-icon title="Details"src="/images/ionicons/settings-sharp.svg"></ion-icon></a>
                     <ion-icon title="Star"class="star_icon"src="/images/ionicons/star-outline.svg"></ion-icon>

                    </div>
                    <input type="hidden" class="original_passage_content" value="`+sub.content+`"/>
                        <div class="passage_chapter">Sasame</div>
                    <div class="passage_content">`+f.content+`</div>
                    <canvas class="passage_canvas"></canvas>
                    <div class="passage_id">`+f._id+`</div>
                    </div>`;
                });
                ret += `<div class="add_sub_passage"><a class="add_sub_passage_modal basic_link"href="#modal_add_sub_passage" rel="modal:open"><ion-icon title="Add Sub Passage"src="/images/ionicons/add-circle-outline.svg"></ion-icon></a></div>
            </div>

        </div>`;
        return ret;
  };
  exports.printChapter = function(chapter){
    var ret = '';
    ret += `
    <div class="category">
        <!-- For Future
        <div class="chapter_flag">
            <ion-icon title="Content Warning" name="flag"></ion-icon>
        </div>
         -->
        <div>
            <a class="link" href="/sasasame/`+chapter.title+`/`+chapter._id+`">`+chapter.title+`</a>
        </div>
        <div class="category_id">`+chapter._id+`</div>
    </div>`;
    return ret;
  };

}(typeof exports === 'undefined' ? this.share = {} : exports));