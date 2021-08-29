/*! 7OS -Web dnav: https://github.com/soswapp/faderbox.soswapp
  ! Requires soswapp/theme.soswapp available @ https://github.com/soswapp/theme.soswapp
*/
if (typeof sos === 'undefined') window.sos = {}; // Seven OS
if ( typeof sos.config !== 'object' ) sos.config = {};
sos.faderBox = {
  overlay : function (theme = "light", loader = true, exitBtn = true, callback) {
    theme = theme in ["dark", "light"] ? theme : "light";
    let vi = $(document).find(".sos-fbx-overlay").length;
    let wrapper = $(`<div id="sos-fbx-wrp-${vi}" data-index="${vi}" class="sos-fbx-overlay ${theme}"> <div class="sos-fbx-content"></div></div>`);
    // exit button
    if (exitBtn === true) wrapper.append($(`<button class="sos-btn sos-fbx-exit" data-vi="${vi}"><i class="fas fa-times"></i></button></button>`));
    // loader
    if (loader) wrapper.append($(`<div class="sos-fbx-loader"><i class="fas fa-spinner fa-pulse"></i></div>`));
    $('body').append(wrapper).addClass('no-scroll');
    let view = $(document).find(`#sos-fbx-wrp-${vi}`);
    view.css("z-index",500001 + vi);
    view.animate({opacity:1},300,function(){
      if (typeof callback === 'function') {
        callback(vi);
      }
    });
  },
  url : function(url, pdata, option = {method : 'get', overlay : true, showLoader: true, coc:false, dataType:'text', theme: 'light', exitBtn: true}, callBack){
    let options = {
      method    : 'get',
      overlay   : true,
      showLoader: true,
      coc       : false,
      dataType  : 'text',
      theme     : 'light',
      exitBtn   : false
    }
    let optionVals = {
      method : ['post','get'],
      overlay : [true,false],
      showLoader : [true,false],
      coc : [true,false],
      exitBtn : [true,false],
      dataType : ['text','html','json','xml','script'],
      theme : ['light','dark']
    }
    if( option !== 'undefined' && typeof option =='object' ){
      $.each(option, function(key, val) {
        if( key in options && in_array(val, optionVals[key]) ){
          options[key] = val;
        }
      });
    }
    let doFetch = function(vi = 0){
      $.ajax({
        url       : url,
        // async     : false,
        type      : options.method,
        data      : pdata,
        dataType  : options.dataType,
        success : function(data){
          sos.faderBox.removeLoader();
          if( typeof callBack === 'undefined' ){
            let output = $(document).find(`.sos-fbx-content:eq(${vi})`);
            output.html(data);
            sos.faderBox.removeLoader(vi);
          }else{
            callBack(data);
            if( options.overlay || options.showLoader ) faderBox.close(vi);
          }
        },
        error: function(xhr, text){
          faderBox.close(vi);
          alert(`<h2>[5.1]: Error: (${xhr.status}) ${xhr.statusText} </h2> <p>Failed to load requested recources.</p>`,{type:'error'});
        }
      });
    };
    if ( options.overlay ) {
      sos.faderBox.overlay(options.theme, options.showLoader, options.exitBtn, doFetch);
    } else {
      doFetch();
    }
  },
  close : function(index){
    index = index ? index : ($(document).find('.sos-fbx-overlay').length ? $('.sos-fbx-overlay').last().data().index : false);
    if (index !== false) {
      let fader = $(document).find(`#sos-fbx-wrp-${index}`);
      if( fader.length > 0 ){
        fader.animate({opacity:0},250,function(){
          fader.remove();
          if ($(".sos-fbx-overlay").length <= 0) $('body').removeClass('no-scroll');
        });
      }
    }
  },
  removeLoader : function(index) {
    index = index ? index : ($(document).find('.sos-fbx-overlay').length ? $('.sos-fbx-overlay').last().data().index : false);
    if (index !== false) {
      let loader = $(document).find(`.sos-fbx-overlay:eq(${index})`).children(`.sos-fbx-loader`);
      if( loader.length > 0 ){
        loader.animate({opacity:0},250,function(){ loader.remove(); });
      }
    }
  },
  disableExit : function ( index = $('.sos-fbx-overlay').last().data().index) {
  },
  visIndex : function () {
    return ($('.sos-fbx-overlay').length > 0 ? $('.sos-fbx-overlay').last().data().index : null);
  } // visible overlay
};
sos.fbx = sos.faderBox;
window.faderBox = sos.faderBox; // will soon be discontinued
(function(){
  $(document).on("click", ".sos-fbx-exit", function(){
    sos.fbx.close($(this).data("vi"));
  });
})();
